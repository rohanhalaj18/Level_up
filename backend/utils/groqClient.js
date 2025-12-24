const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function cleanJSON(text) {
  if (!text) return "{}";
  let cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1) cleaned = cleaned.slice(start, end + 1);
  return cleaned;
}

async function generateGroq(prompt, retries = 3) {
  for (let i = 1; i <= retries; i++) {
    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      });

      const text = completion.choices?.[0]?.message?.content;
      if (!text) throw new Error("No content from model");
      try {
        return JSON.parse(cleanJSON(text));
      } catch (e) {
        // fallback: try to parse if model returned array or slightly off JSON
        const cleaned = cleanJSON(text);
        return JSON.parse(cleaned);
      }
    } catch (err) {
      console.warn(`Groq attempt ${i} failed:`, err?.message || err);
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, 800));
    }
  }
}

module.exports = { generateGroq };
