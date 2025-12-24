// utils/generateCoding.js
const { generateGroq } = require("./groqClient"); // your existing wrapper
const { cleanJSON } = require("./groqClient"); // if you have cleanJSON

async function generateCodingQuestions(company) {
  const prompt = `
You are an expert test-generator for coding placements.
Generate exactly 2 coding problems appropriate for company: ${company}.
Return STRICT JSON:

{
  "problems": [
    {
      "index": 1,
      "title": "Title",
      "description": "Problem statement. Provide clear input format and output format.",
      "testCases": [
          { "input":"3\\n1 2 3\\n", "output":"6\\n" },
          { "input":"4\\n10 -2 1 0\\n", "output":"9\\n" }
      ],
      "difficulty": "easy",
      "languages": ["python", "javascript"]
    }
  ]
}
`;
  const raw = await generateGroq(prompt);
  // assume generateGroq returns parsed JSON already; if string use cleanJSON
  if (raw && raw.problems) return raw.problems;
  // otherwise try to parse raw string
  if (typeof raw === "string") {
    const parsed = JSON.parse(cleanJSON(raw));
    return parsed.problems;
  }
  throw new Error("Invalid Grok response");
}



module.exports = { generateCodingQuestions };
