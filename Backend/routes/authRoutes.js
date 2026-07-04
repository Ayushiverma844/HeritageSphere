const express = require("express");

const router = express.Router();

const {
    signup , login , refreshToken
} = require("../controllers/authController");

router.post("/signup", signup);

router.post("/login", login);

router.post("/auth/refresh-token", refreshToken);

module.exports = router;