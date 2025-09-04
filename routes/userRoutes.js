const express = require('express');
const { sendLoginHTML, sendSignupHTML, userLogin, myProfile, premiumOrNot, forgotPasswordPage, forgotPassword, resetPasswordPage, resetPassword, registerUser } = require('../controller/userController');
const verifyToken = require('../middleware/authMiddleware');
const checkPremium = require('../middleware/isPremium');
const {getUserLeaderboard} = require('../controller/premiumFeatures');

const router = express.Router();

router.get('/login', sendLoginHTML)
router.post('/login', userLogin)


router.get('/signup', sendSignupHTML)
router.post('/signup', registerUser)

router.get('/me',verifyToken, myProfile)


// routes to check if user is premium or not and give access to something that only can have by premium user

router.get('/check-premium', verifyToken, checkPremium, premiumOrNot)

router.get('/all-users', verifyToken, checkPremium,  getUserLeaderboard)

// forgot password

router.get('/password/forgot-password', forgotPasswordPage)

router.post('/password/forgot-password', forgotPassword)

router.get(`/password/reset-password/:id`, resetPasswordPage)

router.post('/password/reset-password/:id', resetPassword)


module.exports = router