const express = require('express');
const router  = express.Router();
const { placeOrder, getMyOrders, getOrder } = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.post('/',   placeOrder);
router.get('/',    getMyOrders);
router.get('/:id', getOrder);

module.exports = router;
