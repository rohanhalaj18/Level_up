const { generateGroq } = require("./groqClient");

async function generateAptitudeQuestions(company) {
  const prompt = `
You are an expert aptitude test compiler for top Indian and global tech companies.

Generate aptitude questions EXACTLY in the following structured, JSON-only format:

{
  "questions": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A"
    }
  ]
}

Rules you MUST follow:

1. NO explanations — only the JSON.
2. Company-specific difficulty:
   - Service-based (TCS, Infosys, Wipro, Accenture) → moderate difficulty.
   - Product/MNC (Google, Amazon, Microsoft) → high difficulty.
3. Test areas:
   - Quantitative aptitude (time-speed-distance, profit-loss, percentages)
   - Logical reasoning (patterns, sequences)
   - Analytical ability (coding logic, data interpretation)
4. Provide unique questions.
5. Options must be tricky and close.
6. correctAnswer must match one option exactly.
7. Generate exactly 10 questions.

Candidate details:
Company: "${company}"
Purpose: Aptitude Round 1 of placement training
Goal: Evaluate logical and analytical intelligence.
`;

  const result = await generateGroq(prompt);
  return result.questions;
}

module.exports = { generateAptitudeQuestions };
