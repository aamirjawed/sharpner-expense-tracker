const express = require('express');
const { sendLoginHTML, sendSignupHTML, userSignup, userLogin, myProfile, premiumOrNot } = require('../controller/userController');
const verifyToken = require('../middleware/authMiddleware');
const checkPremium = require('../middleware/isPremium');
const {getUserLeaderboard} = require('../controller/premiumFeatures');

const router = express.Router();

router.get('/login', sendLoginHTML)
router.post('/login', userLogin)


router.get('/signup', sendSignupHTML)
router.post('/signup', userSignup)

router.get('/me',verifyToken, myProfile)


// routes to check if user is premium or not and give access to something that only can have by premium user

router.get('/check-premium', verifyToken, checkPremium, premiumOrNot)

router.get('/all-users', verifyToken, checkPremium,  getUserLeaderboard)

module.exports = router