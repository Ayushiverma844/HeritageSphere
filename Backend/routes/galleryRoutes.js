const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const {

  uploadGalleryImages,
  getGalleryImages,
  updateGalleryCaption,
  deleteGalleryImage,

} = require("../controllers/galleryController");

// =====================================
// Public
// =====================================

// Get Gallery Images of Place

router.get(
  "/:placeId",
  getGalleryImages
);

// =====================================
// Admin
// =====================================

// Upload Multiple Gallery Images

router.post(
  "/admin/:placeId",
  authMiddleware,
  isAdmin,
  upload.array("gallery", 20),
  uploadGalleryImages
);

// Update Caption

router.put(
  "/admin/:imageId",
  authMiddleware,
  isAdmin,
  updateGalleryCaption
);

// Delete Gallery Image

router.delete(
  "/admin/:imageId",
  authMiddleware,
  isAdmin,
  deleteGalleryImage
);


module.exports = router;