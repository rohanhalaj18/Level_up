// server/routes/recruiter.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const PlacementSession = require("../models/PlacementSession"); // ensure correct path

// IMPORTANT: set these env vars in your .env or process env:
// GMAIL_USER = yourgmail@gmail.com
// GMAIL_PASS = app-password (use App Password if 2FA enabled)
// FROM_NAME (optional) e.g. "Placement Team"

const Student = require("../models/Student");

// ---------------------- GET students (Migrated from server.js) ----------------------
router.get("/students", async (req, res) => {
  try {
    const students = await Student.find().lean();
    // Compute totalScore as done previously
    const withScore = students.map(s => ({
      ...s,
      id: s._id, // frontend expects 'id'
      totalScore: Math.round((s.aptitude + s.coding + (s.interview?.attitude || 0)) / 3)
    }));
    res.json({ students: withScore });
  } catch (err) {
    console.error("GET /students error", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------------- GET candidates ----------------------
router.get("/candidates", async (req, res) => {
  try {
    // simple: return last 30 sessions as candidate items
    const sessions = await PlacementSession.find()
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    // map to simplified candidate objects
    const candidates = sessions.map((s) => ({
      _id: s._id,
      candidate: s.interview?.candidate || s.candidate || {},
      round1: s.round1 || {},
      round2: s.round2 || {},
      currentRound: s.currentRound || 1,
      // use uploaded local file as resume link (developer requested): adjust path if needed
      resumeUrl: "/mnt/data/28fee6e4-c6ce-45b3-a846-831ba9e16270.png",
    }));

    return res.json({ candidates });
  } catch (err) {
    console.error("GET /candidates error", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------------- SEND MAIL ----------------------
router.post("/send-mail", async (req, res) => {
  try {
    const { to, subject, message, candidateId } = req.body;
    if (!to || !subject || !message)
      return res.status(400).json({ error: "Missing fields" });

    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_PASS;

    if (!user || !pass) {
      return res
        .status(500)
        .json({
          error: "Mail credentials not configured (GMAIL_USER / GMAIL_PASS)",
        });
    }

    // nodemailer transporter with Gmail SMTP (app password)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    const fromName = process.env.FROM_NAME || "Placement Team";
    const mailOptions = {
      from: `"${fromName}" <${user}>`,
      to,
      subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);

    // optional: mark candidate contacted in DB
    if (candidateId) {
      try {
        await PlacementSession.findByIdAndUpdate(candidateId, {
          $set: { "round2.contacted": true },
        });
      } catch (e) {
        console.warn("failed to mark contacted", e);
      }
    }

    return res.json({ ok: true, info: { messageId: info.messageId } });
  } catch (err) {
    console.error("POST /send-mail error", err);
    return res
      .status(500)
      .json({ error: "Failed to send mail", details: err.message });
  }
});

module.exports = router;
