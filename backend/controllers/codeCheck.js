const { GoogleGenerativeAI } = require("@google/generative-ai");

// INIT GEMINI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// CLEAN JSON (same logic, still needed)
function cleanGeminiJSON(text) {
  if (!text) return "{}";

  let cleaned = text
    .replace(/```json/g, "")
    .replace(/```javascript/g, "")
    .replace(/```js/g, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start !== -1 && end !== -1) {
    cleaned = cleaned.substring(start, end + 1);
  }

  return cleaned;
}

async function checkWithGemini(userCode, testCases) {
  const prompt = `
You are a strict JavaScript code evaluator.

User code:
${userCode}

Test cases:
${JSON.stringify(testCases, null, 2)}

Return ONLY valid JSON in this exact format:
{
  "passed": <number>,
  "failed": <number>,
  "details": [
    { "input": "...", "expected": "...", "output": "...", "status": "pass/fail" }
  ],
  "score": <0-100>
}
`;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  console.log("GEMINI RAW:", responseText);

  const cleaned = cleanGeminiJSON(responseText);
  console.log("GEMINI CLEANED:", cleaned);

  return JSON.parse(cleaned);
}

exports.runGeminiChecker = async (req, res) => {
  try {
    const { code, testCases, sessionId } = req.body;

    const result = await checkWithGemini(code, testCases);

    const PlacementSession = require("../models/PlacementSession");
    const session = await PlacementSession.findById(sessionId);

    session.round2.score = result.score;
    session.round2.status = result.score >= 60 ? "passed" : "failed";

    if (result.score >= 60) {
      session.currentRound = 3;
    }

    await session.save();

    return res.json(result);
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: err.message });
  }
};
