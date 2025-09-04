const User = require("../model/userModel");

const checkPremium = async (req, res, next) => {
  try {
    // Find user by ID and select only isPremium field
    const user = await User.findById(req.userId).select("isPremium");

    console.log("User premium status:", user?.isPremium);

    if (!user || user.isPremium !== "Yes") {
      return res.status(403).json({
        message: "Access denied. Premium membership required.",
      });
    }

    req.isPremium = "Yes";
    return next();
  } catch (error) {
    console.error("Error in checkPremium middleware:", error.message);
    return res
      .status(500)
      .json({ message: "Server error during premium check." });
  }
};

module.exports = checkPremium;
