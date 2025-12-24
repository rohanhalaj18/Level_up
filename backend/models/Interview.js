const mongoose = require("mongoose");

const perQuestionSchema = new mongoose.Schema({
  question: String,
  transcript: String,
  correct_answer: String,
  score: Number,
  mistakes: [String],
  interviewer_expectation: String,
  metrics: {
    clarity: Number,
    correctness: Number,
    depth: Number,
    confidence: Number,
  },
});

const interviewSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },

  candidate: {
    name: String,
    role: String,
    experience: String,
    tech_stack: [String],
    style: String,
    difficulty: String,
  },

  // indexed question objects
  questions: [
    {
      index: Number,
      text: String,
    },
  ],

  // transcripts array aligned by questions order
  transcripts: [String],

  // analysis result
  per_question: [perQuestionSchema],

  overall: {
    overall_score: Number,
    strengths: [String],
    weaknesses: [String],
    advice: String,
    hire_probability: String,
  },

  status: { type: String, default: "pending" }, // 'pending' | 'processing' | 'done' | 'error'
});

module.exports = mongoose.model("Interview", interviewSchema);
