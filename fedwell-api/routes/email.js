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
    const {
      to,
      patientName,
      sessionId,
      reportHtml,
      pdfBase64
    } = req.body;

    if (!to || !patientName || !sessionId || !reportHtml) {
      return res.status(400).json({
        error: "Missing required fields."
      });
    }

    const attachments = [];

    if (pdfBase64) {
      attachments.push({
        filename: `FedWELL-Health-Check-${sessionId}.pdf`,
        content: Buffer.from(pdfBase64, "base64"),
        contentType: "application/pdf"
      });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject: `FedWELL Health Check Report - ${sessionId}`,
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; color:#111827;">
          <p>Hello ${patientName},</p>
          <p>Please find your FedWELL health check report below. A PDF copy is also attached for saving or printing.</p>

          <div style="margin-top:18px;">
            ${reportHtml}
          </div>
        </div>
      `,
      attachments
    });

    return res.json({
      message: pdfBase64
        ? "Report emailed successfully with PDF attachment."
        : "Report emailed successfully without PDF attachment."
    });
  } catch (err) {
    console.error("Email report error:", err);

    return res.status(500).json({
      error: err.message || "Failed to send report."
    });
  }
});

module.exports = router;