const express = require('express');
const router  = express.Router();
const { getDashboard, getAllOrders, updateOrderStatus, getCustomOrders, updateCustomOrder, getCustomers, getUploadUrl, updateCustomerRole } = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect, adminOnly);
router.get('/dashboard',         getDashboard);
router.get('/orders',            getAllOrders);
router.put('/orders/:id',        updateOrderStatus);
router.get('/custom-orders',     getCustomOrders);
router.put('/custom-orders/:id', updateCustomOrder);
router.get('/customers',         getCustomers);
router.put('/customers/:id/role', updateCustomerRole);
router.post('/upload-image',     getUploadUrl);

module.exports = router;
