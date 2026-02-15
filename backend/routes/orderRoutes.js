const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, updateOrderStatus} = require('../controllers/orderController');
const {verifyToken, customerOnly, adminOnly, sellerOnly} = require('../middleware/authMiddleware');

// Helper to allow multiple roles (Admin OR Seller)
const staffOnly = (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'seller') {
        next();
    } else {
        res.status(403).json({ message: "Access denied: Staff only" });
    }
};

router.post('/', verifyToken, customerOnly, createOrder);
router.get('/customer', verifyToken, customerOnly, getOrders);
router.get('/seller', verifyToken, staffOnly, getOrders);
router.get('/:id', verifyToken, staffOnly, getOrderById);
router.put('/:id', verifyToken, adminOnly, updateOrderStatus);

module.exports = router;