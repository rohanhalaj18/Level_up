// models/CollegeQuery.js
const mongoose = require("mongoose");

const collegeQuerySchema = new mongoose.Schema(
  {
    // User input
    careerGoal: { type: String, required: true },
    currentLevel: String,
    stream: String,
    marks: Number,
    exams: [String],
    rank: [Number],
    location: String,
    collegeType: String,
    budgetRange: String,
    duration: String,
    learningStyle: String,
    campusLife: String,

    // Gemini response
    recommendedColleges: [
      {
        collegeName: String,
        location: String,
        fitScore: Number,
        reason: String,
        approximateFees: String,
        entranceExam: String,
        link: String,
      },
    ],

    // Track timestamps
  },
  { timestamps: true }
);

module.exports = mongoose.model("CollegeQuery", collegeQuerySchema);
