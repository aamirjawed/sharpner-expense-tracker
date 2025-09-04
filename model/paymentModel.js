const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentSessionId: {
      type: String,
      required: true,
    },
    orderAmount: {
      type: Number, 
      required: true,
    },
    orderCurrency: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;












// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = require('../utils/db-connection')

// const Payment = sequelize.define('Payment', {
//     orderId: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         primaryKey: true
//     },
//     paymentSessionId : {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     orderAmount: {
//         type: DataTypes.FLOAT,
//         allowNull: false
//     },
//     orderCurrency: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     paymentStatus: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     userId:{
//             type:DataTypes.INTEGER,
//             allowNull:false
//         }
// }, {
//     // Other model options go here
// });

// module.exports = Payment;


