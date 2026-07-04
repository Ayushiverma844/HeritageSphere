const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addReview,
    updateReview,
    deleteReview
} = require("../controllers/reviewController");

router.post("/", authMiddleware, addReview);

router.put("/:id", authMiddleware, updateReview);

router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;