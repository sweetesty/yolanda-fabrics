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
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*, orders(count)')
    .eq('role', 'customer')
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ success: false, error: error.message });
  res.json({ success: true, customers: data });
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

module.exports = { getDashboard, getAllOrders, updateOrderStatus, getCustomOrders, updateCustomOrder, getCustomers, getUploadUrl };
