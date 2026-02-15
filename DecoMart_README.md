# 🛍️ DecoMart -- Multi-Vendor E-Commerce Platform

DecoMart is a full-stack **Multi-Vendor E-Commerce Web Application**
built using the MERN stack.\
The platform allows multiple vendors to register, upload, and manage
their own products, while customers can browse, add items to cart, and
shop from different vendors within a single marketplace.

------------------------------------------------------------------------

## 🚀 Project Overview

DecoMart provides:

-   🏪 Vendor-based product management\
-   👤 Customer authentication & cart system\
-   🛒 Marketplace shopping experience\
-   🖼️ Product image uploads using Multer\
-   🔐 Secure JWT authentication\
-   ⚡ Modern responsive UI

------------------------------------------------------------------------

# 🧰 Tech Stack

## Frontend

-   React.js\
-   Redux Toolkit\
-   React Router\
-   Tailwind CSS\
-   Axios

## Backend

-   Node.js\
-   Express.js\
-   MongoDB (Mongoose)\
-   JWT Authentication\
-   Multer (Image Upload Handling)

------------------------------------------------------------------------

# ✨ Key Features

## 👤 Customer Features

-   User Registration & Login
-   Secure JWT Authentication
-   Browse Products from Multiple Vendors
-   Add to Cart
-   Update Cart Quantity
-   View New Arrivals
-   Smooth Scrolling Navigation
-   Responsive UI Design

## 🏪 Vendor Features

-   Vendor Registration & Login
-   Add New Products
-   Upload Product Images
-   Edit / Delete Own Products
-   Vendor-specific product management

Each vendor can manage only their own products within the marketplace.

------------------------------------------------------------------------

# 🔐 Authentication & Authorization

-   Passwords are hashed before saving
-   JWT tokens used for authentication
-   Role-based access control (Customer / Vendor)
-   Protected API routes

------------------------------------------------------------------------

# 📂 Project Structure

project-root/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/          # Multer image storage
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
|   |   ├── services/
│   |   └── App.js
│   
└── README.md

------------------------------------------------------------------------

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

git clone https://github.com/eishalK/SMV-ECOM
cd https://github.com/eishalK/SMV-ECOM

## 2️⃣ Backend Setup

cd backend\
npm install

Create a `.env` file inside backend folder:

PORT=5000\
MONGO_URI=your_mongodb_connection_string\
JWT_SECRET=your_secret_key

Start backend server:

npm start

Backend runs on:\
http://localhost:5000

## 3️⃣ Frontend Setup

cd frontend\
npm install\
npm start

Frontend runs on:\
http://localhost:3000

------------------------------------------------------------------------

# 🖼️ Image Upload System (Multer)

-   Images are stored locally inside the `/uploads` folder.
-   Multer middleware handles file storage.
-   Image file paths are stored in MongoDB.

------------------------------------------------------------------------

# Sample API Endpoints

## Authentication

-   POST /api/auth/register
-   POST /api/auth/login

## User 

-   GET /api/users
-   GET /api/users/:id
-   PUT /api/users/:id
-   DELETE /api/users/:id

## Products

-   GET /api/products
-   GET /api/products/:id
-   POST /api/products
-   PUT /api/products/:id
-   DELETE /api/products/:id

## Categories

-   GET /api/categories
-   POST /api/categories
-   PUT /api/categories/:id
-   DELETE /api/categories/:id

## Order

-   POST /api/order
-   GET /api/order/customer
-   GET /api/order/seller
-   GET /api/order/:id
-   PUT /api/order/:id

## Cart

-   POST /api/cart
-   GET /api/cart
-   PUT /api/cart/:id
-   DELETE /api/cart/clear
-   DELETE /api/cart/:id

------------------------------------------------------------------------

# 🌍 Future Enhancements

-   💳 Payment Gateway Integration (Stripe)
-   ⭐ Product Reviews & Ratings
-   ☁️ Cloud Image Storage

------------------------------------------------------------------------

# 👨‍💻 Author

Eishal Khan\
GitHub: https://github.com/eishalK/SMV-ECOM

------------------------------------------------------------------------

# 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2026 Eishal Khan
