const express = require("express");
const router = express.Router();

const placeController = require("../controllers/placeController");
const optionalAuth = require("../middleware/optionalAuth");


router.get("/", placeController.getAllPlaces);
router.get("/:id/similar", placeController.getSimilarPlaces);
router.get("/:id", optionalAuth ,placeController.getPlaceDetails);


module.exports = router;