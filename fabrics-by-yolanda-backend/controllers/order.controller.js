const { supabaseAdmin } = require('../config/supabase');
const emailService = require('../services/email.service');

const SHIPPING_FEE = 3000; // ₦3,000 flat rate (make dynamic later)
const FREE_SHIPPING_THRESHOLD = 50000; // free above ₦50,000

// POST /api/orders  — place order from cart
const placeOrder = async (req, res) => {
  const { shipping_address, shipping_city, shipping_state, phone, notes } = req.body;

  if (!shipping_address || !shipping_city || !shipping_state) {
    return res.status(400).json({ success: false, error: 'Shipping address is required.' });
  }

  // 1. Get cart items
  const { data: cartItems, error: cartError } = await supabaseAdmin
    .from('cart_items')
    .select(`*, products(id, name, price_per_yard, stock_yards)`)
    .eq('user_id', req.user.id);

  if (cartError || !cartItems.length) {
    return res.status(400).json({ success: false, error: 'Your cart is empty.' });
  }

  // 2. Validate stock for each item
  for (const item of cartItems) {
    if (item.yards > item.products.stock_yards) {
      return res.status(400).json({
        success: false,
        error: `Sorry, only ${item.products.stock_yards} yards of "${item.products.name}" are available.`
      });
    }
  }

  // 3. Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.yards * item.products.price_per_yard), 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  // 4. Get user profile
  const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', req.user.id).single();

  // 5. Create order
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      user_id: req.user.id,
      order_number: 'PENDING',   // trigger will replace this
      customer_name: profile?.full_name || req.user.email,
      customer_email: req.user.email,
      customer_phone: phone || profile?.phone,
      shipping_address,
      shipping_city,
      shipping_state,
      subtotal,
      shipping_fee: shipping,
      total,
      notes,
    })
    .select()
    .single();

  if (orderError) return res.status(400).json({ success: false, error: orderError.message });

  // 6. Create order items
  const orderItems = cartItems.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.products.name,
    price_per_yard: item.products.price_per_yard,
    yards_ordered: item.yards,
    line_total: item.yards * item.products.price_per_yard
  }));

  await supabaseAdmin.from('order_items').insert(orderItems);

  // 7. Deduct stock
  for (const item of cartItems) {
    await supabaseAdmin
      .from('products')
      .update({ stock_yards: item.products.stock_yards - item.yards })
      .eq('id', item.product_id);
  }

  // 8. Clear cart
  await supabaseAdmin.from('cart_items').delete().eq('user_id', req.user.id);

  // 9. Send confirmation email
  await emailService.sendOrderConfirmation(req.user.email, order, orderItems);

  res.status(201).json({
    success: true,
    message: 'Order placed! Proceed to payment.',
    order: { ...order, items: orderItems }
  });
};

// GET /api/orders  — user's orders
const getMyOrders = async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(`*, order_items(*)`)
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ success: false, error: error.message });
  res.json({ success: true, orders: data });
};

// GET /api/orders/:id  — single order
const getOrder = async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(`*, order_items(*)`)
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (error || !data) return res.status(404).json({ success: false, error: 'Order not found.' });
  res.json({ success: true, order: data });
};

module.exports = { placeOrder, getMyOrders, getOrder };
