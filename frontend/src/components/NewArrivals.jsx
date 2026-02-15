import React, { useRef, useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiShoppingCart, FiEye, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setCart } from '../redux/cartSlice';
import { addToCart } from '../services/cartApi';
import { getProducts } from '../services/productApi';
import { getCategories } from '../services/categoryApi';
import ProductModal from './ProductModal';

const NewArrivals = () => {
    const scrollRef = useRef(null);
    const dispatch = useDispatch();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const BACKEND_URL = "http://localhost:5000";

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [prodData, catData] = await Promise.all([
                    getProducts(),
                    getCategories()
                ]);

                setProducts(prodData);
                setCategories(catData);

                const newArrivalCategory = catData.find(
                    cat => cat.name.toLowerCase() === "new arrival"
                );

                if (newArrivalCategory) {
                    setActiveTab(newArrivalCategory.name);
                }
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.error("Error loading new arrivals:", error);
                }

            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Filter products based on selected category
    const filteredProducts = products.filter(p => {
        const categoryName = p.category?.name || p.category;
        return categoryName === activeTab;
    });


    const scroll = (direction) => {
        const { current } = scrollRef;
        if (direction === 'left') {
            current.scrollBy({ left: -350, behavior: 'smooth' });
        } else {
            current.scrollBy({ left: 350, behavior: 'smooth' });
        }
    };

    const handleAddToCart = async (product, quantity = 1) => {
        try {
            const cart = await addToCart(product._id, quantity);
            dispatch(setCart(cart.products));
            toast.success(`${product.title} added to cart`);
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error(error.response || error);
            }
            toast.error("Please login first");
        }
    };

    if (loading) {
        return (
            <div className="py-20 text-center font-bold uppercase text-xs">
                Loading New Arrivals...
            </div>
        );
    }

    return (
        <section id="new-arrivals" className="py-20 bg-[#f9f9f9]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-black mb-4">
                        NEW ARRIVALS
                    </h2>
                    <p className="text-gray-400 text-xs tracking-widest uppercase">
                        Shop the new selection of new arrivals at our store.
                    </p>
                </div>

                <div className="relative flex items-center">
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 z-10 p-2 hover:text-orange-500"
                    >
                        <FiChevronLeft size={24} />
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-8 no-scrollbar scroll-smooth px-10"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="min-w-[280px] flex flex-col items-center group cursor-pointer"
                                >
                                    <div className="relative w-full h-[350px] bg-[#f9f9f9] hover:bg-[#efefef] flex items-center justify-center mb-6 overflow-hidden">

                                        <img
                                            src={
                                                product.images && product.images.length > 0
                                                    ? `${BACKEND_URL}${product.images[0]}`
                                                    : '/placeholder.jpg'
                                            }
                                            alt={product.title}
                                            className="max-h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                                        />

                                        <div className="absolute top-4 right-[-50px] group-hover:right-4 flex flex-col gap-2 transition-all duration-300">
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="w-10 h-10 bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white transition-colors"
                                            >
                                                <FiShoppingCart />
                                            </button>

                                            <button
                                                onClick={() => setSelectedProduct(product)}
                                                className="w-10 h-10 bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white transition-colors"
                                            >
                                                <FiEye />
                                            </button>

                                            <button className="w-10 h-10 bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white transition-colors">
                                                <FiHeart />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-gray-600 text-sm mb-2">
                                        {product.title}
                                    </h3>

                                    <span className="text-black font-bold text-sm">
                                        ${product.price}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="min-w-full py-20 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                                No items found
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 z-10 p-2 hover:text-orange-500"
                    >
                        <FiChevronRight size={24} />
                    </button>
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

export default NewArrivals;