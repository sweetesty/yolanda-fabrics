const express = require('express');
const router  = express.Router();
const { supabaseAdmin } = require('../config/supabase');

router.post('/', async (req, res) => {
  const { name, email, phone, fabric_desc, quantity, budget, deadline } = req.body;
  if (!name || !email || !fabric_desc) {
    return res.status(400).json({ success: false, error: 'Name, email and description required.' });
  }
  const { data, error } = await supabaseAdmin
    .from('custom_orders')
    .insert({ name, email, phone, fabric_desc, quantity, budget, deadline })
    .select().single();
  if (error) return res.status(400).json({ success: false, error: error.message });
  res.status(201).json({ success: true, message: 'Custom order submitted! We will contact you within 24 hours.', order: data });
});

module.exports = router;
