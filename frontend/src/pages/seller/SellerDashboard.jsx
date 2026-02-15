import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

const SellerDashboard = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/');
    };

    // Safety check
    if (!user || user.role !== 'seller') return null;

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900 uppercase">
            <Sidebar handleLogout={handleLogout} />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Global Seller Header */}
                <header className="flex justify-between items-center p-8 bg-white/80 backdrop-blur-md border-b border-gray-100">
                    <div>
                        <p className="text-[10px] font-black text-[#f25a2b] tracking-[0.3em] mb-1">
                            Seller / Portal
                        </p>
                        <h1 className="text-3xl font-black tracking-tighter uppercase">
                            Store Management
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-[10px] font-black tracking-widest leading-none">{user?.name}</p>
                            <span className="text-[8px] text-emerald-500 font-bold">Verified Partner</span>
                        </div>
                        <div className="w-12 h-12 bg-[#f25a2b] rounded-2xl flex items-center justify-center text-white font-bold border-4 border-white shadow-xl rotate-3 hover:rotate-0 transition-transform cursor-default">
                            {user?.name?.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* Main Content Area - This is where SellerOverview will render */}
                <main className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-[#fafafa]">
                    <Outlet context={{ user }} />
                </main>
            </div>
        </div>
    );
};

export default SellerDashboard;