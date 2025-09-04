const express = require('express')
const { sentExpenseHTML, addExpense, fetchAllExpense, deleteExpense, downloadExpense } = require('../controller/expenseController')
const verifyToken = require('../middleware/authMiddleware')
const checkPremium = require('../middleware/isPremium');
const { viewReport, viewReportPage, getUserLeaderboard } = require('../controller/premiumFeatures');

const router = express()


router.get('/add-expense', verifyToken, sentExpenseHTML)
router.post('/add-expense',verifyToken, addExpense)

router.get('/all-expenses', verifyToken,fetchAllExpense)

router.delete('/delete-expense/:id', deleteExpense)

router.get('/download', verifyToken, checkPremium, downloadExpense)

router.get('/report', verifyToken, checkPremium, viewReportPage)
router.get('/view-report', verifyToken, checkPremium, viewReport)


module.exports = router