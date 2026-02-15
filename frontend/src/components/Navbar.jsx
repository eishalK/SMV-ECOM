import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiHeart, FiShoppingBag, FiChevronDown } from "react-icons/fi";
import getInitials from "../utils/getInitials";
import { logout } from "../redux/authSlice";
import { clearCart } from "../redux/cartSlice";
import { Link, useNavigate, useLocation } from "react-router-dom";



const Navbar = ({ onLoginClick, onRegisterClick, onCartClick }) => {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const user = useSelector(
    (state) => state.auth?.user ?? null
  );

  const dispatch = useDispatch();

  const [showDropdown, setShowDropdown] = useState(false);
  const [openPages, setOpenPages] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenPages(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }

    setOpenPages(false);
  };


  const handleLogout = () => {
    dispatch(logout()); // Clear user from Redux
    dispatch(clearCart()); // Clear cart from Redux
    setShowDropdown(false);
  };


  return (
    <nav className="sticky top-0 z-50 w-full flex items-center justify-between px-24 py-7 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm transition-all duration-300">

      {/* Left Menu */}
      <div className="flex gap-10 text-[11px] font-semibold tracking-[0.25em] uppercase text-gray-800">
        <Link
          to="/"
          onClick={() => {
            setTimeout(() => {
              document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
          className="hover:text-orange-600 transition cursor-pointer"
        >
          Home
        </Link>

        <div
          onClick={() => {
            const element = document.getElementById("bestseller");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="flex items-center gap-1 hover:text-orange-600 transition cursor-pointer"
        >
          Features
        </div>

        {/* Pages Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setOpenPages(!openPages)}
            className="flex items-center gap-1 hover:text-orange-600 transition cursor-pointer"
          >
            Pages <FiChevronDown size={12} />
          </div>

          {openPages && (
            <div className="absolute top-full left-0 mt-4 w-48 bg-white shadow-lg border border-gray-100 py-4 z-50">

              <div
                onClick={() => scrollToSection("categories")}
                className="block px-6 py-2 hover:bg-gray-50 hover:text-orange-600 transition cursor-pointer"
              >
                Categories
              </div>

              <div
                onClick={() => scrollToSection("new-arrivals")}
                className="block px-6 py-2 hover:bg-gray-50 hover:text-orange-600 transition cursor-pointer"
              >
                New Arrival
              </div>

              <div
                onClick={() => scrollToSection("bestseller")}
                className="block px-6 py-2 hover:bg-gray-50 hover:text-orange-600 transition cursor-pointer"
              >
                Best Seller
              </div>

              <div
                onClick={() => scrollToSection("storebanner")}
                className="block px-6 py-2 hover:bg-gray-50 hover:text-orange-600 transition cursor-pointer"
              >
                Contact
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Logo */}
      <div className="text-4xl font-extrabold tracking-tight">
        Deco<span className="text-orange-600">Mart</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5 text-[13px] font-semibold tracking-widest uppercase text-gray-700">

        {/* Icons */}
        <FiHeart className="cursor-pointer hover:text-orange-600 transition" />

        <div className="relative cursor-pointer" onClick={onCartClick}>
          <FiShoppingBag className="hover:text-orange-600 transition" />
          {totalQuantity > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#f25a2b] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
              {totalQuantity}
            </span>
          )}
        </div>

        {/* User Initials / Login/Register */}
        {user ? (
          <div className="relative">
            <div
              onClick={() => setShowDropdown((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-[#f25a2b] text-white flex items-center justify-center cursor-pointer"
            >
              {getInitials(user.name || user.email)}
            </div>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <span
              onClick={onLoginClick}
              className="hover:text-orange-600 cursor-pointer transition-colors"
            >
              Login
            </span>

            <span className="text-gray-300">/</span>

            <span
              onClick={onRegisterClick}
              className="hover:text-orange-600 cursor-pointer transition-colors px-1"
            >
              Register
            </span>
          </>
        )}
      </div>
    </nav >
  );
};

export default Navbar;
