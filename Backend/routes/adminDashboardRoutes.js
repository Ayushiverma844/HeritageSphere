const express = require("express");

const router = express.Router();

const adminDashboardController = require("../controllers/adminDashboardController");

// Optional Middleware
// const verifyToken = require("../middleware/verifyToken");
// const isAdmin = require("../middleware/isAdmin");

// ======================================================
// Dashboard
// ======================================================

// Dashboard Statistics
router.get(
    "/stats",
    // verifyToken,
    // isAdmin,
    adminDashboardController.getDashboardStats
);

// Dashboard Analytics
router.get(
    "/analytics",
    // verifyToken,
    // isAdmin,
    adminDashboardController.getDashboardAnalytics
);

// ======================================================
// Recent Users
// ======================================================

router.get(
    "/users",
    // verifyToken,
    // isAdmin,
    adminDashboardController.getRecentUsers
);

// ======================================================
// Recent Places
// ======================================================

router.get(
    "/places",
    // verifyToken,
    // isAdmin,
    adminDashboardController.getRecentPlaces
);

// ======================================================
// Recent Stories
// ======================================================

router.get(
    "/stories",
    // verifyToken,
    // isAdmin,
    adminDashboardController.getRecentStories
);

module.exports = router;