const Product = require('../models/product');

// get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('sellerId', 'name email').populate('category', 'name');
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get product by Id
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// create product
exports.createProduct = async (req, res) => {
try {
        const productData = { ...req.body };

        // Handle the image file from Multer
        if (req.file) {
            // We save the path as a string in the array
            productData.images = [`/uploads/${req.file.filename}`];
        }

        const product = await Product.create({
            ...productData,
            sellerId: req.user.id
        });
        
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
       
// update product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Seller can only update their own product
        if (
            req.user.role === 'seller' &&
            product.sellerId.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updateData = { ...req.body };

        // If a new image is uploaded, replace the old one
        if (req.file) {
            updateData.images = [`/uploads/${req.file.filename}`];
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// delete product
exports.deleteProduct = async (req, res) => {
try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (req.user.role === 'seller' && product.sellerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

