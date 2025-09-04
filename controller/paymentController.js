const path = require("path");
const {
  createOrder,
  getPaymentStatus: fetchPaymentStatus,
} = require("../services/cashfreeService");
const Payment = require("../model/paymentModel");
const User = require("../model/userModel");

// Serve Payment Page
exports.getPaymentPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/cashfree.html"));
};

// Process Payment
exports.processPayment = async (req, res) => {
  const orderId = "ORDER-" + Date.now();
  const orderAmount = 2000.0;
  const orderCurrency = "INR";
  const customerId = req.userId;
  const customerPhone = "9999999999";

  try {
    // Create payment session from Cashfree service
    const paymentSessionId = await createOrder(
      orderId,
      orderAmount,
      orderCurrency,
      customerId,
      customerPhone
    );

    if (!paymentSessionId) {
      return res
        .status(500)
        .json({ message: "Failed to create payment session" });
    }

    // Save payment record in MongoDB
    await Payment.create({
      orderId,
      paymentSessionId,
      userId: customerId,
      orderAmount,
      orderCurrency,
      paymentStatus: "Pending",
    });

    return res.status(200).json({ paymentSessionId, orderId });
  } catch (error) {
    console.error("Error in processPayment:", error.message);
    return res.status(500).json({ message: "Error processing payment" });
  }
};

// Get Payment Status
exports.getPaymentStatus = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // Find payment record
    const order = await Payment.findOne({ orderId });
    const user = await User.findById(req.userId); // Mongo version

    if (!order) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    // Call Cashfree service to check status
    const orderStatus = await fetchPaymentStatus(orderId);

    console.log("Cashfree status for", orderId, "=>", orderStatus);

    order.paymentStatus = orderStatus;

    // If success, upgrade user to Premium
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
