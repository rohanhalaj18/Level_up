const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  query: {
    type: String,
    required: [true, "Search query is required"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  role: {
    type: String,
    enum: [
      "School Student",
      "College Student",
      "Working Professional",
      "Lifelong Learner",
    ],
    required: [true, "User role is required"],
  },
  results: [
    {
      title: String,
      link: String,
      description: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model directly so callers can do: const Resource = require('./Resource');
module.exports = mongoose.model("Resource", resourceSchema);
