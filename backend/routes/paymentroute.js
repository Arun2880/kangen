const express = require('express');
const paymentcontrol = require('../controllers/payment_controller');
const router = express.Router();

router.post('/orders', paymentcontrol.orders);
router.post('/verify', paymentcontrol.verify);

module.exports = router;
