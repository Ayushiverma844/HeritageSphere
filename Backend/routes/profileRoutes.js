const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const profileController = require("../controllers/profileController");
const upload = require("../middleware/upload");

router.get(
  "/",
  authMiddleware,
  profileController.getProfile
);

router.put(
  "/",
  authMiddleware,
  upload.single("profile_image"),
  profileController.updateProfile
);

router.put(
  "/password",
  authMiddleware,
  profileController.changePassword
);
module.exports = router;