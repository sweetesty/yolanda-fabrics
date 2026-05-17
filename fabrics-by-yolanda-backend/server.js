require('dotenv').config();
require('express-async-errors');

const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const rateLimit = require('express-rate-limit');

// Routes
const authRoutes        = require('./routes/auth.routes');
const productRoutes     = require('./routes/product.routes');
const cartRoutes        = require('./routes/cart.routes');
const orderRoutes       = require('./routes/order.routes');
const paymentRoutes     = require('./routes/payment.routes');
const customOrderRoutes = require('./routes/customOrder.routes');
const adminRoutes       = require('./routes/admin.routes');
const newsletterRoutes  = require('./routes/newsletter.routes');

const app = express();

// ─── SECURITY MIDDLEWARE ───────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiter — 100 requests per 15 min per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
}));

// Paystack webhook needs raw body — MUST come before express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── ROUTES ───────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/products',      productRoutes);
app.use('/api/cart',          cartRoutes);
app.use('/api/orders',        orderRoutes);
app.use('/api/payments',      paymentRoutes);
app.use('/api/custom-orders', customOrderRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/newsletter',    newsletterRoutes);

// ─── HEALTH CHECK ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Fabrics by Yolanda API is running' });
});

// ─── GLOBAL ERROR HANDLER ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// ─── START ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📦 Fabrics by Yolanda API — ${process.env.NODE_ENV}`);
});
