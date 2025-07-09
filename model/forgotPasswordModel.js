const {Sequelize, DataTypes} = require('sequelize')
const sequelize = require('../utils/db-connection')
const { v4: uuidv4 } = require('uuid');


const ForgotPassword = sequelize.define('forgotpassowrdrequests', {
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        allowNull:false,
        primaryKey:true
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    }
})


module.exports = ForgotPassword