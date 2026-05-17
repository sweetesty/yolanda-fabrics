// ═══════════════════════════════════
//  routes/auth.routes.js
// ═══════════════════════════════════
const express = require('express');
const router  = express.Router();
const { register, login, logout, getMe, updateProfile, forgotPassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register',         register);
router.post('/login',            login);
router.post('/logout',           protect, logout);
router.get('/me',                protect, getMe);
router.put('/profile',           protect, updateProfile);
router.post('/forgot-password',  forgotPassword);

module.exports = router;


// ═══════════════════════════════════
//  Save the rest of these as separate files:
// ═══════════════════════════════════

/* routes/product.routes.js ─────────────────────────────────
const express = require('express');
const router  = express.Router();
const { getProducts, getProduct, getFeatured, getCategories, createProduct, updateProduct, deleteProduct, addProductImage } = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/',                getProducts);
router.get('/featured',        getFeatured);
router.get('/categories',      getCategories);
router.get('/:slug',           getProduct);
router.post('/',               protect, adminOnly, createProduct);
router.put('/:id',             protect, adminOnly, updateProduct);
router.delete('/:id',          protect, adminOnly, deleteProduct);
router.post('/:id/images',     protect, adminOnly, addProductImage);

module.exports = router;
*/

/* routes/cart.routes.js ────────────────────────────────────
const express = require('express');
const router  = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // All cart routes require login
router.get('/',         getCart);
router.post('/',        addToCart);
router.put('/:id',      updateCartItem);
router.delete('/',      clearCart);
router.delete('/:id',   removeFromCart);

module.exports = router;
*/

/* routes/order.routes.js ───────────────────────────────────
const express = require('express');
const router  = express.Router();
const { placeOrder, getMyOrders, getOrder } = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.post('/',      placeOrder);
router.get('/',       getMyOrders);
router.get('/:id',    getOrder);

module.exports = router;
*/

/* routes/payment.routes.js ─────────────────────────────────
const express = require('express');
const router  = express.Router();
const { initializePayment, verifyPayment, handleWebhook } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/webhook',           handleWebhook);          // public — Paystack calls this
router.post('/initialize',        protect, initializePayment);
router.get('/verify/:reference',  protect, verifyPayment);

module.exports = router;
*/

/* routes/customOrder.routes.js ─────────────────────────────
const express = require('express');
const router  = express.Router();
const { supabaseAdmin } = require('../config/supabase');

router.post('/', async (req, res) => {
  const { name, email, phone, fabric_desc, quantity, budget, deadline } = req.body;
  if (!name || !email || !fabric_desc) {
    return res.status(400).json({ success: false, error: 'Name, email and description are required.' });
  }
  const { data, error } = await supabaseAdmin
    .from('custom_orders')
    .insert({ name, email, phone, fabric_desc, quantity, budget, deadline })
    .select().single();
  if (error) return res.status(400).json({ success: false, error: error.message });
  res.status(201).json({ success: true, message: 'Custom order submitted! We will contact you within 24 hours.', order: data });
});

module.exports = router;
*/

/* routes/newsletter.routes.js ──────────────────────────────
const express = require('express');
const router  = express.Router();
const { supabaseAdmin } = require('../config/supabase');

router.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: 'Email required.' });
  const { error } = await supabaseAdmin
    .from('newsletter_subscribers')
    .upsert({ email, is_active: true }, { onConflict: 'email' });
  if (error) return res.status(400).json({ success: false, error: error.message });
  res.json({ success: true, message: 'Subscribed successfully!' });
});

module.exports = router;
*/

/* routes/admin.routes.js ───────────────────────────────────
const express = require('express');
const router  = express.Router();
const { getDashboard, getAllOrders, updateOrderStatus, getCustomOrders, updateCustomOrder, getCustomers, getUploadUrl } = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect, adminOnly); // All admin routes require login + admin role
router.get('/dashboard',             getDashboard);
router.get('/orders',                getAllOrders);
router.put('/orders/:id',            updateOrderStatus);
router.get('/custom-orders',         getCustomOrders);
router.put('/custom-orders/:id',     updateCustomOrder);
router.get('/customers',             getCustomers);
router.post('/upload-image',         getUploadUrl);

module.exports = router;
*/
