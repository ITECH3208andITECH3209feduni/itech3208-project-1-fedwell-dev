const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post("/send-report", async (req, res) => {
  try {
    const { to, patientName, sessionId, reportHtml } = req.body;

    if (!to || !patientName || !sessionId || !reportHtml) {
      return res.status(400).json({
        error: "Missing required fields."
      });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject: `FedWELL Health Check Report - ${sessionId}`,
      html: reportHtml
    });

    res.json({
      message: "Report emailed successfully."
    });
  } catch (err) {
    console.error("Email report error:", err);

    res.status(500).json({
      error: "Failed to send report."
    });
  }
});

module.exports = router;