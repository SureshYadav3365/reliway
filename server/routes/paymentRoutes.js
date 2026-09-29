const express = require('express');
const router = express.Router();
const { processPayment, getAllPayments } = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/auth');

router.use(protect);

router.post('/process', processPayment);
router.get('/', admin, getAllPayments);

module.exports = router;
