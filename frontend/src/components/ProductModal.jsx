import React, { useState } from 'react';
import { FiX, FiPlus, FiMinus } from 'react-icons/fi';

const ProductModal = ({ product, onClose, onAddToCart, BACKEND_URL }) => {
    const [qty, setQty] = useState(1);

    if (!product) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-4xl relative flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-black hover:text-white transition-colors">
                    <FiX size={20} />
                </button>

                {/* Product Image */}
                <div className="w-full md:w-1/2 bg-[#f9f9f9] flex items-center justify-center p-12">
                    <img 
                        src={product.images?.[0] ? `${BACKEND_URL}${product.images[0]}` : '/placeholder.jpg'} 
                        alt={product.title}
                        className="max-h-[400px] object-contain"
                    />
                </div>

                {/* Product Details */}
                <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-black mb-2">{product.title}</h2>
                    <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => <span key={i} className="text-gray-300">★</span>)}
                        <span className="text-xs text-gray-400 ml-2">(0)</span>
                    </div>

                    <div className="text-4xl font-black text-[#f25a2b] mb-8">${product.price.toFixed(2)}</div>

                    <div className="space-y-4 mb-8">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Overview</p>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            {product.description }
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-black uppercase">Qty</span>
                            <div className="flex border border-gray-200">
                                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 hover:bg-gray-100"><FiMinus size={14}/></button>
                                <input type="number" value={qty} readOnly className="w-12 text-center text-sm font-bold border-x border-gray-200" />
                                <button onClick={() => setQty(qty + 1)} className="px-4 py-2 hover:bg-gray-100"><FiPlus size={14}/></button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => onAddToCart(product, qty)}
                                className="flex-1 bg-black text-white py-4 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#f25a2b] transition-all"
                            >
                                Add To Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;