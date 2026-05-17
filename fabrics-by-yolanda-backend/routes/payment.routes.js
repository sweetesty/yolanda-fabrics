const express = require('express');
const router  = express.Router();
const { initializePayment, verifyPayment, handleWebhook } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/webhook',          handleWebhook);
router.post('/initialize',       protect, initializePayment);
router.get('/verify/:reference', protect, verifyPayment);

module.exports = router;
