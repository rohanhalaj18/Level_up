const CollegeQuery = require("../models/CollegeQuery");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * 🧹 Clean Gemini JSON (remove markdown + extract [...])
 */
function cleanJSON(text) {
  if (!text) return "[]";

  let cleaned = text.replace(/```json|```/g, "").trim();

  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");

  if (start !== -1 && end !== -1) {
    cleaned = cleaned.slice(start, end + 1);
  }

  return cleaned;
}

/**
 * 🔁 Retry wrapper for Gemini API
 */
async function generateWithRetry(prompt, retries = 3, delay = 1500) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`⚡ Gemini attempt ${attempt}/${retries}`);

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.25, // structured + accurate
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

/**
 * 🎓 Controller: Find best colleges using Gemini AI
 */
exports.findColleges = async (req, res) => {
  try {
    let {
      careerGoal,
      currentLevel,
      stream,
      marks,
      exams,
      rank,
      location,
      collegeType,
      budgetRange,
      duration,
      learningStyle,
      campusLife,
    } = req.body;

    // Normalize exams
    if (typeof exams === "string") {
      exams = exams
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
    } else if (!Array.isArray(exams)) {
      exams = [];
    }

    // Normalize rank
    if (typeof rank === "string") {
      rank = rank
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean);
    } else if (!Array.isArray(rank)) {
      rank = [];
    }

    // Convert rank → number[]
    rank = rank.map((r) => Number(r)).filter((r) => !isNaN(r));

    // 🧠 Gemini prompt
    const prompt = `
You are a highly experienced Indian career counselor.
Use ALL the student's inputs realistically and professionally to recommend the BEST possible colleges in India.

Student Inputs:
- careerGoal: ${careerGoal}
- currentLevel: ${currentLevel}
- stream: ${stream}
- marks: ${marks}
- exams: ${exams}
- rank: ${rank}
- location: ${location}
- collegeType: ${collegeType}
- budgetRange: ${budgetRange}
- duration: ${duration}
- learningStyle: ${learningStyle}
- campusLife: ${campusLife}

Priority Order:
1. Career goal relevance
2. Entrance exam result / rank
3. Stream + marks eligibility
4. Budget + preferred location
5. College type preference
6. Learning style + campus environment
7. Placements, internships, faculty, course strengths

Task:
Recommend EXACTLY 5 colleges that are the BEST FIT for this student.
Avoid unrealistic or non-qualifying colleges.

Return ONLY valid JSON array in this exact format:

[
  {
    "collegeName": "string",
    "location": "string",
    "fitScore": number,
    "reason": "string",
    "approximateFees": "string",
    "entranceExam": "string",
    "link": "string"
  }
]

Rules:
- fitScore must be between 1–100
- reason must be personalized
- NO extra text
- NO markdown
`;

    // 🚀 Gemini call
    const raw = await generateWithRetry(prompt);

    // 🧹 Clean + parse
    let colleges;
    try {
      const cleaned = cleanJSON(raw);
      colleges = JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ JSON Parse Error:", err, "\nRaw:", raw);
      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON. Please try again.",
      });
    }

    // 💾 Save query
    const queryData = new CollegeQuery({
      careerGoal,
      currentLevel,
      stream,
      marks,
      exams,
      rank,
      location,
      collegeType,
      budgetRange,
      duration,
      learningStyle,
      campusLife,
      recommendedColleges: colleges,
    });

    await queryData.save();

    return res.status(200).json({
      success: true,
      message: "Top college recommendations generated successfully!",
      data: colleges,
    });
  } catch (error) {
    console.error("🔥 Error in College Finder:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while finding colleges.",
      error: error.message,
    });
  }
};
