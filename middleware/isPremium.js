const User = require("../model/userModel");

const checkPremium = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId, {
            attributes: ["isPremium"]
        });

        console.log("User premium status:", user?.isPremium); // debug log

        if (!user || user.isPremium !== "Yes") {
            return res.status(403).json({ message: "Access denied. Premium membership required." });
        }

        req.isPremium = "Yes";
        return next();

    } catch (error) {
        console.error("Error in checkPremium middleware:", error.message);
        return res.status(500).json({ message: "Server error during premium check." });
    }
};












// const User = require('../model/userModel')


// const checkPremium = async (req, res, next) => {
//     try {
//         const user = await User.findByPk(req.userId, {
//             attributes: ["isPremium"]
//         })

//         if (!user) {
//             console.log("User not found in premium check")
//             req.isPremium = "No"

//         }
//         if (user.isPremium) {
//             req.isPremium = user.isPremium
//             return next()
//         }


//         return res.status(403).json({ message: "Access denied. Premium membership required." });


//     } catch (error) {
//         console.error("Error in checkPremium middleware:", error.message);
//         req.isPremium = "No";

//     }
// }

module.exports = checkPremium