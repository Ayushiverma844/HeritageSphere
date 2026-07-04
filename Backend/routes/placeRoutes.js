const express = require("express");
const router = express.Router();

const placeController = require("../controllers/placeController");

router.get("/", placeController.getAllPlaces);
router.get("/:id/similar", placeController.getSimilarPlaces);
router.get("/:id", placeController.getPlaceDetails);


module.exports = router;