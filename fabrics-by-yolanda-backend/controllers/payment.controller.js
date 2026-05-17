const axios  = require('axios');
const crypto = require('crypto');
const { supabaseAdmin } = require('../config/supabase');
const emailService = require('../services/email.service');

const PAYSTACK_BASE = 'https://api.paystack.co';
const PAYSTACK_KEY  = process.env.PAYSTACK_SECRET_KEY;

// POST /api/payments/initialize  — start payment
// Call this AFTER placing an order to get the payment link
const initializePayment = async (req, res) => {
  const { order_id } = req.body;
  if (!order_id) return res.status(400).json({ success: false, error: 'order_id required.' });

  // Get order
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', order_id)
    .eq('user_id', req.user.id)
    .single();

  if (error || !order) return res.status(404).json({ success: false, error: 'Order not found.' });
  if (order.payment_status === 'paid') {
    return res.status(400).json({ success: false, error: 'Order already paid.' });
  }

  // Initialize with Paystack (amount must be in kobo = Naira × 100)
  const response = await axios.post(
    `${PAYSTACK_BASE}/transaction/initialize`,
    {
      email: order.customer_email,
      amount: Math.round(order.total * 100),   // convert to kobo
      reference: `FBY-${order.id}-${Date.now()}`,
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
        customer_name: order.customer_name,
      },
      callback_url: `${process.env.FRONTEND_URL}/payment/verify`,
    },
    { headers: { Authorization: `Bearer ${PAYSTACK_KEY}` } }
  );

  const { authorization_url, reference, access_code } = response.data.data;

  // Save reference to order
  await supabaseAdmin
    .from('orders')
    .update({ payment_ref: reference })
    .eq('id', order.id);

  res.json({
    success: true,
    payment_url: authorization_url,   // redirect user here to pay
    reference,
    access_code,
  });
};

// GET /api/payments/verify/:reference  — verify after redirect back
const verifyPayment = async (req, res) => {
  const { reference } = req.params;

  const response = await axios.get(
    `${PAYSTACK_BASE}/transaction/verify/${reference}`,
    { headers: { Authorization: `Bearer ${PAYSTACK_KEY}` } }
  );

  const { status, metadata } = response.data.data;

  if (status !== 'success') {
    return res.status(400).json({ success: false, error: 'Payment not successful.' });
  }

  // Update order
  const { data: order } = await supabaseAdmin
    .from('orders')
    .update({ payment_status: 'paid', status: 'processing', paid_at: new Date().toISOString() })
    .eq('id', metadata.order_id)
    .select(`*, order_items(*)`)
    .single();

  // Send payment confirmed email
  await emailService.sendPaymentConfirmation(order.customer_email, order);

  res.json({ success: true, message: 'Payment verified!', order });
};

// POST /api/payments/webhook  — Paystack calls this automatically
// (handles events even if user closes browser)
const handleWebhook = async (req, res) => {
  // Verify it's really from Paystack
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET)
    .update(req.body)
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(400).json({ error: 'Invalid signature.' });
  }

  const event = JSON.parse(req.body);

  if (event.event === 'charge.success') {
    const { metadata, reference } = event.data;
    if (metadata?.order_id) {
      const { data: order } = await supabaseAdmin
        .from('orders')
        .update({ payment_status: 'paid', status: 'processing', paid_at: new Date().toISOString(), payment_ref: reference })
        .eq('id', metadata.order_id)
        .eq('payment_status', 'unpaid')   // only update if not already paid
        .select()
        .single();

      if (order) {
        await emailService.sendPaymentConfirmation(order.customer_email, order);
      }
    }
  }

  res.sendStatus(200);  // Always respond 200 to Paystack
};

module.exports = { initializePayment, verifyPayment, handleWebhook };
