const { supabase, supabaseAdmin } = require('../config/supabase');

// GET /api/products — get all active products (with filters)
const getProducts = async (req, res) => {
  const { category, featured, search, min_price, max_price, sort, page = 1, limit = 12 } = req.query;
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('products')
    .select(`
      *,
      categories(id, name, slug),
      product_images(url, alt_text, is_primary)
    `, { count: 'exact' })
    .eq('is_active', true)
    .range(offset, offset + limit - 1);

  if (category)  query = query.eq('categories.slug', category);
  if (featured)  query = query.eq('is_featured', true);
  if (search)    query = query.ilike('name', `%${search}%`);
  if (min_price) query = query.gte('price_per_yard', min_price);
  if (max_price) query = query.lte('price_per_yard', max_price);

  if (sort === 'price_asc')   query = query.order('price_per_yard', { ascending: true });
  else if (sort === 'price_desc') query = query.order('price_per_yard', { ascending: false });
  else if (sort === 'newest') query = query.order('created_at', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  const { data, error, count } = await query;
  if (error) return res.status(400).json({ success: false, error: error.message });

  res.json({
    success: true,
    products: data,
    pagination: { page: Number(page), limit: Number(limit), total: count, pages: Math.ceil(count / limit) }
  });
};

// GET /api/products/:slug — single product
const getProduct = async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select(`*, categories(id, name, slug), product_images(*)`)
    .eq('slug', req.params.slug)
    .eq('is_active', true)
    .single();

  if (error || !data) return res.status(404).json({ success: false, error: 'Product not found.' });
  res.json({ success: true, product: data });
};

// GET /api/products/featured
const getFeatured = async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select(`*, categories(name, slug), product_images(url, alt_text, is_primary)`)
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(8);

  if (error) return res.status(400).json({ success: false, error: error.message });
  res.json({ success: true, products: data });
};

// GET /api/products/categories
const getCategories = async (req, res) => {
  const { data, error } = await supabaseAdmin.from('categories').select('*').order('name');
  if (error) return res.status(400).json({ success: false, error: error.message });
  res.json({ success: true, categories: data });
};

// ─── ADMIN ONLY ────────────────────────────────────────────

// POST /api/products  (admin)
const createProduct = async (req, res) => {
  const {
    category_id, name, slug, description,
    price_per_yard, width_inches, fabric_type,
    color, stock_yards, min_order_yards,
    is_featured, badge, images
  } = req.body;

  if (!name || !price_per_yard) {
    return res.status(400).json({ success: false, error: 'Name and price are required.' });
  }

  // Create slug from name if not provided
  const productSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const { data: product, error } = await supabaseAdmin
    .from('products')
    .insert({ category_id, name, slug: productSlug, description, price_per_yard, width_inches, fabric_type, color, stock_yards, min_order_yards, is_featured, badge })
    .select()
    .single();

  if (error) return res.status(400).json({ success: false, error: error.message });

  // Add images if provided
  if (images && images.length > 0) {
    const imageRows = images.map((img, i) => ({
      product_id: product.id,
      url: img.url,
      alt_text: img.alt_text || name,
      is_primary: i === 0,
      sort_order: i
    }));
    await supabaseAdmin.from('product_images').insert(imageRows);
  }

  res.status(201).json({ success: true, product });
};

// PUT /api/products/:id  (admin)
const updateProduct = async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('products')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ success: false, error: error.message });
  res.json({ success: true, product: data });
};

// DELETE /api/products/:id  (admin — soft delete)
const deleteProduct = async (req, res) => {
  const { error } = await supabaseAdmin
    .from('products')
    .update({ is_active: false })
    .eq('id', req.params.id);

  if (error) return res.status(400).json({ success: false, error: error.message });
  res.json({ success: true, message: 'Product deactivated.' });
};

// POST /api/products/:id/images  (admin — upload image URL after Supabase Storage upload)
const addProductImage = async (req, res) => {
  const { url, alt_text, is_primary } = req.body;
  const { data, error } = await supabaseAdmin
    .from('product_images')
    .insert({ product_id: req.params.id, url, alt_text, is_primary })
    .select()
    .single();

  if (error) return res.status(400).json({ success: false, error: error.message });
  res.status(201).json({ success: true, image: data });
};

module.exports = { getProducts, getProduct, getFeatured, getCategories, createProduct, updateProduct, deleteProduct, addProductImage };
