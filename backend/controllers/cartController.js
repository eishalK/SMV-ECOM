const mongoose = require('mongoose');
const Cart = require('../models/cart');
const Product = require('../models/product');

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        // validate productId is a valid ObjectId
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid productId' });
        }

        // ensure product exists
        const productExists = await Product.findById(productId).select('_id');
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found' });
        }
        let cart = await Cart.findOne({ customerId: req.user._id });

        if (!cart) {
            cart = new Cart({ customerId: req.user._id, products: [{ productId, quantity }] });
        } else {
            const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.products[itemIndex].quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }
        }

        await cart.save();
        // Populate product details for frontend
        const populatedCart = await cart.populate('products.productId', 'title price images');
        res.status(200).json(populatedCart);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while adding to cart' });
    }
};

// Get customer cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ customerId: req.user._id }).populate('products.productId', 'title price images');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Update quantity
exports.updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid productId' });
        }
        const { quantity } = req.body;
        const cart = await Cart.findOne({ customerId: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.products[itemIndex].quantity = quantity;
            await cart.save();

            // Populate product details for frontend
            const populatedCart = await cart.populate('products.productId', 'title price images');
            res.status(200).json(populatedCart);
        } else {
            res.status(404).json({ message: 'Product not found in cart' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating cart item' });
    }
};

// Remove item
exports.removeCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid productId' });
        }
        const cart = await Cart.findOne({ customerId: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.products = cart.products.filter(p => p.productId.toString() !== productId);
        await cart.save();

        const populatedCart = await cart.populate('products.productId', 'title price images');
        res.status(200).json(populatedCart);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ customerId: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.products = [];
        await cart.save();

        res.status(200).json({ message: 'Cart cleared successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while clearing cart' });
    }
};


