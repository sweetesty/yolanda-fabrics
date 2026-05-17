const { supabaseAdmin } = require('../config/supabase');
const emailService = require('../services/email.service');

// GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  const [
    { count: totalOrders },
    { count: totalProducts },
    { count: totalCustomers },
    { data: recentOrders },
    { data: revenue },
  ] = await Promise.all([
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabaseAdmin.from('orders').select('id,order_number,customer_name,total,status,created_at').order('created_at', { ascending: false }).limit(10),
    supabaseAdmin.from('orders').select('total').eq('payment_status', 'paid'),
  ]);

  const totalRevenue = revenue?.reduce((sum, o) => sum + o.total, 0) || 0;

  res.json({
    success: true,
    stats: { totalOrders, totalProducts, totalCustomers, totalRevenue },
    recentOrders,
  });
};

// GET /api/admin/orders
const getAllOrders = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('orders')
    .select('*, order_items(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq('status', status);

  const { data, error, count } = await query;
  if (error) return res.status(400).json({ success: false, error: error.message });
  res.json({ success: true, orders: data, total: count });
};

// PUT /api/admin/orders/:id  — update order status
const updateOrderStatus = async (req, res) => {
  const { status, tracking_number } = req.body;
  const validStatuses = ['pending','paid','processing','shipped','delivered','cancelled','refunded'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status.' });
  }

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .update({ status })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ success: false, error: error.message });

  // Send shipping email if marked as shipped
  if (status === 'shipped') {
    await emailService.sendShippingNotification(order.customer_email, order, tracking_number);
  }

  res.json({ success: true, order });
};

// GET /api/admin/custom-orders
const getCustomOrders = async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('custom_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ success: false, error: error.message });
  res.json({ success: true, customOrders: data });
};

// PUT /api/admin/custom-orders/:id
const updateCustomOrder = async (req, res) => {
  const { status, admin_notes } = req.body;
  const { data, error } = await supabaseAdmin
    .from('custom_orders')
    .update({ status, admin_notes })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ success: false, error: error.message });
  res.json({ success: true, customOrder: data });
};

// GET /api/admin/customers
const getCustomers = async (req, res) => {
  try {
    // 1. Fetch secure auth users to retrieve registered emails
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) {
      return res.status(400).json({ success: false, error: authError.message });
    }
    const authUsers = authData?.users || [];

    // 2. Fetch public profile metadata (names, phone, roles)
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profileError) {
      return res.status(400).json({ success: false, error: profileError.message });
    }

    // 3. Fetch orders to match with email in-memory
    const { data: orders, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('customer_email');

    // 4. Filter profiles by role and stitch auth emails in-memory
    const customers = profiles
      .filter(p => p.role === 'customer')
      .map(profile => {
        const authUser = authUsers.find(u => u.id === profile.id);
        const email = authUser ? authUser.email : 'No email';
        const customerOrders = orders ? orders.filter(o => o.customer_email?.toLowerCase() === email.toLowerCase()) : [];
        
        return {
          ...profile,
          email,
          orders: {
            count: customerOrders.length
          }
        };
      });

    res.json({ success: true, customers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/admin/upload-image  — get Supabase Storage signed upload URL
const getUploadUrl = async (req, res) => {
  const { filename, folder = 'products' } = req.body;
  const ext = filename.split('.').pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabaseAdmin.storage
    .from('product-images')
    .createSignedUploadUrl(path);

  if (error) return res.status(400).json({ success: false, error: error.message });

  const publicUrl = supabaseAdmin.storage.from('product-images').getPublicUrl(path).data.publicUrl;

  res.json({ success: true, uploadUrl: data.signedUrl, token: data.token, publicUrl, path });
};

// PUT /api/admin/customers/:id/role  — elevate or demote patron roles
const updateCustomerRole = async (req, res) => {
  const { role } = req.body;
  if (!['customer', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, error: 'Invalid role.' });
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ role })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ success: false, error: error.message });
  res.json({ success: true, profile: data });
};

module.exports = { getDashboard, getAllOrders, updateOrderStatus, getCustomOrders, updateCustomOrder, getCustomers, getUploadUrl, updateCustomerRole };
