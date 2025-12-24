module.exports = {
  tcs: [
    {
      company: "tcs",
      problems: [
        {
          index: 1,
          title: "Sum of Two Numbers",
          description: "Given two integers a and b, print their sum.",
          difficulty: "easy",
          languages: ["javascript", "python", "cpp"],
          testCases: [
            { input: "2 3", output: "5" },
            { input: "10 5", output: "15" },
          ],
        },
      ],
    },

    {
      company: "infosys",
      problems: [
        {
          index: 1,
          title: "Check Palindrome",
          description:
            "Given a string s, print 'YES' if it's a palindrome. Otherwise print 'NO'.",
          difficulty: "easy",
          languages: ["javascript", "python", "cpp"],
          testCases: [
            { input: "racecar", output: "YES" },
            { input: "abc", output: "NO" },
          ],
        },
      ],
    },

    {
      company: "wipro",
      problems: [
        {
          index: 1,
          title: "Count Vowels",
          description: "Given a lowercase string, count the number of vowels.",
          difficulty: "easy",
          languages: ["javascript", "python", "cpp"],
          testCases: [
            { input: "hello", output: "2" },
            { input: "aeiou", output: "5" },
          ],
        },
      ],
    },
  ],
};
