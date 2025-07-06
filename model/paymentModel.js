const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection')

const Payment = sequelize.define('Payment', {
    orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    paymentSessionId : {
        type: DataTypes.STRING,
        allowNull: false
    },
    orderAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    orderCurrency: {
        type: DataTypes.STRING,
        allowNull: false
    },
    paymentStatus: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
}, {
    // Other model options go here
});

module.exports = Payment;


