const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    addPlace ,
    updatePlace ,
    deletePlace,

    createPlaceDetails,
    updatePlaceDetails,
    deletePlaceDetails,

    createStory,
    updateStory,
    deleteStory,

} = require("../controllers/adminController");


// Add Place
router.post(
    "/places",
    authMiddleware,
    adminMiddleware,
    addPlace,
    
);

// Update Place
router.put(
    "/places/:id",
    authMiddleware,
    adminMiddleware,
    updatePlace
);

// Delete Place
router.delete(
    "/places/:id",
    authMiddleware,
    adminMiddleware,
    deletePlace
);

// Create Place Details
router.post(
    "/place-details",
    authMiddleware,
    adminMiddleware,
    createPlaceDetails
);

// Update Place Details
router.put(
    "/place-details/:placeId",
    authMiddleware,
    adminMiddleware,
    updatePlaceDetails
);

// Delete Place Details
router.delete(
    "/place-details/:placeId",
    authMiddleware,
    adminMiddleware,
    deletePlaceDetails
);

// Create Story
router.post(
    "/stories",
    authMiddleware,
    adminMiddleware,
    createStory
);

// Update Story
router.put(
    "/stories/:id",
    authMiddleware,
    adminMiddleware,
    updateStory
);

// Delete Story
router.delete(
    "/stories/:id",
    authMiddleware,
    adminMiddleware,
    deleteStory
);



module.exports = router;