

const Expense = require("../model/expenseModel");
const path = require('path')
const User = require("../model/userModel");
const { fn, col } = require('sequelize');
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



// view report - daily, weekly, monthly

const viewReportPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/report.html'))
}



const viewReport = async(req, res) => {
  try {
    const groupBy = req.query.groupBy || 'day';
    let format;

    switch(groupBy){
      case 'day':
        format = '%Y-%m-%d';
        break;

      case 'week':
        format = '%Y-W%u';  
        break;

      case 'month':
        format = '%Y-%m';
        break;

      default:
        return res.status(400).json({ message: "Invalid group by value" });
    }

    const expenses = await Expense.findAll({
  where: { userId: req.userId },
  attributes: [
    [fn('DATE_FORMAT', col('createdAt'), format), 'period'],
    [fn('SUM', col('amount')), 'totalAmount']
  ],
  group: [fn('DATE_FORMAT', col('createdAt'), format)],
  order: [[col('createdAt'), 'DESC']],
  raw: true
});


    return res.status(200).json({
      success: true,
      data: expenses
    });
  } catch (error) {
    console.error('Error in viewReport:', error); 
    return res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
}




module.exports = {getUserLeaderboard, viewReport, viewReportPage}