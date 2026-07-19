const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// ==============================
// Database Connection
// ==============================
require("./config/db");

// ==============================
// Trust Proxy (Railway / Render)
// ==============================
app.set("trust proxy", 1);

// ==============================
// Security Headers
// ==============================
app.use(helmet());

// ==============================
// CORS Configuration
// ==============================
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without Origin (Postman, curl, etc.)
      if (!origin) return callback(null, true);

      if (
        process.env.NODE_ENV === "development" ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("CORS Policy: Origin Not Allowed"));
    },
    credentials: true,
  })
);

// ==============================
// Body Parser
// ==============================
app.use(express.json());

// ==============================
// Rate Limiter
// ==============================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 100,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// ==============================
// Routes
// ==============================
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const placeRoutes = require("./routes/placeRoutes");
const storyRoutes = require("./routes/storyRoutes");
const reviewRoutes = require("./routes/reviewroutes");
const categoryRoutes = require("./routes/categoryRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const searchRoutes = require("./routes/searchRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/collection", collectionRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/users", userRoutes);

// ==============================
// Home Route
// ==============================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HeritageSphere Backend Running ",
  });
});

// ==============================
// Protected Route
// ==============================
const authMiddleware = require("./middleware/authMiddleware");

app.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected Route Accessed",
    user: req.user,
  });
});

// ==============================
// 404 Handler
// ==============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ==============================
// Global Error Handler
// ==============================
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,

    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

module.exports = app;