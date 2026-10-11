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
  let browser;

  try {
    const { to, patientName, sessionId, reportHtml } = req.body;

    if (!to || !patientName || !sessionId || !reportHtml) {
      return res.status(400).json({
        error: "Missing required fields."
      });
    }

    let pdfBuffer = null;

    try {
      const puppeteer = require("puppeteer-core");
      const chromium = require("@sparticuz/chromium");

      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
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

      pdfBuffer = await page.pdf({
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
      browser = null;
    } catch (pdfErr) {
      console.error("PDF generation failed, sending email without PDF:", pdfErr);

      if (browser) {
        await browser.close().catch(() => { });
        browser = null;
      }
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject: `FedWELL Health Check Report - ${sessionId}`,
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; color:#111827;">
          <p>Hello ${patientName},</p>
          <p>Please find your FedWELL health check report below.</p>
          ${pdfBuffer ? "<p>A PDF copy is also attached for saving or printing.</p>" : ""}
          <div style="margin-top:18px;">
            ${reportHtml}
          </div>
        </div>
      `
    };

    if (pdfBuffer) {
      mailOptions.attachments = [
        {
          filename: `FedWELL-Health-Check-${sessionId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ];
    }

    await transporter.sendMail(mailOptions);

    return res.json({
      message: pdfBuffer
        ? "Report emailed successfully with PDF attachment."
        : "Report emailed successfully, but PDF attachment could not be generated."
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