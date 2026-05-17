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
  res.json({ success: true, message: 'Subscribed! Welcome to the Yolanda Circle.' });
});

module.exports = router;
