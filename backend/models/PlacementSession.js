const mongoose = require("mongoose");

const placementSessionSchema = new mongoose.Schema({
  round1: {
    questions: [
      {
        index: Number,
        question: String,
        options: [String],
        correctAnswer: {
          type: String,
          set: (v) => (Array.isArray(v) ? v[0] : v),
        },
      },
    ],
    userAnswers: [String],
    score: Number,
    status: { type: String, default: "pending" },
  },

  round2: {
    problems: [
      {
        index: Number,
        title: String,
        description: String,
        testCases: [{ input: String, output: String }],
        difficulty: String,
        languages: [String],
      },
    ],
    submissions: [
      {
        problemIndex: Number,
        language: String,
        source: String,
        results: [
          {
            passed: Number,
            total: Number,
            raw: [mongoose.Schema.Types.Mixed],
          },
        ],
      },
    ],
    score: Number,
    status: { type: String, default: "not_started" },
  },

  currentRound: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PlacementSession", placementSessionSchema);
