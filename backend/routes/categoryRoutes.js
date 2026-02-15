const express = require('express');
const router = express.Router();
const {getCategories, createCategory, updateCategory, deleteCategory} = require('../controllers/categoryController');
const {verifyToken, adminOnly} = require('../middleware/authMiddleware');

// Get all categories
router.get('/', getCategories);

// Admin only routes
router.post('/', verifyToken, adminOnly, createCategory);
router.put('/:id', verifyToken, adminOnly, updateCategory);
router.delete('/:id', verifyToken, adminOnly, deleteCategory);

module.exports = router;