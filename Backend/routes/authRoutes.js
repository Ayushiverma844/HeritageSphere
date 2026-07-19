const express = require("express");

const router = express.Router();

const {
    signup , login ,logout, refreshToken , sendOTP , verifyOTP , forgotPassword,
    verifyForgotPasswordOTP,
    resetPassword
} = require("../controllers/authController");

router.post("/signup", signup);

router.post("/login", login);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

router.post("/logout", logout);
router.post("/refresh-token", refreshToken);


router.post("/forgot-password", forgotPassword);

router.post(
    "/forgot-password/verify-otp",
    verifyForgotPasswordOTP
);

router.post(
    "/reset-password",
    resetPassword
);


module.exports = router;