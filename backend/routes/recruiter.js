const express = require("express");
const router = express.Router();
const { sendRecruiterMail } = require("../utils/recruiterMail");

router.post("/contact-candidate", async (req, res) => {
  try {
    const { email, name, subject, message } = req.body;

    if (!email || !subject || !message)
      return res.status(400).json({ error: "Missing fields" });

    await sendRecruiterMail(email, name || "Candidate", subject, message);

    return res.json({ ok: true, msg: "Mail sent successfully" });
  } catch (err) {
    console.error("Contact mail error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
