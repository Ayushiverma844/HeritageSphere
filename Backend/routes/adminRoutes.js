const express = require("express");

const router = express.Router();

const adminController = require("../controllers/adminController");

// Optional Middleware
// const verifyToken = require("../middleware/verifyToken");
// const isAdmin = require("../middleware/isAdmin");

// ======================================================
// PLACE CRUD
// ======================================================

// Create Place
router.post(
    "/places",
    // verifyToken,
    // isAdmin,
    adminController.createPlace
);

// Update Place
router.put(
    "/places/:placeId",
    // verifyToken,
    // isAdmin,
    adminController.updatePlace
);

// Delete Place
router.delete(
    "/places/:placeId",
    // verifyToken,
    // isAdmin,
    adminController.deletePlace
);

// ======================================================
// PLACE DETAILS CRUD
// ======================================================

// Create Details
router.post(
    "/place-details",
    // verifyToken,
    // isAdmin,
    adminController.createPlaceDetails
);

// Update Details
router.put(
    "/place-details/:placeId",
    // verifyToken,
    // isAdmin,
    adminController.updatePlaceDetails
);

// Delete Details
router.delete(
    "/place-details/:placeId",
    // verifyToken,
    // isAdmin,
    adminController.deletePlaceDetails
);

// ======================================================
// STORY CRUD
// ======================================================

// Create Story
router.post(
    "/stories",
    // verifyToken,
    // isAdmin,
    adminController.createStory
);

// Update Story
router.put(
    "/stories/:id",
    // verifyToken,
    // isAdmin,
    adminController.updateStory
);

// Delete Story
router.delete(
    "/stories/:id",
    // verifyToken,
    // isAdmin,
    adminController.deleteStory
);

// ======================================================
// STORY CHAPTER CRUD
// ======================================================

// Create Chapter
router.post(
    "/chapters",
    // verifyToken,
    // isAdmin,
    adminController.createChapter
);

// Update Chapter
router.put(
    "/chapters/:id",
    // verifyToken,
    // isAdmin,
    adminController.updateChapter
);

// Delete Chapter
router.delete(
    "/chapters/:id",
    // verifyToken,
    // isAdmin,
    adminController.deleteChapter
);

module.exports = router;