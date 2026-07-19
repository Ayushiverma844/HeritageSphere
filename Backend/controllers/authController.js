const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const db = require("../config/db");
const transporter = require("../config/mail");

const {
    generateAccessToken,
    generateRefreshToken,
} = require("../utils/generateToken");

const generateOTP = require("../utils/generateOTP");
const sendOTPEmail = require("../utils/sendOTPEmail");


// ==========================================
// Signup
// ==========================================
const signup = async (req, res) => {
    try {
        let { name, email, password, otp } = req.body;

        name = name?.trim();
        email = email?.trim().toLowerCase();

        // ============================
        // Validation
        // ============================
        if (!name || !email || !password || !otp) {
            return res.status(400).json({
                success: false,
                message: "All fields including OTP are required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
            });
        }

        // ============================
        // Check Email Already Exists
        // ============================
        const [existingUser] = await db.query(
            `
            SELECT user_id
            FROM users
            WHERE email = ?
            `,
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        // ============================
        // Get Latest OTP
        // ============================
        const [otpRows] = await db.query(
            `
            SELECT *
            FROM email_otp
            WHERE email = ?
            AND purpose = 'VERIFY_EMAIL'
            ORDER BY otp_id DESC
            LIMIT 1
            `,
            [email]
        );

        if (otpRows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found. Please request a new OTP.",
            });
        }

        const otpRecord = otpRows[0];

        // ============================
        // OTP Expired
        // ============================
        if (new Date() > new Date(otpRecord.expires_at)) {

            await db.query(
                `
                DELETE FROM email_otp
                WHERE otp_id = ?
                `,
                [otpRecord.otp_id]
            );

            return res.status(400).json({
                success: false,
                message: "OTP expired. Please request a new OTP.",
            });
        }

        // ============================
        // OTP Match
        // ============================
        if (otpRecord.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // ============================
        // OTP Verified Check
        // ============================
        if (!otpRecord.is_verified) {
            return res.status(400).json({
                success: false,
                message: "Please verify OTP first.",
            });
        }

        // ============================
        // Hash Password
        // ============================
        const hashedPassword = await bcrypt.hash(password, 10);

        // ============================
        // Create User
        // ============================
        let result;

        try {
            const [insertResult] = await db.query(
                `
                INSERT INTO users
                (
                    name,
                    email,
                    password,
                    is_verified
                )
                VALUES (?, ?, ?, TRUE)
                `,
                [
                    name,
                    email,
                    hashedPassword,
                ]
            );

            result = insertResult;

        } catch (err) {

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    success: false,
                    message: "Email already registered",
                });
            }

            throw err;
        }

        // ============================
        // Delete Used OTP
        // ============================
        await db.query(
            `
            DELETE FROM email_otp
            WHERE email = ?
            AND purpose = 'VERIFY_EMAIL'
            `,
            [email]
        );

        // ============================
        // Generate Tokens
        // ============================
        const accessToken = generateAccessToken({
            user_id: result.insertId,
            role: "user",
        });

        const refreshToken = generateRefreshToken({
            user_id: result.insertId,
            role: "user",
        });

        // ============================
        // Response
        // ============================
        return res.status(201).json({
            success: true,
            message: "Account created successfully",

            accessToken,
            refreshToken,

            user: {
                user_id: result.insertId,
                name,
                email,
                role: "user",
                is_verified: true,
            },
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
// ==========================================
// Login
// ==========================================
const login = async (req, res) => {
    try {
        let { email, password } = req.body;

        email = email?.trim().toLowerCase();

        // ============================
        // Validation
        // ============================
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required",
            });
        }

        // ============================
        // Find User
        // ============================
        const [users] = await db.query(
            `
            SELECT *
            FROM users
            WHERE email = ?
            LIMIT 1
            `,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password",
            });
        }

        const user = users[0];

        // ============================
        // Check Email Verification
        // ============================
        if (!user.is_verified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in.",
            });
        }

        // ============================
        // Check Password
        // ============================
        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password",
            });
        }

        // ============================
        // Generate Tokens
        // ============================
        const accessToken = generateAccessToken({
            user_id: user.user_id,
            role: user.role,
        });

        const refreshToken = generateRefreshToken({
            user_id: user.user_id,
            role: user.role,
        });

        // ============================
        // Response
        // ============================
        return res.status(200).json({
            success: true,
            message: "Login successful",

            accessToken,
            refreshToken,

            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile_image: user.profile_image,
                is_verified: user.is_verified,
            },
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
// ==========================================
// Send OTP
// ==========================================
const sendOTP = async (req, res) => {
    console.log(req.body);
    try {
        let { email, purpose } = req.body;

        email = email?.trim().toLowerCase();

        // ============================
        // Validation
        // ============================
        if (!email || !purpose) {
            return res.status(400).json({
                success: false,
                message: "Email and purpose are required",
            });
        }

        const validPurposes = [
            "VERIFY_EMAIL",
            "FORGOT_PASSWORD",
        ];

        if (!validPurposes.includes(purpose)) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP purpose",
            });
        }

        // ============================
        // Check User
        // ============================
        const [users] = await db.query(
            `
            SELECT
                user_id,
                is_verified
            FROM users
            WHERE email = ?
            LIMIT 1
            `,
            [email]
        );

        // ============================
        // Signup OTP
        // ============================
        if (purpose === "VERIFY_EMAIL") {

            if (users.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Email already registered",
                });
            }

        }

        // ============================
        // Forgot Password OTP
        // ============================
        if (purpose === "FORGOT_PASSWORD") {

            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Email not registered",
                });
            }

            if (!users[0].is_verified) {
                return res.status(400).json({
                    success: false,
                    message: "Email is not verified",
                });
            }

        }

        // ============================
        // Generate OTP
        // ============================
        const otp = generateOTP();

        const expiresAt = new Date(
            Date.now() + 5 * 60 * 1000 // 5 minutes
        );

        // ============================
        // Remove Old OTP
        // ============================
        await db.query(
            `
            DELETE FROM email_otp
            WHERE email = ?
            AND purpose = ?
            `,
            [email, purpose]
        );

        // ============================
        // Save OTP
        // ============================
        await db.query(
            `
            INSERT INTO email_otp
            (
                email,
                otp,
                purpose,
                expires_at
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                email,
                otp,
                purpose,
                expiresAt,
            ]
        );

        // ============================
        // Email Subject
        // ============================
        const subject =
            purpose === "VERIFY_EMAIL"
                ? "HeritageSphere Email Verification OTP"
                : "HeritageSphere Reset Password OTP";

        // ============================
        // Send Email
        // ============================
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            html: `
                <div style="font-family:Arial;padding:20px">
                    <h2>HeritageSphere</h2>

                    <p>Your OTP is:</p>

                    <h1 style="
                        letter-spacing:6px;
                        color:#d4af37;
                    ">
                        ${otp}
                    </h1>

                    <p>
                        This OTP will expire in
                        <b>1 minutes</b>.
                    </p>

                    <p>
                        Please do not share this OTP with anyone.
                    </p>
                </div>
            `,
        });

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
// ==========================================
// Verify OTP
// ==========================================
const verifyOTP = async (req, res) => {
    try {
        let { email, otp, purpose } = req.body;

        email = email?.trim().toLowerCase();

        // ============================
        // Validation
        // ============================
        if (!email || !otp || !purpose) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP and purpose are required.",
            });
        }

        const validPurposes = [
            "VERIFY_EMAIL",
            "FORGOT_PASSWORD",
        ];

        if (!validPurposes.includes(purpose)) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP purpose.",
            });
        }

        // ============================
        // Get Latest OTP
        // ============================
        const [rows] = await db.query(
            `
            SELECT *
            FROM email_otp
            WHERE email = ?
            AND purpose = ?
            ORDER BY otp_id DESC
            LIMIT 1
            `,
            [email, purpose]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "OTP not found.",
            });
        }

        const otpRecord = rows[0];

        // ============================
        // OTP Expired
        // ============================
        if (new Date() > new Date(otpRecord.expires_at)) {

            await db.query(
                `
                DELETE FROM email_otp
                WHERE otp_id = ?
                `,
                [otpRecord.otp_id]
            );

            return res.status(400).json({
                success: false,
                message: "OTP expired. Please request a new OTP.",
            });
        }

        // ============================
        // OTP Match
        // ============================
        if (otpRecord.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP.",
            });
        }

        // ============================
        // Already Verified
        // ============================
        if (otpRecord.is_verified) {
            return res.status(200).json({
                success: true,
                message: "OTP already verified.",
            });
        }

        // ============================
        // Mark OTP Verified
        // ============================
        await db.query(
            `
            UPDATE email_otp
            SET is_verified = TRUE
            WHERE otp_id = ?
            `,
            [otpRecord.otp_id]
        );

        // ============================
        // Response
        // ============================
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully.",
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
// ==========================================
// Logout
// ==========================================
const logout = async (req, res) => {
    try {

        // If refresh tokens are stored in DB,
        // blacklist or delete them here.
        // Current project uses stateless JWT,
        // so only success response is required.

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
// ==========================================
// Forgot Password
// ==========================================
const forgotPassword = async (req, res) => {
    try {

        let { email } = req.body;

        email = email?.trim().toLowerCase();

        // ============================
        // Validation
        // ============================
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // ============================
        // Check User
        // ============================
        const [users] = await db.query(
            `
            SELECT
                user_id,
                name,
                is_verified
            FROM users
            WHERE email = ?
            LIMIT 1
            `,
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email.",
            });
        }

        const user = users[0];

        if (!user.is_verified) {
            return res.status(400).json({
                success: false,
                message: "Email is not verified.",
            });
        }

        // ============================
        // Remove Previous OTP
        // ============================
        await db.query(
            `
            DELETE FROM email_otp
            WHERE email = ?
            AND purpose = 'FORGOT_PASSWORD'
            `,
            [email]
        );

        // ============================
        // Generate OTP
        // ============================
        const otp = generateOTP();

        const expiresAt = new Date(
            Date.now() + 5 * 60 * 1000
        ); // 5 Minutes

        // ============================
        // Save OTP
        // ============================
        await db.query(
            `
            INSERT INTO email_otp
            (
                email,
                otp,
                purpose,
                expires_at
            )
            VALUES (?, ?, 'FORGOT_PASSWORD', ?)
            `,
            [
                email,
                otp,
                expiresAt,
            ]
        );

        // ============================
        // Send Email
        // ============================
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "HeritageSphere Password Reset OTP",
            html: `
                <div style="font-family:Arial;padding:20px">

                    <h2>HeritageSphere</h2>

                    <p>Hello ${user.name || "User"},</p>

                    <p>Your password reset OTP is:</p>

                    <h1 style="
                        color:#d4af37;
                        letter-spacing:6px;
                    ">
                        ${otp}
                    </h1>

                    <p>
                        This OTP will expire in
                        <b>1 minutes</b>.
                    </p>

                    <p>
                        Please do not share this OTP with anyone.
                    </p>

                </div>
            `,
        });

        // ============================
        // Response
        // ============================
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully.",
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
// ==========================================
// Verify Forgot Password OTP
// ==========================================
const verifyForgotPasswordOTP = async (req, res) => {
    try {

        let { email, otp } = req.body;

        email = email?.trim().toLowerCase();

        // ============================
        // Validation
        // ============================
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required.",
            });
        }

        // ============================
        // Get Latest OTP
        // ============================
        const [otpRows] = await db.query(
            `
            SELECT *
            FROM email_otp
            WHERE email = ?
            AND purpose = 'FORGOT_PASSWORD'
            ORDER BY otp_id DESC
            LIMIT 1
            `,
            [email]
        );

        if (otpRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "OTP not found.",
            });
        }

        const otpRecord = otpRows[0];

        // ============================
        // OTP Expired
        // ============================
        if (new Date() > new Date(otpRecord.expires_at)) {

            await db.query(
                `
                DELETE FROM email_otp
                WHERE otp_id = ?
                `,
                [otpRecord.otp_id]
            );

            return res.status(400).json({
                success: false,
                message: "OTP expired. Please request a new OTP.",
            });
        }

        // ============================
        // Invalid OTP
        // ============================
        if (otpRecord.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP.",
            });
        }

        // ============================
        // Already Verified
        // ============================
        if (otpRecord.is_verified) {
            return res.status(200).json({
                success: true,
                message: "OTP already verified.",
            });
        }

        // ============================
        // Mark OTP Verified
        // ============================
        await db.query(
            `
            UPDATE email_otp
            SET is_verified = TRUE
            WHERE otp_id = ?
            `,
            [otpRecord.otp_id]
        );

        // ============================
        // Response
        // ============================
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully.",
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
// ==========================================
// Reset Password
// ==========================================
const resetPassword = async (req, res) => {
    try {

        let {
            email,
            new_password,
            confirm_password
        } = req.body;

        email = email?.trim().toLowerCase();

        // ============================
        // Validation
        // ============================
        if (!email || !new_password || !confirm_password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        if (new_password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long.",
            });
        }

        if (new_password !== confirm_password) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match.",
            });
        }

        // ============================
        // Check User
        // ============================
        const [users] = await db.query(
            `
            SELECT
                user_id,
                password
            FROM users
            WHERE email = ?
            LIMIT 1
            `,
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const user = users[0];

        // ============================
        // Check Verified OTP
        // ============================
        const [otpRows] = await db.query(
            `
            SELECT *
            FROM email_otp
            WHERE email = ?
            AND purpose = 'FORGOT_PASSWORD'
            AND is_verified = TRUE
            ORDER BY otp_id DESC
            LIMIT 1
            `,
            [email]
        );

        if (otpRows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please verify OTP first.",
            });
        }

        const otpRecord = otpRows[0];

        // ============================
        // OTP Expired
        // ============================
        if (new Date() > new Date(otpRecord.expires_at)) {

            await db.query(
                `
                DELETE FROM email_otp
                WHERE otp_id = ?
                `,
                [otpRecord.otp_id]
            );

            return res.status(400).json({
                success: false,
                message: "OTP expired. Please request a new OTP.",
            });
        }

        // ============================
        // Prevent Same Password
        // ============================
        const isSamePassword = await bcrypt.compare(
            new_password,
            user.password
        );

        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from the old password.",
            });
        }

        // ============================
        // Hash Password
        // ============================
        const hashedPassword = await bcrypt.hash(
            new_password,
            10
        );

        // ============================
        // Update Password
        // ============================
        await db.query(
            `
            UPDATE users
            SET password = ?
            WHERE email = ?
            `,
            [
                hashedPassword,
                email,
            ]
        );

        // ============================
        // Delete Used OTP
        // ============================
        await db.query(
            `
            DELETE FROM email_otp
            WHERE email = ?
            AND purpose = 'FORGOT_PASSWORD'
            `,
            [email]
        );

        // ============================
        // Response
        // ============================
        return res.status(200).json({
            success: true,
            message: "Password reset successfully.",
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};


// refresh token
const refreshToken = async (req, res) => {
    try {

        const { token } = req.body;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Refresh token required"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET
        );
        // Check user still exists
const [users] = await db.query(
    `
    SELECT user_id, role
    FROM users
    WHERE user_id = ?
    `,
    [decoded.id]
);

if (users.length === 0) {
    return res.status(401).json({
        success: false,
        message: "User not found"
    });
}

// Generate fresh access token

        const newAccessToken = generateAccessToken({
            user_id:  users[0].user_id,
            role:  users[0].role
        });

        res.json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid Refresh Token"
        });

    }
};

module.exports = {
    signup,
    login,
    sendOTP,
    verifyOTP,
    logout,
    refreshToken,
    forgotPassword,
    verifyForgotPasswordOTP,
    resetPassword,
};