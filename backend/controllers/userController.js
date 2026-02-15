const User = require('../models/user');

// get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get user by Id
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update role
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const allowedRoles = ['admin', 'seller', 'customer'];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted' });
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
