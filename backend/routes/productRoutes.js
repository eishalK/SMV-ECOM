const express = require('express');
const router = express.Router();

const { 
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct } = require('../controllers/productController');

const {verifyToken, sellerOnly} = require('../middleware/authMiddleware'); 
const upload = require('../middleware/uploadMiddleware'); 

// Users can view products
router.get('/', getProducts);
router.get('/:id', getProductById);

// sellers only routes
router.post('/', verifyToken, sellerOnly, upload.single('image'), createProduct);
router.put('/:id', verifyToken, sellerOnly, upload.single('image'), updateProduct);
router.delete('/:id', verifyToken, sellerOnly, deleteProduct);

module.exports = router;
