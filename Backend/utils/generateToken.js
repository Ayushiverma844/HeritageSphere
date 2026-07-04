const jwt = require("jsonwebtoken");

// Access Token (short life)
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id || user.user_id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );
};

// Refresh Token (long life)
const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id || user.user_id,
            role: user.role,
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    
};