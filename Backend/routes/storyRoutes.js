const express = require("express");

const router = express.Router();
const upload = require("../middleware/upload");

const authMiddleware =
require("../middleware/authMiddleware");

const isAdmin =
require("../middleware/adminMiddleware");

const {
  getAdminStories,
  getAdminStoryById,

  createStory,
  updateStory,
  deleteStory,

  getAllStories,
  getStoryDetails

} = require("../controllers/storyController");



// admin
router.get(

"/admin",

authMiddleware,

isAdmin,

getAdminStories

);

router.get(

"/admin/:id",

authMiddleware,

isAdmin,

getAdminStoryById

);

router.post(

  "/admin",

  authMiddleware,

  isAdmin,

  upload.fields([
  {
    name: "cover_image",
    maxCount: 1,
  },
  {
    name: "chapterImages",
    maxCount: 50,
  },
]),

  createStory

);

router.put(

  "/admin/:id",

  authMiddleware,

  isAdmin,

 upload.fields([
  {
    name: "cover_image",
    maxCount: 1,
  },
  {
    name: "chapterImages",
    maxCount: 50,
  },
]),

  updateStory

);



router.delete(

  "/admin/:id",

  authMiddleware,

  isAdmin,

  deleteStory

);







// public

router.get("/",getAllStories);
router.get("/:slug",getStoryDetails);



module.exports = router;