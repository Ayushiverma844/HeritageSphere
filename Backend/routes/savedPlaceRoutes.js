const express = require("express");

const router = express.Router();

const { savePlace , getSavedPlaces ,  removeSavedPlace,
 } = require("../controllers/savedPlaceController");

const auth = require("../middleware/authMiddleware");

router.post("/", auth, savePlace);
router.get("/", auth, getSavedPlaces);
router.delete("/", auth, removeSavedPlace);
module.exports = router;