const Payment = require("../model/paymentModel")


const isPremium = async (req, res, next) => {
    try {
        const userId = req.userId

        const paidOrder = await Payment.findOne({
            where:{
                paymentStatus:"Success",
                customerId : userId
            }
        })

        req.userId.isPremium = !!paidOrder
        next()
    } catch (error) {
        console.error("Error checking premium status:", error);
    return res.status(500).json({ message: "Server error" });
    }
}


module.exports = isPremium