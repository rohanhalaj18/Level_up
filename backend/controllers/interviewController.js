const express = require("express");
const router = express.Router();
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

const Interview = require("../models/Interview");
const { transcribeWithWhisper } = require("../utils/whisper");
const { generateGroq } = require("../utils/groqClient");

// generate questions
router.post("/generate-questions", async (req, res) => {
  const {
    name,
    role = "Frontend Developer",
    experience = "Intermediate",
    tech_stack = [],
    style = "Mixed",
    difficulty = "Fixed",
  } = req.body;

  const prompt = `
Generate exactly 5 interview questions in this JSON format:

{
  "questions": [
    { "index": 1, "text": "..." },
    { "index": 2, "text": "..." },
    { "index": 3, "text": "..." },
    { "index": 4, "text": "..." },
    { "index": 5, "text": "..." }
  ]
}

Candidate:
Role: ${role}
Experience: ${experience}
Tech stack: ${Array.isArray(tech_stack) ? tech_stack.join(", ") : tech_stack}
Style: ${style}
Difficulty: ${difficulty}
`;

  try {
    const result = await generateGroq(prompt);
    if (Array.isArray(result.questions)) {
      return res.json({ questions: result.questions });
    } else if (Array.isArray(result)) {
      return res.json({ questions: result });
    } else {
      return res
        .status(500)
        .json({ error: "unexpected grok shape", raw: result });
    }
  } catch (err) {
    console.error("generate-questions error:", err);
    return res.status(500).json({ error: "Failed to generate questions" });
  }
});

// start interview (save questions)
router.post("/start", async (req, res) => {
  try {
    const { candidate, questions } = req.body;
    const interview = new Interview({
      candidate,
      questions: Array.isArray(questions)
        ? questions.map((q, i) => ({
            index: q.index ?? i + 1,
            text: typeof q === "string" ? q : q.text ?? q,
          }))
        : [],
      transcripts: [],
      status: "pending",
    });

    const saved = await interview.save();
    res.json({ sessionId: saved._id });
  } catch (err) {
    console.error("start error:", err);
    res.status(500).json({ error: "failed to start session" });
  }
});

// upload audios and start async processing
router.post("/upload-audios", async (req, res) => {
  const uploadDir = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    multiples: true,
    keepExtensions: true,
    uploadDir,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("form parse error:", err);
      return res.status(500).json({ error: "Upload parse error" });
    }

    try {
      const sessionId = fields.sessionId;
      if (!sessionId)
        return res.status(400).json({ error: "sessionId required" });

      const interview = await Interview.findById(sessionId);
      if (!interview)
        return res.status(404).json({ error: "Session not found" });

      // save raw file paths for later processing
      const savedPaths = [];

      for (let i = 0; i < interview.questions.length; i++) {
        const key = `audio${i}`;
        const file = files[key];
        if (!file) {
          savedPaths.push(null);
          continue;
        }
        const filePath = file.filepath || file.path;
        savedPaths.push(filePath);
      }

      // mark interview as processing and save file list in transcripts temporarily
      interview.status = "processing";
      await interview.save();

      // respond immediately while processing continues asynchronously
      res.json({ sessionId, status: "processing" });

      // Async worker: transcribe & analyze
      (async () => {
        try {
          const transcripts = [];
          for (let i = 0; i < interview.questions.length; i++) {
            const p = savedPaths[i];
            if (!p) {
              transcripts.push("");
              continue;
            }
            const t = await transcribeWithWhisper(p);
            transcripts.push(t);

            // cleanup audio + txt
            try {
              if (fs.existsSync(p)) fs.unlinkSync(p);
              const txt = `${p}.txt`;
              if (fs.existsSync(txt)) fs.unlinkSync(txt);
            } catch (cleanupErr) {
              console.warn("cleanup failed:", cleanupErr);
            }
          }

          interview.transcripts = transcripts;

          // build analysis prompt using q.text
          const analysisPrompt = `Analyze this interview. Follow the scoring formula strictly.

Candidate:
Role: ${interview.candidate.role}
Experience: ${interview.candidate.experience}
Tech stack: ${interview.candidate.tech_stack.join(", ")}
Style: ${interview.candidate.style}
Difficulty: ${interview.candidate.difficulty}

Questions + Answers:
${interview.questions
  .map((q, i) => {
    const questionText =
      q.text || (typeof q === "string" ? q : JSON.stringify(q));
    const answerText = transcripts[i] || "";
    return `${i + 1}. Q: ${questionText}\nA: ${answerText}`;
  })
  .join("\n\n")}

You MUST evaluate each question using this exact scoring formula:

clarity: 0–10  
correctness: 0–10  
depth: 0–10  
confidence: 0–10  

score = round((clarity * 0.25) + (correctness * 0.40) + (depth * 0.25) + (confidence * 0.10))

For each question, return:
- key mistakes
- expectations
- metrics (clarity, correctness, depth, confidence)
- computed score (MUST follow formula)

Overall score = round(average of all question scores)

Hire probability:
- High (score ≥ 8)
- Medium (6–7)
- Low (4–5)
- Very Low (<4)

Return STRICT JSON only in this format:

{
  "per_question": [
    {
      "question": "",
      "transcript": "",
      "correct_answer": "",
      "score": 0,
      "mistakes": [],
      "interviewer_expectation": "",
      "metrics": { "clarity": 0, "correctness": 0, "depth": 0, "confidence": 0 }
    }
  ],
  "overall": {
    "overall_score": 0,
    "strengths": [],
    "weaknesses": [],
    "advice": "",
    "hire_probability": ""
  }
}

      `;

          const result = await generateGroq(analysisPrompt);

          interview.per_question =
            result.per_question || result.perQuestion || [];
          interview.overall = result.overall || result.summary || {};
          interview.status = "done";
          await interview.save();
        } catch (procErr) {
          console.error("async processing error:", procErr);
          interview.status = "error";
          await interview.save();
        }
      })();
    } catch (e) {
      console.error("processing start error:", e);
      return res
        .status(500)
        .json({ error: "processing failed", details: e.message || e });
    }
  });
});

// pollable endpoint for result
router.get("/result/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const interview = await Interview.findById(id).lean();
    if (!interview) return res.status(404).json({ error: "not found" });
    return res.json({ status: interview.status, interview });
  } catch (err) {
    console.error("result error:", err);
    return res.status(500).json({ error: "failed to fetch result" });
  }
});

router.get("/result/:id", async (req, res) => {
  const interview = await Interview.findById(req.params.id);

  if (!interview) return res.status(404).json({ error: "Session not found" });

  return res.json(interview);
});


module.exports = router;
