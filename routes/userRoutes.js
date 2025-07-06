const express = require('express');
const { sendLoginHTML, sendSignupHTML, userSignup, userLogin, myProfile, premiumOrNot } = require('../controller/userController');
const verifyToken = require('../middleware/authMiddleware');
const isPremium = require('../middleware/isPremium');
const checkPremium = require('../middleware/isPremium');

const router = express.Router();

router.get('/login', sendLoginHTML)
router.post('/login', userLogin)


router.get('/signup', sendSignupHTML)
router.post('/signup', userSignup)

router.get('/me',verifyToken, myProfile)
// router.get('/all-users', verifyToken, isPremium, getAllUsers)

// routes to check if user is premium or not and give access to something that only can have by premium user

router.get('/check-premium', verifyToken, checkPremium, premiumOrNot)

module.exports = router