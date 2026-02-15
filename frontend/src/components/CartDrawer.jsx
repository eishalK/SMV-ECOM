import React, { useEffect, useState } from 'react';
import { FiX, FiTrash2 } from "react-icons/fi";
import { useSelector, useDispatch } from 'react-redux'; 
import { setCart, clearCart } from '../redux/cartSlice'; 
import { getCart, updateCartItem, removeCartItem } from '../services/cartApi';
import { Link } from "react-router-dom";

const CartDrawer = ({ isOpen, onClose }) => {
    const BACKEND_URL = "http://localhost:5000";
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);

    // Fetch cart items whenever the drawer opens
    useEffect(() => {
        if (isOpen) {
            if (token) {
                fetchCart();
            } else {
                dispatch(clearCart()); // Clear cart if no user is logged in
            }
        }
    }, [isOpen, token, dispatch]);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const data = await getCart();
            dispatch(setCart(data.products || []));
        } catch (error) {
            console.error('Error fetching cart:', error);
            if (error.response?.status === 401) {
                dispatch(clearCart());
            }
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (productId, quantity) => {
        if (quantity < 1) return;
        try {
            const updatedCart = await updateCartItem(productId, quantity);
            dispatch(setCart(updatedCart.products || []));
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleRemove = async (productId) => {
        try {
            const updatedCart = await removeCartItem(productId);
            dispatch(setCart(updatedCart.products || []));
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    // Calculation Logic
    const subTotal = cartItems.reduce((acc, item) => {
        const price = Number(item.productId?.price) || 0;
        return acc + price * item.quantity;
    }, 0);
    
    const taxRate = 0.10;
    const taxAmount = subTotal * taxRate;
    const total = subTotal + taxAmount;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex justify-end">
            <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

            <div className="relative w-full max-w-md bg-white h-full shadow-xl flex flex-col animate-slideInRight">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-6 border-b">
                    <h2 className="text-sm font-bold tracking-widest uppercase">My Shopping Cart</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-black">
                        <FiX size={24} />
                    </button>
                </div>

                {/* Cart Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col">
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            Updating Cart...
                        </div>
                    ) : cartItems.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
                            <p className="uppercase tracking-widest text-xs text-center">Your cart is empty</p>
                            <button onClick={onClose} className="text-[#f25a2b] font-bold text-[10px] uppercase border-b border-[#f25a2b]">
                                Return to Shop
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.productId?._id} className="flex gap-4 border-b pb-6">
                                    <div className="w-24 h-24 bg-[#f9f9f9] flex items-center justify-center p-2">
                                        <img
                                            src={item.productId?.images?.[0] 
                                                ? `${BACKEND_URL}${item.productId.images[0]}` 
                                                : '/placeholder.png'}
                                            alt={item.productId?.title}
                                            className="max-h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-black">
                                                {item.productId?.title || "Product Name"}
                                            </h3>
                                            <button onClick={() => handleRemove(item.productId?._id)} className="text-gray-400 hover:text-red-500">
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                        <p className="text-sm font-black mt-2">${Number(item.productId?.price || 0).toFixed(2)}</p>
                                        <div className="mt-4 flex items-center gap-2">
                                            <span className="text-[10px] uppercase font-bold text-gray-400">Qty:</span>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.productId?._id, Number(e.target.value))}
                                                className="w-12 border border-gray-100 rounded-md text-center text-xs py-1 font-bold outline-none focus:border-black"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="px-6 py-8 bg-white border-t space-y-3">
                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-400">
                            <span>Sub-Total</span>
                            <span className="text-black">${subTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b pb-3">
                            <span>Tax (10%)</span>
                            <span className="text-black">${taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-black uppercase py-2">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        <div className="mt-6">
                            <Link to="/checkout" onClick={onClose} className="w-full">
                                <button className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#f25a2b] transition-all duration-500 shadow-xl shadow-black/5">
                                    Proceed To Checkout
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;