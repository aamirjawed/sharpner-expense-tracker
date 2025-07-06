const User = require('../model/userModel')


const checkPremium = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId, {
            attributes:["isPremium"]
        })

        if(!user){
            console.log("User not found in premium check")
            req.isPremium = "No"
            return next();
        }

        req.isPremium = user.isPremium
        return next()
    } catch (error) {
        console.error("Error in checkPremium middleware:", error.message);
    req.isPremium = "No";
    return next();
    }
}

module.exports = checkPremium