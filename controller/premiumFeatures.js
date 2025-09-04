const Expense = require("../model/expenseModel");
const User = require("../model/userModel");
const path = require("path");

const mongoose = require("mongoose");
// Leaderboard function
const getUserLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Expense.aggregate([
      {
        $group: {
          _id: "$userId", // group by userId
          totalExpense: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "users", // must match your collection name
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          fullName: "$user.fullName",
          email: "$user.email",
          totalExpense: 1,
        },
      },
      { $sort: { totalExpense: -1 } },
    ]);

    res.status(200).json({ success: true, users: leaderboard });
  } catch (error) {
    console.error("Error in getUserLeaderboard:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Serve Report Page (HTML)
const viewReportPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/report.html"));
};




const viewReport = async (req, res) => {
  try {
    const groupBy = req.query.groupBy || "day";

    let dateFormat;
    switch (groupBy) {
      case "day":
        dateFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        break;
      case "week":
        dateFormat = { $dateToString: { format: "%G-%V", date: "$createdAt" } }; // ISO week
        break;
      case "month":
        dateFormat = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid groupBy value" });
    }

    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    const expenses = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      {
        $project: {
          date: dateFormat,
          category: 1,
          description: 1,
          amount: 1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    const totalResult = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalAmount = totalResult.length > 0 ? totalResult[0].total : 0;

    return res.status(200).json({
      success: true,
      data: expenses,
      totalAmount: totalAmount.toFixed(2),
    });
  } catch (error) {
    console.error("Error in viewReport:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


module.exports = { getUserLeaderboard, viewReport, viewReportPage };
