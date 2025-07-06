const express = require('express')
const { getPaymentPage, processPayment, getPaymentStatus } = require('../controller/paymentController')

const verifyToken = require('../middleware/authMiddleware')


const router = express.Router()


router.get('/', verifyToken, getPaymentPage)

router.post('/pay', verifyToken, processPayment)

router.get('/payment-status/:orderId', verifyToken, getPaymentStatus);


module.exports = router;