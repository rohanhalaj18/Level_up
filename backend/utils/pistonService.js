const axios = require("axios");

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

exports.runPiston = async ({ language, code, stdin }) => {
  try {
    const langMap = {
      javascript: { lang: "js", version: "18.15.0" },
      python: { lang: "python", version: "3.10.0" },
      cpp: { lang: "cpp", version: "10.2.0" },
    };

    const selected = langMap[language];

    if (!selected) throw new Error("Unsupported language");

    const body = {
      language: selected.lang,
      version: selected.version,
      files: [
        {
          name: `main.${selected.lang}`,
          content: code,
        },
      ],
      stdin: stdin || "",
      compile_timeout: 5000,
      run_timeout: 5000,
    };

    const res = await axios.post(PISTON_URL, body);
    return {
      stdout: res.data.run.stdout?.trim() || "",
      stderr: res.data.run.stderr || "",
      code: res.data.run.code,
    };
  } catch (err) {
    console.error("Piston error:", err.response?.data || err.message);
    return {
      stdout: "",
      stderr: "Execution error",
      code: -1,
    };
  }
};
