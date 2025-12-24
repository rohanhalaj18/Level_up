const nodemailer = require("nodemailer");
require("dotenv").config();

// Gmail-based transporter (exact same as your old project)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // app password required
  },
});

/**
 * Send Recruiter → Candidate email
 */
const sendRecruiterMail = async (
  candidateEmail,
  candidateName,
  subject,
  message
) => {
  await transporter.sendMail({
    from: `Recruiter Desk <${process.env.EMAIL_USER}>`,
    to: candidateEmail,
    subject,
    html: `
      <div style="font-family:Arial; line-height:1.6; color:#222;">
        <h2 style="color:#2ecc71;">Hello ${candidateName},</h2>
        <p>${message}</p>

        <br/>
        <p style="color:#555;">— Recruiter Team</p>

        <hr style="margin:20px 0;"/>
        <p style="font-size:12px; color:#888;">
          This is an automated recruitment message.
        </p>
      </div>
    `,
  });

  console.log("Mail sent →", candidateEmail);
};

module.exports = { sendRecruiterMail };
