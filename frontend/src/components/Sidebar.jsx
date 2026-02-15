import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, Package, TrendingUp, LogOut, Home
} from 'lucide-react';

const Sidebar = ({ handleLogout }) => {
  
  // Array-based menu for easy maintenance
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart size={18} />, path: '/dashboard/orders' },
    { id: 'products', label: 'Products', icon: <Package size={18} />, path: '/dashboard/products' },
    { id: 'revenue', label: 'Revenue', icon: <TrendingUp size={18} />, path: '/dashboard/revenue' },
  ];

  // Identical logic to AdminSidebar for a unified look
  const getNavLinkClass = ({ isActive }) => {
    const baseClass = "w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer text-xs uppercase font-bold tracking-widest transition-all mb-1";
    const activeClass = "bg-[#f25a2b] text-white shadow-md"; 
    const inactiveClass = "text-gray-500 hover:bg-gray-100 hover:text-black";
    
    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  return (
    <aside className="w-64 bg-white border-r hidden lg:flex flex-col h-screen sticky top-0 left-0 transition-all duration-300">
      
      {/* Brand Logo - Matched to Admin */}
      <div className="p-6 font-bold text-2xl text-[#f25a2b] flex items-center gap-2 uppercase tracking-tighter">
        <div className="w-8 h-8 bg-[#f25a2b] rounded-lg text-white flex items-center justify-center font-black text-lg">
          D
        </div>
        DecoMart
      </div>

      {/* Navigation Links */}
      <nav className="mt-4 px-4 space-y-1 flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            // Use 'end' for the root dashboard path so it doesn't overlap with revenue
            end={item.id === 'dashboard'} 
            className={getNavLinkClass}
          >
            {item.icon} {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t space-y-1">

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer text-xs uppercase font-bold tracking-widest transition-all text-red-500 hover:bg-red-50"
        >
          <LogOut size={18} /> Exit System
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;