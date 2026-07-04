const express = require("express");
const cors = require("cors");

const app = express();
const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const savedPlaceRoutes = require("./routes/savedPlaceRoutes");
const placeRoutes = require("./routes/placeRoutes");
const storyRoutes = require("./routes/storyRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");


app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/saved-places", savedPlaceRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);




app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "HeritageSphere Backend Running"
    });
});

const authMiddleware = require("./middleware/authMiddleware");

app.get(
    "/protected",
    authMiddleware,
    (req, res) => {

        res.json({
            success: true,
            message: "Protected Route Accessed",
            user: req.user
        });

    }
);

module.exports = app;