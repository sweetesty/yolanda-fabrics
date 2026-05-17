const express = require('express');
const router  = express.Router();
const { getProducts, getProduct, getFeatured, getCategories, createProduct, updateProduct, deleteProduct, addProductImage } = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/',             getProducts);
router.get('/featured',     getFeatured);
router.get('/categories',   getCategories);
router.get('/:slug',        getProduct);
router.post('/',            protect, adminOnly, createProduct);
router.put('/:id',          protect, adminOnly, updateProduct);
router.delete('/:id',       protect, adminOnly, deleteProduct);
router.post('/:id/images',  protect, adminOnly, addProductImage);

module.exports = router;
