
const Expense = require("../model/expenseModel");
const User = require("../model/userModel");
const sequelize = require("../utils/db-connection");

const getUserLeaderboard  = async (req, res) => {
  try {

    const users = await User.findAll({
      attributes:["id","name" ]
    });

    const userAggregatedExpenses = await Expense.findAll({
      attributes:["userId", [sequelize.fn('sum', sequelize.col('amount')), "total_expense"]],
      group:["userId"]
    });

    const expenses = {}

    userAggregatedExpenses.forEach(exp => {
        expenses[exp.userId]  = parseFloat(exp.get("total_expense"))
    })

    var userLeaderboardDetails = []

    users.forEach((user) => {
        userLeaderboardDetails.push({name:user.name, total_expense:expenses[user.id] || 0})
    })

    console.log(userLeaderboardDetails)
    userLeaderboardDetails.sort((a,b) => b.total_expense - a.total_expense)
    res.status(200).json(userLeaderboardDetails)
    
  } catch (error) {
    console.log("Error in premium Features Controllers in get User leader board", error)
    res.status(500).json({error:"Server error"})
  }
}

module.exports = {getUserLeaderboard}