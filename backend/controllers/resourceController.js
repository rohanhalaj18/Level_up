const Resource = require("../models/Resource");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* -------------------------------------------------------------
   Clean JSON (remove markdown, extract {...})
------------------------------------------------------------- */
function cleanResourceJSON(text) {
  if (!text) return "{}";

  let cleaned = text.replace(/```json|```/g, "").trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start !== -1 && end !== -1) {
    cleaned = cleaned.slice(start, end + 1);
  }

  return cleaned;
}

/* -------------------------------------------------------------
   Retry Wrapper for Gemini
------------------------------------------------------------- */
async function generateWithRetry(prompt, retries = 3, delay = 1500) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Gemini attempt ${attempt}/${retries}`);

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
        },
      });

      return result.response.text();
    } catch (err) {
      console.warn(`⚠️ Gemini error (attempt ${attempt}): ${err.message}`);

      if (attempt === retries) throw err;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

/* -------------------------------------------------------------
   Main Resource Finder Controller
------------------------------------------------------------- */
exports.findResources = async (req, res) => {
  try {
    const { query, category, role } = req.body;

    if (!query || !category || !role) {
      return res.status(400).json({
        success: false,
        message: "Query, category, and role are required.",
      });
    }

    const prompt = `
You are an expert academic & career assistant.
User type: ${role}
Category: ${category}
Topic: ${query}

Generate exactly 5–7 learning resources.

Each resource must include:
- rank
- title
- link
- reason
- description

Rules:
1. No markdown
2. No explanations
3. No extra text
4. Return ONLY valid JSON in this exact format:

{
  "resources": [
    {
      "rank": 1,
      "title": "string",
      "link": "string",
      "reason": "string",
      "description": "string"
    }
  ]
}
`;

    // Call Gemini with retry
    const raw = await generateWithRetry(prompt);

    // Clean + parse JSON
    let parsed;
    try {
      const cleaned = cleanResourceJSON(raw);
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ JSON Parse Error:", err, "\nRaw text:", raw);

      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON format. Please try again.",
      });
    }

    if (!parsed.resources || !Array.isArray(parsed.resources)) {
      return res.status(500).json({
        success: false,
        message: "AI returned invalid resource structure.",
      });
    }

    // Save result
    const newResource = new Resource({
      query,
      category,
      role,
      results: parsed.resources,
    });

    await newResource.save();

    res.status(200).json({
      success: true,
      message: "Resources generated successfully!",
      resources: parsed.resources,
    });
  } catch (error) {
    console.error("🔥 Resource Generator Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while generating resources.",
      error: error.message,
    });
  }
};

/* -------------------------------------------------------------
   Fetch all resources
------------------------------------------------------------- */
exports.getUserResources = async (req, res) => {
  try {
    const data = await Resource.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("❌ Error in getUserResources:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user resources.",
    });
  }
};
