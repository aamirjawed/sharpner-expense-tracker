const express = require('express');
const { sendLoginHTML, sendSignupHTML, userSignup, userLogin, myProfile, getAllUsers } = require('../controller/userController');
const verifyToken = require('../middleware/authMiddleware');
const isPremium = require('../middleware/isPremium');

const router = express.Router();

router.get('/login', sendLoginHTML)
router.post('/login', userLogin)


router.get('/signup', sendSignupHTML)
router.post('/signup', userSignup)

router.get('/me',verifyToken, myProfile)
router.get('/all-users', verifyToken, isPremium, getAllUsers)



module.exports = router