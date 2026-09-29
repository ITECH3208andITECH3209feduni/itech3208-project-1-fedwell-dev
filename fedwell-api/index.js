require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const recordRoutes = require("./routes/records");
const emailRoutes = require("./routes/email");

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://itech3208-project-1-fedwell-dev-fed.vercel.app"
];

const corsOptions = {
  origin(origin, callback) {
    // Allows requests from tools like Postman/cURL and same-origin requests
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// Handles browser preflight requests
app.options(/.*/, cors(corsOptions));

app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({
    status: "FedWELL API is running",
    timestamp: new Date()
  });
});

app.use("/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/email", emailRoutes);

// Global error handler, including CORS errors
app.use((err, req, res, next) => {
  console.error("API error:", err);

  res.status(500).json({
    error: err.message || "Internal server error"
  });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`FedWELL API listening on port ${PORT}`);
  });
}

module.exports = app;