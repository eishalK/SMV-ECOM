import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiEye, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setCart } from '../redux/cartSlice';
import { addToCart } from '../services/cartApi';
import { getProducts } from '../services/productApi'; 
import { getCategories } from '../services/categoryApi'; 
import ProductModal from './ProductModal';

const Bestseller = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState(''); // Default to empty initially
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const [selectedProduct, setSelectedProduct] = useState(null);

    const BACKEND_URL = "http://localhost:5000";

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [prodData, catData] = await Promise.all([ // Fetch products and categories in parallel
                    getProducts(),
                    getCategories()
                ]);
                
                setProducts(prodData);
                setCategories(catData);
                
                // Set the first category as active by default if it exists
                if (catData.length > 0) {
                    setActiveTab(catData[0].name);
                }
            } catch (error) {
                console.error("Error loading bestseller data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Filter products based on the activeTab name
    const filteredProducts = products.filter(p => {
        const categoryName = p.category?.name || p.category;
        return categoryName === activeTab;
    });

    const handleAddToCart = async (product) => {
        try {
            const cart = await addToCart(product._id, 1); 
            dispatch(setCart(cart.products));
            toast.success(`${product.title} added to cart`);
        } catch (error) {
            console.error(error.response || error);
            toast.error("Please login first");
        }
    };

    if (loading) return <div className="py-20 text-center font-bold tracking-widest uppercase text-xs">Loading Collections...</div>;

    return (
        <section id="bestseller" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tight text-black mb-4 uppercase">Bestseller</h2>
                    <p className="text-gray-400 text-[10px] tracking-widest uppercase max-w-xl mx-auto">
                        Our website best selling products.
                    </p>
                </div>

                {/* Dynamic Category Tabs */}
                <div className="flex justify-center flex-wrap gap-2 mb-16">
                    {categories.map(cat => (
                        <button
                            key={cat._id}
                            onClick={() => setActiveTab(cat.name)}
                            className={`px-8 py-3 text-[11px] font-bold tracking-widest transition-all duration-300 uppercase ${
                                activeTab === cat.name
                                    ? 'bg-[#f25a2b] text-white'
                                    : 'bg-[#f8f8f8] text-black hover:bg-gray-200'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <div key={product._id} className="flex flex-col items-center group cursor-pointer animate-fadeIn">
                                <div className="relative w-full h-[350px] bg-[#f9f9f9] hover:bg-[#efefef] flex items-center justify-center mb-6 overflow-hidden transition-colors duration-300">
                                    <img
                                        src={product.images && product.images.length > 0 
                                            ? `${BACKEND_URL}${product.images[0]}` 
                                            : '/placeholder.jpg'} // Fallback image
                                        alt={product.title}
                                        className="max-h-full object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                                    />

                                    <div className="absolute top-4 right-[-50px] group-hover:right-4 flex flex-col gap-2 transition-all duration-300">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="w-10 h-10 bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-[#f25a2b] hover:text-white transition-colors"
                                        >
                                            <FiShoppingCart />
                                        </button>
                                        <button 
                                            onClick={() => setSelectedProduct(product)}
                                            className="w-10 h-10 bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-[#f25a2b] hover:text-white transition-colors">
                                            <FiEye />
                                        </button>
                                        <button className="w-10 h-10 bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-[#f25a2b] hover:text-white transition-colors">
                                            <FiHeart />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-gray-500 text-xs mb-2 text-center uppercase tracking-tight">{product.title}</h3>
                                <span className="text-black font-bold text-sm">${product.price}</span>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">
                            No items found in {activeTab}
                        </div>
                    )}
                </div>
            </div>
            {selectedProduct && (
                            <ProductModal
                                product={selectedProduct}
                                onClose={() => setSelectedProduct(null)}
                                onAddToCart={handleAddToCart}
                                BACKEND_URL={BACKEND_URL}
                            />
                        )}
        </section>
    );
};

export default Bestseller;