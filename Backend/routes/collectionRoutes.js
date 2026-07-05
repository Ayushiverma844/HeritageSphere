const express = require("express");

const router = express.Router();

const {
  saveItem,
  getMyCollection,
  removeItem,
} = require("../controllers/collectionController");

const authMiddleware = require("../middleware/authMiddleware");

// ===========================
// Save Item
// ===========================
router.post("/save", authMiddleware, saveItem);

// ===========================
// Get My Collection
// ===========================
router.get("/", authMiddleware, getMyCollection);

// ===========================
// Remove Item
// ===========================
router.delete("/", authMiddleware, removeItem);

module.exports = router;