const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const brandColor = '#C9A84C';
const brandBlack = '#0d0d0d';

// Shared email header
const header = `
  <div style="background:${brandBlack};padding:24px 32px;text-align:center">
    <h1 style="color:${brandColor};font-family:Georgia,serif;font-size:22px;margin:0;letter-spacing:2px">FABRICS BY YOLANDA</h1>
    <p style="color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:3px;margin:6px 0 0;font-family:Arial">EXQUISITE FABRICS. TIMELESS STYLE.</p>
  </div>
`;

const footer = `
  <div style="background:#f5f5f0;padding:24px 32px;text-align:center;border-top:2px solid ${brandColor}">
    <p style="color:#888;font-size:12px;margin:0">© 2025 Fabrics by Yolanda. All rights reserved.</p>
    <p style="color:#aaa;font-size:11px;margin:8px 0 0">Need help? WhatsApp us or email support@fabricsbyyolanda.com</p>
  </div>
`;

// ─── WELCOME EMAIL ─────────────────────────────────────────
const sendWelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to Fabrics by Yolanda 🌟',
      html: `
        ${header}
        <div style="padding:40px 32px;background:#ffffff;font-family:Arial,sans-serif">
          <h2 style="color:${brandBlack};font-family:Georgia,serif">Welcome, ${name}!</h2>
          <p style="color:#555;line-height:1.8">You've joined an exclusive circle of fabric lovers who know that the right fabric makes all the difference.</p>
          <p style="color:#555;line-height:1.8">Start exploring our curated collection of premium silks, brocades, velvets and more.</p>
          <div style="text-align:center;margin:32px 0">
            <a href="${process.env.FRONTEND_URL}/collections" style="background:${brandColor};color:#fff;text-decoration:none;padding:14px 36px;font-size:13px;letter-spacing:2px;display:inline-block">SHOP NOW</a>
          </div>
        </div>
        ${footer}
      `
    });
  } catch (err) {
    console.error('Welcome email failed:', err.message);
  }
};

// ─── ORDER CONFIRMATION ────────────────────────────────────
const sendOrderConfirmation = async (email, order, items) => {
  try {
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding:12px;border-bottom:1px solid #eee;color:#333">${item.product_name}</td>
        <td style="padding:12px;border-bottom:1px solid #eee;color:#333;text-align:center">${item.yards_ordered} yds</td>
        <td style="padding:12px;border-bottom:1px solid #eee;color:#333;text-align:right">₦${item.line_total.toLocaleString()}</td>
      </tr>
    `).join('');

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Order Confirmed — ${order.order_number} 🛍️`,
      html: `
        ${header}
        <div style="padding:40px 32px;background:#ffffff;font-family:Arial,sans-serif">
          <h2 style="color:${brandBlack};font-family:Georgia,serif">Order Received!</h2>
          <p style="color:#555">Hi ${order.customer_name}, your order <strong>${order.order_number}</strong> has been received. Please complete payment to confirm.</p>
          <table style="width:100%;border-collapse:collapse;margin:24px 0">
            <thead><tr style="background:#f5f5f0">
              <th style="padding:12px;text-align:left;font-size:12px;letter-spacing:1px;color:#888">PRODUCT</th>
              <th style="padding:12px;text-align:center;font-size:12px;letter-spacing:1px;color:#888">YARDS</th>
              <th style="padding:12px;text-align:right;font-size:12px;letter-spacing:1px;color:#888">TOTAL</th>
            </tr></thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot>
              <tr><td colspan="2" style="padding:12px;text-align:right;color:#888">Shipping:</td><td style="padding:12px;text-align:right;color:#333">₦${order.shipping_fee.toLocaleString()}</td></tr>
              <tr style="background:#f5f5f0"><td colspan="2" style="padding:12px;text-align:right;font-weight:bold;color:${brandBlack}">TOTAL:</td><td style="padding:12px;text-align:right;font-weight:bold;color:${brandColor};font-size:18px">₦${order.total.toLocaleString()}</td></tr>
            </tfoot>
          </table>
          <div style="text-align:center;margin:32px 0">
            <a href="${process.env.FRONTEND_URL}/orders/${order.id}" style="background:${brandColor};color:#fff;text-decoration:none;padding:14px 36px;font-size:13px;letter-spacing:2px;display:inline-block">COMPLETE PAYMENT</a>
          </div>
        </div>
        ${footer}
      `
    });
  } catch (err) {
    console.error('Order confirmation email failed:', err.message);
  }
};

// ─── PAYMENT CONFIRMED ─────────────────────────────────────
const sendPaymentConfirmation = async (email, order) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Payment Confirmed — ${order.order_number} ✅`,
      html: `
        ${header}
        <div style="padding:40px 32px;background:#ffffff;font-family:Arial,sans-serif">
          <div style="text-align:center;margin-bottom:24px">
            <div style="width:64px;height:64px;border-radius:50%;background:#f0faf0;display:inline-flex;align-items:center;justify-content:center;font-size:28px">✅</div>
          </div>
          <h2 style="color:${brandBlack};font-family:Georgia,serif;text-align:center">Payment Confirmed!</h2>
          <p style="color:#555;text-align:center">Order <strong>${order.order_number}</strong> is now being processed. We'll notify you when it ships.</p>
          <div style="background:#f5f5f0;border-left:3px solid ${brandColor};padding:16px 20px;margin:24px 0">
            <p style="margin:0;color:#555;font-size:13px">📦 Delivery to: <strong>${order.shipping_address}, ${order.shipping_city}, ${order.shipping_state}</strong></p>
            <p style="margin:8px 0 0;color:#555;font-size:13px">💰 Amount paid: <strong style="color:${brandColor}">₦${order.total.toLocaleString()}</strong></p>
          </div>
          <div style="text-align:center;margin:32px 0">
            <a href="${process.env.FRONTEND_URL}/orders/${order.id}" style="background:${brandColor};color:#fff;text-decoration:none;padding:14px 36px;font-size:13px;letter-spacing:2px;display:inline-block">TRACK ORDER</a>
          </div>
        </div>
        ${footer}
      `
    });
  } catch (err) {
    console.error('Payment confirmation email failed:', err.message);
  }
};

// ─── ORDER SHIPPED ─────────────────────────────────────────
const sendShippingNotification = async (email, order, tracking) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Your Order is on its way! 🚚 — ${order.order_number}`,
      html: `
        ${header}
        <div style="padding:40px 32px;background:#ffffff;font-family:Arial,sans-serif">
          <h2 style="color:${brandBlack};font-family:Georgia,serif;text-align:center">Your Order Shipped! 🚚</h2>
          <p style="color:#555;text-align:center">Order <strong>${order.order_number}</strong> is on its way to you!</p>
          ${tracking ? `<div style="background:#f5f5f0;border-left:3px solid ${brandColor};padding:16px 20px;margin:24px 0"><p style="margin:0;color:#555;font-size:13px">📦 Tracking: <strong>${tracking}</strong></p></div>` : ''}
          <p style="color:#888;text-align:center;font-size:13px">Delivery to ${order.shipping_city}, ${order.shipping_state} usually takes 2–5 business days.</p>
        </div>
        ${footer}
      `
    });
  } catch (err) {
    console.error('Shipping email failed:', err.message);
  }
};

module.exports = { sendWelcomeEmail, sendOrderConfirmation, sendPaymentConfirmation, sendShippingNotification };
