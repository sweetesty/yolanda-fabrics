const { supabaseAdmin } = require('../config/supabase');

// Verify the user is logged in (checks Supabase JWT)
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Not authorized. No token.' });
    }
    const token = authHeader.split(' ')[1];

    // Verify with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Authentication failed.' });
  }
};

// Verify the user is an admin
const adminOnly = async (req, res, next) => {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || profile?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required.' });
    }
    next();
  } catch (err) {
    res.status(403).json({ success: false, error: 'Access denied.' });
  }
};

module.exports = { protect, adminOnly };
