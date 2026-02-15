require('dotenv').config();
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');
const path = require('path'); 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Connect to database
connectDB();



// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);       
});