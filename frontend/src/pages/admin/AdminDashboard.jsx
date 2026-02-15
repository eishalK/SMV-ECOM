import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import Signup from '../../components/Signup';
import Login from '../../components/Login';
import { useState } from 'react';


const AdminDashboard = ({ user, setUser }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showAdminRegister, setShowAdminRegister] = useState(false);
    const [showAdminLogin, setShowAdminLogin] = useState(false);

    // Helper to get the current page title from the URL
    const pageTitle = location.pathname.split('/').pop() || 'Overview';

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/');
    };

    // If somehow a non-admin gets here, kick them out immediately
    if (!user || user.role !== 'admin') {
        return null; // App.js Navigate will handle the redirect
    }

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900 uppercase">
            {/* Sidebar stays fixed on the left */}
            <AdminSidebar handleLogout={handleLogout} />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Global Admin Header */}
                <header className="flex justify-between items-center p-8 bg-white/50 backdrop-blur-md border-b border-gray-100">
                    <div>
                        <p className="text-[10px] font-black text-[#f25a2b] tracking-[0.3em] mb-1">
                            System / {pageTitle}
                        </p>
                        <h1 className="text-3xl font-black tracking-tighter uppercase">
                            Admin Portal
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">

                        {/* User Profile Info */}
                        <button
                            onClick={() => setShowAdminRegister(true)}
                            className="text-[#f25a2b] px-4 py-2 text-[10px] tracking-widest font-bold uppercase hover:bg-gray-100 transition"
                        >
                            Register Admin
                        </button>

                        <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-full border border-gray-100 shadow-sm">
                            <div className="w-10 h-10 bg-[#f25a2b] rounded-full flex items-center justify-center text-white font-bold border-2 border-white">
                                {user?.name?.charAt(0)}
                            </div>
                            <span className="text-[10px] font-black tracking-widest">{user?.name}</span>
                        </div>


                    </div>
                </header>

                {/* Main Content Area - Scrollable */}
                <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                    {/* Individual task pages render here */}
                    <Outlet context={{ user }} />
                </main>

                {showAdminRegister && (
                    <Signup
                        isAdminContext={true}
                        onBack={() => setShowAdminRegister(false)}
                        onLoginSwitch={() => {
                            setShowAdminRegister(false);
                            setShowAdminLogin(true);
                        }}
                    />
                )}

                {showAdminLogin && (
                    <Login
                        isAdminContext={true}
                        onBack={() => setShowAdminLogin(false)}
                        onSignupSwitch={() => {
                            setShowAdminLogin(false);
                            setShowAdminRegister(true);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;