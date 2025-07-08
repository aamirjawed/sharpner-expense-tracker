

const Expense = require("../model/expenseModel");
const User = require("../model/userModel");
const sequelize = require("../utils/db-connection");

const getUserLeaderboard  = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    
    const users = await User.findAll({
  attributes: ["id", "name", "totalExpense"],
  transaction: t,  
});


    console.log(users)


    var userLeaderboardDetails = []

    users.forEach((user) => {
        userLeaderboardDetails.push({name:user.name, total_expense:user.totalExpense || 0})
    })

    // console.log(userLeaderboardDetails)
    userLeaderboardDetails.sort((a,b) => b.total_expense - a.total_expense)
    await t.commit()
    res.status(200).json(userLeaderboardDetails)
    
  } catch (error) {
    await t.rollback()
    console.log("Error in premium Features Controllers in get User leader board", error)
    res.status(500).json({error:"Server error"})
  }
}

module.exports = {getUserLeaderboard}