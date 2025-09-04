const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;










// const sequelize = require('../utils/db-connection')


// const Expense = sequelize.define('expenses', {
//     id:{
//         type:DataTypes.INTEGER,
//         primaryKey:true,
//         allowNull:false,
//         autoIncrement:true
//     },
//     amount:{
//         type:DataTypes.INTEGER,
//         allowNull:false
//     },
//     description:{
//         type:DataTypes.TEXT,
//         allowNull:false
//     },
//     category:{
//         type:DataTypes.STRING,
//         allowNull:false
//     },
//     userId:{
//         type:DataTypes.INTEGER,
//         allowNull:false
//     },
//     note:{
//         type:DataTypes.TEXT,
//         allowNull:false
//     }
    


// });



// module.exports = Expense