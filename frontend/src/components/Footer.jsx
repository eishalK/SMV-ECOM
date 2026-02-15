import React from 'react';
import { FiTruck, FiDollarSign, FiHeadphones, FiGift } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaPinterestP, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        
        {/* Services Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-20 border-b pb-20 border-gray-100">
          {[
            { icon: <FiTruck size={32} />, title: "FREE SHIPPING" },
            { icon: <FiDollarSign size={32} />, title: "30 DAYS MONEY BACK" },
            { icon: <FiHeadphones size={32} />, title: "24/7 HELP CENTER" },
            { icon: <FiGift size={32} />, title: "GIFT PROMOTION" },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group cursor-default">
              <div className="mb-4 text-black group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h4 className="text-xs font-bold tracking-widest mb-3 uppercase">{item.title}</h4>
              <p className="text-gray-400 text-[11px] leading-relaxed max-w-[200px]">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
              </p>
            </div>
          ))}
        </div>

        {/* Links & Newsletter Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-20">
          
          {/* Menu Columns */}
          <div className="md:col-span-2">
            <h5 className="font-bold text-xs tracking-widest uppercase mb-6">Shop</h5>
            <ul className="text-gray-400 text-[11px] space-y-3 tracking-widest uppercase">
              <li className="hover:text-black cursor-pointer">New Arrivals</li>
              <li className="hover:text-black cursor-pointer">Sale & Special Offer</li>
              <li className="hover:text-black cursor-pointer">Living Room</li>
              <li className="hover:text-black cursor-pointer">Furniture Decor</li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h5 className="font-bold text-xs tracking-widest uppercase mb-6">Information</h5>
            <ul className="text-gray-400 text-[11px] space-y-3 tracking-widest uppercase">
              <li className="hover:text-black cursor-pointer">About Us</li>
              <li className="hover:text-black cursor-pointer">Customer Services</li>
              <li className="hover:text-black cursor-pointer">Blog</li>
              <li className="hover:text-black cursor-pointer">Contact Us</li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h5 className="font-bold text-xs tracking-widest uppercase mb-6">Order</h5>
            <ul className="text-gray-400 text-[11px] space-y-3 tracking-widest uppercase">
              <li className="hover:text-black cursor-pointer">My Account</li>
              <li className="hover:text-black cursor-pointer">View Bag</li>
              <li className="hover:text-black cursor-pointer">Privacy Policy</li>
              <li className="hover:text-black cursor-pointer">Cookie Policy</li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="md:col-span-6">
            <h5 className="font-bold text-xs tracking-widest uppercase mb-6">Sign Up For Newsletter</h5>
            <p className="text-gray-500 text-[11px] mb-6">Don't miss out on exciting promotions and the latest shopping news</p>
            <div className="flex w-full mb-8">
              <input 
                type="email" 
                placeholder="Your email address..." 
                className="flex-grow border border-gray-200 px-4 py-3 text-xs outline-none focus:border-black transition-colors"
              />
              <button className="bg-[#1a1a1a] text-white px-8 py-3 text-[10px] font-bold tracking-widest uppercase hover:bg-[#f25a2b] transition-colors">
                Subscribe
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              {[FaFacebookF, FaTwitter, FaPinterestP, FaInstagram].map((Icon, i) => (
                <div key={i} className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-[#f25a2b] hover:text-white transition-all cursor-pointer rounded-sm">
                  <Icon size={14} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 pt-8 text-center">
          <p className="text-gray-400 text-[10px] tracking-widest uppercase">
            Copyright © 2026. Designed by <span className="text-[#f25a2b] cursor-pointer">DecoMart</span>. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;