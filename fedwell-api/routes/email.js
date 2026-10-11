const express = require("express");
const nodemailer = require("nodemailer");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

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
  let browser;

  try {
    const { to, patientName, sessionId, reportHtml } = req.body;

    if (!to || !patientName || !sessionId || !reportHtml) {
      return res.status(400).json({
        error: "Missing required fields."
      });
    }

    const isProduction = process.env.NODE_ENV === "production";

    browser = await puppeteer.launch({
      args: isProduction ? chromium.args : [],
      defaultViewport: chromium.defaultViewport,
      executablePath: isProduction
        ? await chromium.executablePath()
        : undefined,
      headless: chromium.headless
    });

    const page = await browser.newPage();

    const fullHtml = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>FedWELL Report ${sessionId}</title>
          <style>
            body {
              margin: 0;
              background: #ffffff;
              font-family: Arial, Helvetica, sans-serif;
            }

            table {
              page-break-inside: auto;
            }

            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }

            a {
              color: #0052cc;
            }
          </style>
        </head>
        <body>
          ${reportHtml}
        </body>
      </html>
    `;

    await page.setContent(fullHtml, {
      waitUntil: "networkidle0"
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm"
      }
    });

    await browser.close();

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject: `FedWELL Health Check Report - ${sessionId}`,

      // This keeps the printed report visible directly in the email body
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; color:#111827;">
          <p>Hello ${patientName},</p>
          <p>Please find your FedWELL health check report below. A PDF copy is also attached for saving or printing.</p>

          <div style="margin-top:18px;">
            ${reportHtml}
          </div>
        </div>
      `,

      // This attaches the same report as PDF
      attachments: [
        {
          filename: `FedWELL-Health-Check-${sessionId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    });

    return res.json({
      message: "Report emailed successfully with PDF attachment."
    });
  } catch (err) {
    if (browser) {
      await browser.close().catch(() => { });
    }

    console.error("Email report error:", err);

    return res.status(500).json({
      error: "Failed to send report."
    });
  }
});

module.exports = router;