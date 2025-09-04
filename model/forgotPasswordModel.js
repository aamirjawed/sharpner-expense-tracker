const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const forgotPasswordSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4, 
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema);

module.exports = ForgotPassword;













// const sequelize = require('../utils/db-connection')
// const { v4: uuidv4 } = require('uuid');


// const ForgotPassword = sequelize.define('forgotpassowrdrequests', {
//     id:{
//         type:DataTypes.UUID,
//         defaultValue:DataTypes.UUIDV4,
//         allowNull:false,
//         primaryKey:true
//     },
//     userId:{
//         type:DataTypes.INTEGER,
//         allowNull:false
//     },
//     isActive:{
//         type:DataTypes.BOOLEAN,
//         allowNull:false,
//         defaultValue:true
//     }
// })


// module.exports = ForgotPassword