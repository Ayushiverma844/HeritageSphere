const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {

    getDashboard,
    getDashboardStats,

    getRecentUsers,
    getRecentPlaces,
    getRecentStories,
    getRecentReviews

} = require("../controllers/adminDashboardController");

// ==========================================
// Dashboard
// ==========================================

router.get(
    "/dashboard/stats",
    authMiddleware,
    adminMiddleware,
    getDashboardStats
);

router.get(
    "/dashboard/recent-users",
    authMiddleware,
    adminMiddleware,
    getRecentUsers
);

router.get(
    "/dashboard/recent-places",
    authMiddleware,
    adminMiddleware,
    getRecentPlaces
);

router.get(
    "/dashboard/recent-stories",
    authMiddleware,
    adminMiddleware,
    getRecentStories
);

router.get(
    "/dashboard/recent-reviews",
    authMiddleware,
    adminMiddleware,
    getRecentReviews
);

router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    getDashboard
);

module.exports = router;