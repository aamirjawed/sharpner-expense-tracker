const path = require('path');
const Expense = require('../model/expenseModel');
const User = require('../model/userModel');
const sequelize = require('../utils/db-connection');

const sentExpenseHTML = async (req, res) => {
    res.sendFile(path.join(__dirname, '../views/expense.html'));
};

const addExpense = async (req, res) => {
    const t = await sequelize.transaction();
    const { amount, description, category } = req.body;

    if (amount === undefined || description === undefined || category === undefined) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const expense = await Expense.create({
            amount: amount,
            description: description,
            category: category,
            userId: req.userId
        }, { transaction: t });

        if (!expense) {
            await t.rollback();
            return res.status(400).json({ message: "Error adding expense" });
        }

        const user = await User.findByPk(req.userId, { transaction: t });

        if (!user) {
            await t.rollback();
            return res.status(404).json({ message: "User not found" });
        }

        user.totalExpense += amount;
        await user.save({ transaction: t });

        await t.commit();

        res.status(201).json({ expense });
    } catch (error) {
        await t.rollback();
        console.log("Error on add Expense");
        res.status(500).json({ message: error.message });
    }
};

const fetchAllExpense = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ error: "Unauthorized: Id not found" });
        }

        const allExpenses = await Expense.findAll({
            where: {
                userId: req.userId
            }
        });

        res.status(200).json(allExpenses);
    } catch (error) {
        console.log(error + "Error in fetch all expenses");
        res.status(500).json({ error: "Server side error while fetching all expenses" });
    }
};

const deleteExpense = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Expense does not exist" });
    }

    const t = await sequelize.transaction();

    try {
        const expense = await Expense.findByPk(id, { transaction: t });

        if (!expense) {
            await t.rollback();
            return res.status(404).json({ error: "Expense not found" });
        }

        const user = await User.findByPk(expense.userId, { transaction: t });

        if (!user) {
            await t.rollback();
            return res.status(404).json({ error: "User not found" });
        }
        await expense.destroy({ transaction: t });
        user.totalExpense -= expense.amount;
        await user.save({ transaction: t });

        

        await t.commit();

        res.status(200).json({ message: "Expense deleted successfully" });

    } catch (error) {
        await t.rollback();
        console.error("Error deleting expense:", error);
        res.status(500).json({ error: "Server error while deleting expense" });
    }
};

module.exports = {
    sentExpenseHTML,
    addExpense,
    fetchAllExpense,
    deleteExpense
};
