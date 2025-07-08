const path = require('path');
const { createOrder, getPaymentStatus: fetchPaymentStatus} = require('../services/cashfreeService');
const Payment = require('../model/paymentModel');
const User = require('../model/userModel');
const sequelize = require('../utils/db-connection');

// Serve Payment Page
exports.getPaymentPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/cashfree.html'));
};

// Process Payment
exports.processPayment = async (req, res) => {
  const orderId = "ORDER-" + Date.now();
  const orderAmount = 2000.0;
  const orderCurrency = "INR";
  const customerId = req.userId; 
  const customerPhone = "9999999999";

  try {
    const t = await sequelize.transaction()
    const paymentSessionId = await createOrder(
      orderId,
      orderAmount,
      orderCurrency,
      customerId,
      customerPhone
    );

    if (!paymentSessionId) {
      await t.rollback()
      return res.status(500).json({ message: "Failed to create payment session" });
    }

    await Payment.create({
      orderId,
      paymentSessionId,
      userId:customerId,
      orderAmount,
      orderCurrency,
      paymentStatus: "Pending"
    }, {transaction:t});

    await t.commit()
    return res.status(200).json({ paymentSessionId, orderId });
    
  } catch (error) {
    await t.rollback()
    console.error("Error in processPayment:", error.message);
    return res.status(500).json({ message: "Error processing payment" });
  }
};

exports.getPaymentStatus = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await Payment.findOne({ where: { orderId } });
    const user = await User.findByPk(req.userId) // getting user id so i can change isPremium

    if (!order) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    const orderStatus = await fetchPaymentStatus(orderId);

    console.log("Cashfree status for", orderId, "=>", orderStatus);

    order.paymentStatus = orderStatus;

   if (orderStatus === "Success" && user.isPremium !== "Yes") {
    user.isPremium = "Yes";    
    await user.save();          
  }

    

    await order.save();

    return res.status(200).json({ orderId, status: orderStatus });
  } catch (error) {
    console.error("Server error fetching payment status:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

