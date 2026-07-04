const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    addImage,
    getImagesByPlace,
    deleteImage,
    setCoverImage
} = require("../controllers/galleryController");

// Add image
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    addImage
);

// Get images for a place
router.get(
    "/:placeId",
    getImagesByPlace
);

// Delete image
router.delete(
    "/:imageId",
    authMiddleware,
    adminMiddleware,
    deleteImage
);

// Set cover image
router.put(
    "/set-cover/:imageId",
    authMiddleware,
    adminMiddleware,
    setCoverImage
);

module.exports = router;