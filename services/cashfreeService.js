const { Cashfree, CFEnvironment } = require("cashfree-pg");

// Use environment variables in production
const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
 process.env.APP_ID,
  process.env.SECRET
);

// Create Order
exports.createOrder = async (
  orderId,
  orderAmount,
  orderCurrency = "INR",
  customerID,
  customerPhone
) => {
  try {
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
    const formattedExpiryDate = expiryDate.toISOString();

    const request = {
      order_id: orderId,
      order_amount: orderAmount,
      order_currency: orderCurrency,
      customer_details: {
        customer_id: customerID.toString(), // Must be string
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: `http://localhost:5000/payment/payment-status/${orderId}`,
        payment_methods: "ccc, upi, nb",
      },
      order_expiry_time: formattedExpiryDate,
    };

    console.log("Sending request to Cashfree:", request); //  Debug
    const response = await cashfree.PGCreateOrder(request);
    return response.data.payment_session_id;
  } catch (error) {
    console.error("Error creating order:", error.response?.data || error.message);
    throw new Error("Order creation failed");
  }
};


exports.getPaymentStatus = async (orderId) => {
  try {
    console.log();
    console.log();
    console.log(orderId);
    console.log();
    console.log();
    const response = await cashfree.PGOrderFetchPayments( orderId);

    let getOrderResponse = response.data;
    let orderStatus;
    let isPremium;

    if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "SUCCESS"
      ).length > 0
    ) {
      orderStatus = "Success";
      

    } else if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "PENDING"
      ).length > 0
    ) {
      orderStatus = "Pending";
    } else {
      orderStatus = "Failure";
    }

    return orderStatus;
  } catch (error) {
    console.error("Error fetching order status:", error.message);
  }
};


