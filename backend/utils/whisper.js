const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");


const WHISPER_CMD = process.env.WHISPER_CMD || "whisper";

async function transcribeWithWhisper(originalFilePath) {
  try {
    const uploadsDir = path.dirname(originalFilePath);

    // Run whisper normally (it will create multiple files)
    const cmd = `whisper "${originalFilePath}" --model base --language en --output_dir "${uploadsDir}" --output_format txt`;
    console.log("Running:", cmd);

    execSync(cmd, { stdio: "inherit" });

    // Whisper creates: <basename>.<ext>.txt OR <basename>.wav.txt
    const base = path.parse(originalFilePath).name; // filename without extension

    // possible outputs:
    const candidates = [
      path.join(uploadsDir, `${base}.txt`),
      path.join(uploadsDir, `${base}.wav.txt`),
      path.join(uploadsDir, `${base}.mp3.txt`),
      path.join(uploadsDir, `${base}.m4a.txt`),
      path.join(uploadsDir, `${base}.webm.txt`),
    ];

    let transcriptPath = "";

    for (const c of candidates) {
      if (fs.existsSync(c)) {
        transcriptPath = c;
        break;
      }
    }

    if (!transcriptPath) {
      console.warn("NO transcript file found!");
      return "";
    }

    let text = fs.readFileSync(transcriptPath, "utf8");

    // strip timestamps
    text = text.replace(/\[\d+:\d+\.\d+ --> \d+:\d+\.\d+\]/g, "").trim();

    // cleanup: delete audio + txt
    try {
      if (fs.existsSync(originalFilePath)) fs.unlinkSync(originalFilePath);
      if (fs.existsSync(transcriptPath)) fs.unlinkSync(transcriptPath);
    } catch {}

    return text;
  } catch (err) {
    console.error("Whisper error:", err);
    return "";
  }
}

module.exports = { transcribeWithWhisper };