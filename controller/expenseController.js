const path = require('path')
const Expense = require('../model/expenseModel')
// const jwt = require('jsonwebtoken')
// const User = require('../model/userModel')
// const { error } = require('console')

const sentExpenseHTML = async (req, res) => {

    res.sendFile(path.join(__dirname, '../views/expense.html'))
}

const addExpense = async (req, res) => {
    const { amount, description, category } = req.body


    try {
        const expense = await Expense.create({
            amount: amount, description: description, category: category, userId: req.userId
        })

        if (!expense) {
            return res.status(400).json({ message: "Error adding expense" })
        }

        res.status(201).json({ expense })
    } catch (error) {
        console.log("Error on add Expense")
        res.status(500).json({ message: error.message })
    }
}

const fetchAllExpense = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ error: "Unauthorized: Id not found" })
        }

        const allExpenses = await Expense.findAll({
            where: {
                userId: req.userId
            }
        })

        res.status(200).json(allExpenses)
    } catch (error) {
        console.log(error + "Error in fetch all expenses")
        res.status(500).json({ error: "Server side error while fetching all expenses" })
    }
}

const deleteExpense = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: "Expense does not exist" })
        return
    }
    try {
        const expense = await Expense.findByPk(id);

        if(!expense){
            res.status(404).json({error:"Expense not found"})
            return
        }

        await expense.destroy()
        res.status(200).json({ message: "Expense deleted successfully" });

    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ error: "Server error while deleting expense" });
    }

}


module.exports = { sentExpenseHTML, addExpense, fetchAllExpense, deleteExpense }