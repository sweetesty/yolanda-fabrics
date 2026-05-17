const { supabase, supabaseAdmin } = require('../config/supabase');
const emailService = require('../services/email.service');

// POST /api/auth/register
const register = async (req, res) => {
  const { email, password, full_name, phone } = req.body;

  if (!email || !password || !full_name) {
    console.error('❌ Registration failed: Missing fields:', { email, hasPassword: !!password, full_name });
    return res.status(400).json({ success: false, error: 'Name, email and password are required.' });
  }
  if (password.length < 6) {
    console.error('❌ Registration failed: Password too short (less than 6 chars).');
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
  }

  // Create user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name } }   // stored in raw_user_meta_data (triggers profile creation)
  });

  if (error) {
    console.error('❌ Supabase registration error:', error.message);
    return res.status(400).json({ success: false, error: error.message });
  }

  // Update phone if provided
  if (phone && data.user) {
    await supabaseAdmin.from('profiles').update({ phone }).eq('id', data.user.id);
  }

  // Send welcome email (wrapped in try/catch to allow instant test email signups without SMTP errors)
  try {
    await emailService.sendWelcomeEmail(email, full_name);
  } catch (emailError) {
    console.warn('⚠️ Welcome email skipped/failed (SMTP unconfigured):', emailError.message);
  }

  res.status(201).json({
    success: true,
    message: 'Account created! Please check your email to verify.',
    user: { id: data.user.id, email: data.user.email }
  });
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password required.' });
  }

  // ─── ADMIN BYPASS INTERCEPTOR ───
  if (email.toLowerCase() === 'admin@gmail.com' && password === 'admin123.') {
    try {
      // Attempt login
      let { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // Administrative account not created yet, programmatically seed it!
        const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name: 'Atelier Director' }
        });

        if (createError) {
          return res.status(400).json({ success: false, error: 'Failed to initialize administrative account: ' + createError.message });
        }

        // Let profiles insert trigger complete, then elevate to admin
        await new Promise(resolve => setTimeout(resolve, 1000));
        await supabaseAdmin
          .from('profiles')
          .update({ role: 'admin', full_name: 'Atelier Director' })
          .eq('id', created.user.id);

        // Sign in now that it exists
        const resign = await supabase.auth.signInWithPassword({ email, password });
        data = resign.data;
        error = resign.error;
      } else {
        // Ensure role is elevated to admin in profiles
        await supabaseAdmin
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', data.user.id);
      }

      if (error) {
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }

      return res.json({
        success: true,
        token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          full_name: 'Atelier Director',
          role: 'admin',
        }
      });
    } catch (err) {
      console.error('Error during admin bypass pipeline:', err.message);
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ success: false, error: 'Invalid email or password.' });

  // Get profile
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  res.json({
    success: true,
    token: data.session.access_token,   // send this in every protected request
    user: {
      id: data.user.id,
      email: data.user.email,
      full_name: profile?.full_name,
      role: profile?.role,
    }
  });
};

// POST /api/auth/logout
const logout = async (req, res) => {
  await supabase.auth.signOut();
  res.json({ success: true, message: 'Logged out successfully.' });
};

// GET /api/auth/me  (protected)
const getMe = async (req, res) => {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  res.json({ success: true, user: { ...req.user, ...profile } });
};

// PUT /api/auth/profile  (protected)
const updateProfile = async (req, res) => {
  const { full_name, phone, address, city, state } = req.body;

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ full_name, phone, address, city, state })
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) return res.status(400).json({ success: false, error: error.message });
  res.json({ success: true, profile: data });
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
  });
  // Always return success so we don't reveal if email exists
  res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
};

module.exports = { register, login, logout, getMe, updateProfile, forgotPassword };
