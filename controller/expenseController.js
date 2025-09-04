const path = require("path");
const Expense = require("../model/expenseModel");
const User = require("../model/userModel");
const { Parser } = require("json2csv");

// Serve expense page
const sentExpenseHTML = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/expense.html"));
};

// Add new expense
const addExpense = async (req, res) => {
  const { amount, description, category, note } = req.body;

  if (!amount || !description || !category) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    // Create new expense
    const expense = await Expense.create({
      amount,
      description,
      category,
      userId: req.userId,
      note,
    });

    if (!expense) {
      return res
        .status(400)
        .json({ success: false, message: "Error adding expense" });
    }

    // Update totalExpense for user
    const user = await User.findById(req.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.totalExpense = (user.totalExpense || 0) + Number(amount);
    await user.save();

    res
      .status(201)
      .json({ success: true, message: "Expense added", expense });
  } catch (error) {
    console.error("Error on add Expense:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch all expenses of a user
const fetchAllExpense = async (req, res) => {
  try {
    if (!req.userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Id not found" });
    }

    const allExpenses = await Expense.find({ userId: req.userId });

    res.status(200).json({ success: true, data: allExpenses });
  } catch (error) {
    console.error("Error in fetch all expenses:", error);
    res.status(500).json({
      success: false,
      message: "Server side error while fetching all expenses",
    });
  }
};

// Delete an expense
const deleteExpense = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Expense id is required" });
  }

  try {
    const expense = await Expense.findById(id);

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    const user = await User.findById(expense.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await expense.deleteOne();

    user.totalExpense = (user.totalExpense || 0) - Number(expense.amount);
    if (user.totalExpense < 0) user.totalExpense = 0;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Download expenses as CSV
const downloadExpense = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).lean();

    const fields = [
      { label: "Amount", value: "amount" },
      { label: "Description", value: "description" },
      { label: "Category", value: "category" },
      { label: "Date", value: row => row.createdAt.toISOString().split("T")[0] }
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(expenses);

    res.header("Content-Type", "text/csv");
    res.attachment("expenses.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error downloading expenses:", error);
    res.status(500).json({ success: false, message: "Failed to download expenses" });
  }
};

module.exports = {
  sentExpenseHTML,
  addExpense,
  fetchAllExpense,
  deleteExpense,
  downloadExpense,
};
