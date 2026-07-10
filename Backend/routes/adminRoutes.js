const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");

const {


   

    // Places
    createPlace,
    updatePlace,
    deletePlace,

    // Place Details
    createPlaceDetails,
    updatePlaceDetails,
    deletePlaceDetails,

    // Stories
    createStory,
    updateStory,
    deleteStory,

    // Chapters
    createChapter,
    updateChapter,
    deleteChapter

} = require("../controllers/adminController");






// ==========================================
// Places
// ==========================================

router.post(
    "/places",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    createPlace
);

router.put(
    "/places/:placeId",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    updatePlace
);

router.delete(
    "/places/:placeId",
    authMiddleware,
    adminMiddleware,
    deletePlace
);


// ==========================================
// Place Details
// ==========================================

router.post(
    "/place-details",
    authMiddleware,
    adminMiddleware,
    createPlaceDetails
);

router.put(
    "/place-details/:placeId",
    authMiddleware,
    adminMiddleware,
    updatePlaceDetails
);

router.delete(
    "/place-details/:placeId",
    authMiddleware,
    adminMiddleware,
    deletePlaceDetails
);


// ==========================================
// Stories
// ==========================================

router.post(
    "/stories",
    authMiddleware,
    adminMiddleware,
    upload.single("cover_image"),
    createStory
);

router.put(
    "/stories/:storyId",
    authMiddleware,
    adminMiddleware,
    upload.single("cover_image"),
    updateStory
);

router.delete(
    "/stories/:storyId",
    authMiddleware,
    adminMiddleware,
    deleteStory
);


// ==========================================
// Story Chapters
// ==========================================

router.post(
    "/stories/:storyId/chapters",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    createChapter
);

router.put(
    "/chapters/:chapterId",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    updateChapter
);

router.delete(
    "/chapters/:chapterId",
    authMiddleware,
    adminMiddleware,
    deleteChapter
);


module.exports = router;