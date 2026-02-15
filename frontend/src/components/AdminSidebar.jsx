import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, ListTree, Package, LogOut 
} from 'lucide-react';

const AdminSidebar = ({ handleLogout }) => {
  
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/admin-dashboard' },
    { id: 'users', label: 'Users', icon: <Users size={18} />, path: '/admin-dashboard/users' },
    { id: 'categories', label: 'Categories', icon: <ListTree size={18} />, path: '/admin-dashboard/categories' },
    { id: 'orders', label: 'Orders', icon: <Package size={18} />, path: '/admin-dashboard/orders' },
  ];

  const getNavLinkClass = ({ isActive }) => {
    const baseClass = "w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer text-xs uppercase font-bold tracking-widest transition-all mb-1";
    const activeClass = "bg-[#f25a2b] text-white shadow-md"; 
    const inactiveClass = "text-gray-500 hover:bg-gray-100 hover:text-black";
    
    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  return (
    <aside className="w-64 bg-white border-r hidden lg:flex flex-col h-screen sticky top-0 left-0">
      
      {/* Brand Logo */}
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
            // used end for the base path so it doesn't stay highlighted when on sub-pages like /admin-dashboard/users
            end={item.id === 'overview'} 
            className={getNavLinkClass}
          >
            {item.icon} {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section / Logout */}
      <div className="p-4 border-t">
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

export default AdminSidebar;