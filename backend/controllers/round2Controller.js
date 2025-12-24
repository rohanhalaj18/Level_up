// ------------------------------
// FINAL WORKING - STATIC PROBLEMS PER COMPANY
// NO PISTON, NO AI, NO SESSION LOGIC HERE
// ------------------------------

const PlacementSession = require("../models/PlacementSession");

// ---------------------------------------------
// STATIC QUESTION SET
// ---------------------------------------------
const COMPANY_PROBLEMS = {
  tcs: [
    {
      index: 1,
      title: "Find the Second Largest Number",
      description:
        "Given an array of integers, return the second largest distinct number.",
      testCases: [
        { input: "[1,5,2,9,7]", output: "7" },
        { input: "[10,10,9,8]", output: "9" },
      ],
    },
  ],

  infosys: [
    {
      index: 1,
      title: "Count Vowels in a String",
      description: "Return number of vowels in lowercase string.",
      testCases: [
        { input: '"engineer"', output: "4" },
        { input: '"aaaeeeiiiooouu"', output: "15" },
      ],
    },
  ],

  wipro: [
    {
      index: 1,
      title: "Check Palindrome",
      description: "Return true if string is palindrome.",
      testCases: [
        { input: '"racecar"', output: "true" },
        { input: '"hello"', output: "false" },
      ],
    },
  ],

  google: [
    {
      index: 1,
      title: "Two Sum",
      description: "Return indices of two numbers that sum to target.",
      testCases: [{ input: "[2,7,11,15],9", output: "[0,1]" }],
    },
  ],
};



exports.getProblems = async (req, res) => {
  try {
    const company = req.params.company.toLowerCase();
    const problems = COMPANY_PROBLEMS[company];

    if (!problems) {
      return res.status(404).json({ error: "Company not found" });
    }

    return res.json({ problems });
  } catch (err) {
    console.error("getProblems error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
