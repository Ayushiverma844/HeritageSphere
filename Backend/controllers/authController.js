const jwt = require("jsonwebtoken");
const db = require("../config/db");
const bcrypt = require("bcrypt");
const {
    generateAccessToken,
    generateRefreshToken
} = require("../utils/generateToken");

// ==========================================
// Signup
// ==========================================
const signup = async (req, res) => {

    try {

        let { name, email, password } = req.body;

        name = name?.trim();
        email = email?.trim().toLowerCase();

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

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
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            `
            INSERT INTO users
            (
                name,
                email,
                password
            )
            VALUES (?, ?, ?)
            `,
            [
                name,
                email,
                hashedPassword
            ]
        );

        const accessToken = generateAccessToken({
    user_id: result.insertId,
    role: "user"
});

const refreshTokenValue = generateRefreshToken({
    user_id: result.insertId,
    role: "user"
});

        res.status(201).json({

            success: true,

            message: "Account created successfully",

            accessToken,
            refreshToken : refreshTokenValue,

            user: {

               user_id: result.insertId,

                name,

                email,

                role: "user"

            }

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

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

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Email and Password are required"

            });

        }

        const [users] = await db.query(
            `
            SELECT *
            FROM users
            WHERE email = ?
            `,
            [email]
        );

        if (users.length === 0) {

            return res.status(401).json({

                success: false,

                message: "Invalid Email or Password"

            });

        }

        const user = users[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(401).json({

                success: false,

                message: "Invalid Email or Password"

            });

        }

        // JWT Token Generation
        const accessToken = generateAccessToken({
    user_id: user.user_id,
    role: user.role
});

const refreshTokenValue = generateRefreshToken({
    user_id: user.user_id,
    role: user.role
});

        res.status(200).json({

            success: true,

            message: "Login successful",

            accessToken,
            refreshToken : refreshTokenValue,

            user: {

                user_id: user.user_id,

                name: user.name,

                email: user.email,

                role: user.role,

                profile_image: user.profile_image

            }

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ==========================================
// Logout
// ==========================================
const logout = async (req, res) => {

    try {

        res.status(200).json({

            success: true,

            message: "Logout successful"

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


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

        const newAccessToken = generateAccessToken({
            user_id: decoded.user_id,
            role: decoded.role
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
    logout,
    refreshToken

};