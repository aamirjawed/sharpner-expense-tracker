const jwt = require("jsonwebtoken");
const path = require("path");

const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.cookies || {};

    // If no token, send login page
    if (!token) {
      return res.sendFile(path.join(__dirname, "../public/login.html"));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET);

    // Attach userId to request
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = verifyToken;
