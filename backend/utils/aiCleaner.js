// utils/aiCleaner.js
function cleanLLMJson(rawText) {
  if (!rawText || typeof rawText !== "string")
    throw new Error("No text to clean");
  let s = rawText.trim();

  // Remove Markdown code fences
  s = s.replace(/```(?:json)?/gi, "").replace(/```/g, "");

  // If content contains multiple JSON-like blocks, take the largest {...} block
  const braceBlocks = [];
  const stack = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "{") stack.push(i);
    if (s[i] === "}" && stack.length) {
      const start = stack.pop();
      if (stack.length === 0) {
        braceBlocks.push(s.slice(start, i + 1));
      }
    }
  }
  if (braceBlocks.length) {
    // choose the block with most braces (best chance)
    s = braceBlocks.sort((a, b) => b.length - a.length)[0];
  }

  // Common LLM issues: use double quotes for keys/strings
  // We'll attempt to safely JSON.parse; if fails, try small fixes:
  try {
    JSON.parse(s);
    return s;
  } catch (e) {
    // Fix single quotes -> double quotes (careful)
    let attempt = s.replace(/'/g, '"');

    // Remove trailing commas
    attempt = attempt.replace(/,(\s*[}\]])/g, "$1");

    // Remove weird control characters
    attempt = attempt.replace(/[\u0000-\u001F]+/g, "");

    // Try parse again
    try {
      JSON.parse(attempt);
      return attempt;
    } catch (ee) {
      
      const arrMatch =
        s.match(/"problems"\s*:\s*(\[[\s\S]*\])/) ||
        s.match(/problems\s*:\s*(\[[\s\S]*\])/i);
      if (arrMatch && arrMatch[1]) {
        const wrapped = `{"problems":${arrMatch[1]}}`;
        try {
          JSON.parse(wrapped);
          return wrapped;
        } catch (e3) {
       
          throw new Error("AI output JSON parsing failed");
        }
      }
      throw new Error("AI output JSON parsing failed");
    }
  }
}

module.exports = { cleanLLMJson };
