const Category = require('../models/category');

// get categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new category
exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// update category
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });

        }
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// delete category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

