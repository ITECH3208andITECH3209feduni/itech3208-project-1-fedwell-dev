require("dotenv").config();

const express = require("express");

const authRoutes = require("./routes/auth");
const recordRoutes = require("./routes/records");
const emailRoutes = require("./routes/email");

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://itech3208-project-1-fedwell-dev-fed.vercel.app",
  "https://itech3208-project-1-fedwell-dev-fed-flame.vercel.app"
];

const isAllowedOrigin = origin => {
  if (!origin) return true;

  if (allowedOrigins.includes(origin)) return true;

  // Allows Vercel preview deployments for this project.
  if (
    origin.startsWith("https://itech3208-project-1-fedwell-dev-fed") &&
    origin.endsWith(".vercel.app")
  ) {
    return true;
  }

  return false;
};

// CORS must run before express.json() and before routes.
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  return next();
});

app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({
    status: "FedWELL API is running",
    timestamp: new Date(),
    origin: req.headers.origin || null
  });
});

app.get("/cors-test", (req, res) => {
  res.json({
    ok: true,
    message: "CORS test passed",
    origin: req.headers.origin || null
  });
});

app.use("/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/email", emailRoutes);

app.use((err, req, res, next) => {
  console.error("API error:", err);

  if (!res.headersSent) {
    res.status(500).json({
      error: err.message || "Internal server error"
    });
  }
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`FedWELL API listening on port ${PORT}`);
  });
}

module.exports = app;