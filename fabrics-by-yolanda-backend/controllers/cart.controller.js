const { supabaseAdmin } = require('../config/supabase');

// GET /api/cart  — get user's cart
const getCart = async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('cart_items')
    .select(`*, products(id, name, slug, price_per_yard, stock_yards, product_images(url, is_primary))`)
    .eq('user_id', req.user.id);

  if (error) return res.status(400).json({ success: false, error: error.message });

  // Calculate total
  const total = data.reduce((sum, item) => sum + (item.yards * item.products.price_per_yard), 0);
  res.json({ success: true, items: data, total });
};

// POST /api/cart  — add item
const addToCart = async (req, res) => {
  const { product_id, yards = 1 } = req.body;
  if (!product_id) return res.status(400).json({ success: false, error: 'product_id required.' });

  // Check product exists and has stock
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('id, name, stock_yards, min_order_yards')
    .eq('id', product_id)
    .eq('is_active', true)
    .single();

  if (!product) return res.status(404).json({ success: false, error: 'Product not found.' });
  if (yards < product.min_order_yards) {
    return res.status(400).json({ success: false, error: `Minimum order is ${product.min_order_yards} yards.` });
  }
  if (yards > product.stock_yards) {
    return res.status(400).json({ success: false, error: `Only ${product.stock_yards} yards available.` });
  }

  // Upsert (add or update quantity)
  const { data, error } = await supabaseAdmin
    .from('cart_items')
    .upsert({ user_id: req.user.id, product_id, yards }, { onConflict: 'user_id,product_id' })
    .select()
    .single();

  if (error) return res.status(400).json({ success: false, error: error.message });
  res.status(201).json({ success: true, item: data });
};

// PUT /api/cart/:id  — update yards using product_id
const updateCartItem = async (req, res) => {
  const { yards } = req.body;
  if (!yards || yards < 0.5) return res.status(400).json({ success: false, error: 'Minimum 0.5 yards.' });

  const { data, error } = await supabaseAdmin
    .from('cart_items')
    .update({ yards })
    .eq('product_id', req.params.id) // Query directly by product_id
    .eq('user_id', req.user.id)   // ensures user owns this item
    .select()
    .single();

  if (error) return res.status(400).json({ success: false, error: error.message });
  res.json({ success: true, item: data });
};

// DELETE /api/cart/:id  — remove item using product_id
const removeFromCart = async (req, res) => {
  const { error } = await supabaseAdmin
    .from('cart_items')
    .delete()
    .eq('product_id', req.params.id) // Query directly by product_id
    .eq('user_id', req.user.id);

  if (error) return res.status(400).json({ success: false, error: error.message });
  res.json({ success: true, message: 'Item removed from cart.' });
};

// DELETE /api/cart  — clear entire cart
const clearCart = async (req, res) => {
  const { error } = await supabaseAdmin
    .from('cart_items')
    .delete()
    .eq('user_id', req.user.id);

  if (error) return res.status(400).json({ success: false, error: error.message });
  res.json({ success: true, message: 'Cart cleared.' });
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
