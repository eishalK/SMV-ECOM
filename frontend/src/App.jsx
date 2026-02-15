import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import NewArrivals from './components/NewArrivals';
import Bestseller from './components/BestSeller';
import StoreBanner from './components/StoreBanner';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import CartDrawer from './components/CartDrawer';
import Checkout from './pages/Checkout';

// Imports for Seller Dashboard
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerOverview from './pages/seller/SellerOverview';
import RevenueTracking from './pages/seller/RevenueTracking';
import SellerOrder from './pages/seller/SellerOrder';
import SellerProduct from './pages/seller/SellerProduct';

// Import for Admin Dashboard
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOverview from './pages/admin/AdminOverview';
import UserManagement from './pages/admin/UserManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import OrderManagement from './pages/admin/OrderManagement';


// created a sub-component to use the useLocation() hook
const AppContent = () => {
    const [authView, setAuthView] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const location = useLocation();

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // Dynamically check if we are on a dashboard route
    const dashboardPaths = ['/dashboard', '/admin-dashboard'];
    const isDashboard = dashboardPaths.some(path => location.pathname.startsWith(path));
    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    success: {
                        style: {
                            background: '#f25a2b',
                            color: '#fff'
                        }
                    },
                    error: {
                        style: {
                            background: '#000',
                            color: '#fff'
                        }
                    }
                }}
            />

            <div className="min-h-screen relative">
                {/* Navbar shows on all shop pages, even for logged-in sellers */}
                {!isDashboard && (
                    <Navbar
                        onLoginClick={() => setAuthView('login')}
                        onRegisterClick={() => setAuthView('signup')}
                        onCartClick={() => setIsCartOpen(true)}
                        user={user}
                    />
                )}

                <Routes>
                    {/* Home Route: Accessible by everyone */}
                    <Route path="/" element={
                        <main>
                            <Hero />
                            <Categories />
                            <NewArrivals />
                            <Bestseller />
                            <StoreBanner />
                        </main>
                    } />

                    <Route path="/checkout" element={<Checkout />} />

                    {/* Seller Dashboard Routes */}
                    <Route path="/dashboard" element={user?.role === 'seller' ? <SellerDashboard user={user} setUser={setUser} /> : <Navigate to="/" />}>
                        <Route index element={<SellerOverview />} />
                        <Route path="products" element={<SellerProduct />} />
                        <Route path="orders" element={<SellerOrder />} />
                        <Route path="revenue" element={<RevenueTracking />} />
                    </Route>

                    {/* Admin Dashboard Routes */}
                    <Route path="/admin-dashboard" element={user?.role === 'admin' ? <AdminDashboard user={user} setUser={setUser} /> : <Navigate to="/" />}>
                        {/* These will render inside the AdminDashboard Outlet */}
                        <Route index element={<AdminOverview />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="categories" element={<CategoryManagement />} />
                        <Route path="orders" element={<OrderManagement />} />
                    </Route>
                </Routes>

                {/* Footer hidden on dashboard */}
                {!isDashboard && <Footer />}

                {/* Modals */}
                {authView === 'signup' && (
                    <Signup
                        onBack={() => setAuthView(null)}
                        onLoginSwitch={() => setAuthView('login')}
                    />
                )}

                {authView === 'login' && (
                    <Login
                        onBack={() => setAuthView(null)}
                        onSignupSwitch={() => setAuthView('signup')}
                        onLoginSuccess={(userData) => {
                            setUser(userData);
                            localStorage.setItem("user", JSON.stringify(userData));
                            setAuthView(null);
                        }}
                    />
                )}

                <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            </div>
        </>
    );
};

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;