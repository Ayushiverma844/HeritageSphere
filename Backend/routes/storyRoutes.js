const express = require("express");

const router = express.Router();

const storyController = require("../controllers/storyController");

router.get("/", storyController.getAllStories);
router.get("/:id", storyController.getStoryDetails);

module.exports = router;