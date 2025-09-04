const express = require('express')
const verifyToken = require('../middleware/authMiddleware')
const { viewReportPage, viewReport, getUserLeaderboard } = require('../controller/premiumFeatures')
const checkPremium = require('../middleware/isPremium')


const router = express.Router()


router.get('/leaderboard', verifyToken, checkPremium, getUserLeaderboard)


module.exports = router;