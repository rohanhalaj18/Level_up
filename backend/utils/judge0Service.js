// backend/utils/judge0Service.js
// minimal wrapper around Judge0 (https://judge0.com). Configure JUDGE0_URL and JUDGE0_KEY in .env
const fetch = require("node-fetch");

const JUDGE0_URL =
  process.env.JUDGE0_URL || "https://judge0.p.rapidapi.com/submissions";
const JUDGE0_KEY = process.env.JUDGE0_KEY || "";

const LANG_MAP = {
  javascript: 63, // nodejs 14
  python: 71, // python3
  cpp: 54, // g++
};

async function judge0Evaluate({ source, language = "javascript", stdin = "" }) {
  const language_id = LANG_MAP[language] || LANG_MAP.javascript;

  // create submission
  const createUrl = `${JUDGE0_URL}?base64_encoded=false&wait=true`;
  const headers = {
    "Content-Type": "application/json",
  };
  if (JUDGE0_KEY) headers["X-RapidAPI-Key"] = JUDGE0_KEY; // or judge0 custom header
  const body = { source_code: source, language_id, stdin };

  const res = await fetch(createUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error("Judge0 call failed: " + res.status + " " + text);
  }
  const json = await res.json();
  // normalize: provide stdout or compile_output / stderr
  return {
    stdout: json.stdout || "",
    stderr: json.stderr || json.compile_output || "",
    raw: json,
  };
}

module.exports = { judge0Evaluate };
