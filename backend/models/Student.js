const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "Candidate" },
  aptitude: { type: Number, default: 0 },
  coding: { type: Number, default: 0 },
  interview: {
    happy: { type: Number, default: 0 },
    sad: { type: Number, default: 0 },
    attitude: { type: Number, default: 0 },
  },
  resume: { type: String, default: "" },
});

module.exports = mongoose.model("Student", StudentSchema);
