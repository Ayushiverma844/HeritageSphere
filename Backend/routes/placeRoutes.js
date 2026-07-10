const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  getAllPlaces,
  getPlaceDetails,
  getSimilarPlaces,

  getAllPlacesAdmin,
  getPlaceAdminById,
  createPlace,
  updatePlace,
  deletePlace

} = require("../controllers/placeController");
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const optionalAuth = require("../middleware/optionalAuth");

// ====================
// Admin
// ====================

router.get(
  "/admin",
  verifyToken,
  isAdmin,
  getAllPlacesAdmin
);

router.get(
  "/admin/:id",
  verifyToken,
  isAdmin,
  getPlaceAdminById
);

router.post(
  "/admin",
  verifyToken,
  isAdmin,
  upload.single("image"),
  createPlace
);

router.put(
  "/admin/:id",
  verifyToken,
  isAdmin,
  upload.single("image"),
  updatePlace
);

router.delete(
  "/admin/:id",
  verifyToken,
  isAdmin,
  deletePlace
);


// ====================
// Public
// ====================

router.get("/", getAllPlaces);
router.get("/:id/similar", getSimilarPlaces);
router.get("/:id", optionalAuth ,getPlaceDetails);



module.exports = router;