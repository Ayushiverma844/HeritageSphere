const jwt = require("jsonwebtoken");

const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // No token → continue as guest
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      req.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

    } catch (err) {
      // Invalid/Expired token → behave like guest
      req.user = null;
    }

    next();

  } catch (error) {
    console.log(error);

    req.user = null;
    next();
  }
};

module.exports = optionalAuth;