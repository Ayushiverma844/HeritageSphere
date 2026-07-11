const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const adminMiddleware =
require("../middleware/adminMiddleware");

const {

  getUsers,

  getUserById,

  updateUserRole,

  deleteUser

} = require("../controllers/userController");



// ==========================================
// Get All Users
// ==========================================

router.get(

  "/admin",

  authMiddleware,

  adminMiddleware,

  getUsers

);


// ==========================================
// Get User By Id
// ==========================================

router.get(

  "/admin/:id",

  authMiddleware,

  adminMiddleware,

  getUserById

);


// ==========================================
// Change Role
// ==========================================

router.patch(

  "/admin/:id/role",

  authMiddleware,

  adminMiddleware,

  updateUserRole

);


// ==========================================
// Delete User
// ==========================================

router.delete(

  "/admin/:id",

  authMiddleware,

  adminMiddleware,

  deleteUser

);


module.exports = router;