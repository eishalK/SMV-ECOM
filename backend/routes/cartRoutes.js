const express = require('express');
const router = express.Router();
const { verifyToken, customerOnly } = require('../middleware/authMiddleware');
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require('../controllers/cartController');

router.post('/', verifyToken, customerOnly, addToCart);
router.get('/', verifyToken, customerOnly, getCart);
router.put('/:productId', verifyToken, customerOnly, updateCartItem);
router.delete('/clear', verifyToken, customerOnly, clearCart);
router.delete('/:productId', verifyToken, customerOnly, removeCartItem);


module.exports = router;
