const express = require('express')
const { sentExpenseHTML, addExpense, fetchAllExpense, deleteExpense } = require('../controller/expenseController')
const verifyToken = require('../middleware/authMiddleware')

const router = express()


router.get('/add-expense', verifyToken, sentExpenseHTML)
router.post('/add-expense',verifyToken, addExpense)

router.get('/all-expenses', verifyToken,fetchAllExpense)

router.delete('/delete-expense/:id', deleteExpense)


module.exports = router