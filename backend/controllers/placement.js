const express = require("express");
const router = express.Router();

const PlacementSession = require("../models/PlacementSession");
const { generateAptitudeQuestions } = require("../utils/generateAptitude");
const { judge0Evaluate } = require("../utils/judge0Service");

const POINTS_PER_TESTCASE = Number(process.env.POINTS_PER_TESTCASE || 10);



router.post("/start-round-1", async (req, res) => {
  try {
    const { userId, company } = req.body;

    const questions = await generateAptitudeQuestions(company);

    const session = await PlacementSession.create({
      userId,
      round1: {
        questions,
        userAnswers: [],
        score: 0,
        status: "pending",
      },
      currentRound: 1,
    });

    res.json({
      message: "Round 1 started",
      sessionId: session._id,
      questions,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to start Round 1" });
  }
});
router.post("/submit-round-1", async (req, res) => {
  try {
    const { sessionId, userAnswers } = req.body;

    const session = await PlacementSession.findById(sessionId);

    if (!session) return res.status(404).json({ error: "Session not found" });

    const questions = session.round1.questions;

    let score = 0;

    questions.forEach((q, i) => {
      if (q.correctAnswer === userAnswers[i]) {
        score += 1;
      }
    });

    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 20; // pass if 50% or more

    // Save user result
    session.round1.userAnswers = userAnswers;
    session.round1.score = percentage;
    session.round1.status = passed ? "passed" : "failed";

    if (passed) {
      session.currentRound = 2;
    }

    await session.save();

    res.json({
      message: "Round 1 evaluated",
      score: percentage,
      passed,
    });
  } catch (err) {
    console.log("Round 1 Error:", err);
    res.status(500).json({ error: "Failed to submit answers" });
  }
});


router.get("/round-status/:sessionId", async (req, res) => {
  try {
    const session = await PlacementSession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    res.json({
      currentRound: session.currentRound,
      round1Status: session.round1.status,
    });
  } catch (err) {
    res.status(500).json({ error: "Error checking status" });
  }
});

router.post("/end-round", (req, res) => {
  const { answers, correctAnswers, startTime } = req.body;

  const endTime = Date.now();
  const timeTaken = Math.floor((endTime - startTime) / 1000);

  // calculate score
  let correct = 0;
  let wrong = [];

  answers.forEach((ans, idx) => {
    if (ans === correctAnswers[idx]) {
      correct++;
    } else {
      wrong.push({
        question: idx + 1,
        yourAns: ans,
        correctAns: correctAnswers[idx],
      });
    }
  });

  const responseData = {
    score: correct,
    total: answers.length,
    wrong,
    timeTaken,
  };

  res.json(responseData);
});



module.exports = router;