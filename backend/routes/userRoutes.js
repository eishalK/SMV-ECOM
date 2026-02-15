const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUserRole, deleteUser } = require('../controllers/userController');
const {verifyToken, adminOnly} = require('../middleware/authMiddleware');

// Get all users
router.get('/', verifyToken, adminOnly, getUsers);

//Get a single user by ID
router.get('/:id', verifyToken, adminOnly, getUserById);

// Update user role
router.put('/:id', verifyToken, adminOnly, updateUserRole);

// Delete a user
router.delete('/:id', verifyToken, adminOnly, deleteUser);

module.exports = router;