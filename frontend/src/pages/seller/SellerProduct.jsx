import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Loader2, X, Check, Upload } from 'lucide-react';
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from '../../services/productApi';
import { getCategories } from '../../services/categoryApi';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const SellerProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = useSelector((state) => state.auth?.user);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        title: '', price: '', description: '', category: '', stock: ''
    });

    // Image handling states
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const BACKEND_URL = "http://localhost:5000"; // Ensure this matches your server port

    // Only show products where the product's seller matches the logged-in user's ID
    const myProducts = products.filter(product => {
        const productSellerId = product.sellerId?._id || product.sellerId;
        const currentUserId = user?._id;

        return productSellerId?.toString() === currentUserId?.toString();
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [prodData, catData] = await Promise.all([getProducts(), getCategories()]);
            setProducts(prodData);
            setCategories(catData);
        } catch (error) {
            console.error("Initialization failed", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle local file selection and preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Create a temporary local URL for the preview
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditId(product._id);
            setFormData({
                title: product.title || product.name || '',
                price: product.price || '',
                description: product.description || '',
                category: product.category?._id || product.category || '',
                stock: product.stock || 0
            });
            // Show existing image from backend if editing
            if (product.images && product.images.length > 0) {
                setImagePreview(`${BACKEND_URL}${product.images[0]}`);
            } else {
                setImagePreview(null);
            }
        } else {
            setEditId(null);
            setFormData({ title: '', price: '', description: '', category: '', stock: '' });
            setImagePreview(null);
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('price', formData.price);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('stock', formData.stock);

        if (user?._id) {
            data.append('seller', user._id);
        }

        // Only append 'image' if a new file was selected
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            if (editId) {
                await updateProduct(editId, data);
            } else {
                await createProduct(data);
            }

            setIsModalOpen(false);
            loadData(); // Refresh the list
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
            console.error("Submission failed", err);
            }
            toast.error("Operation failed. Ensure your backend is running and fields are correct.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await deleteProduct(id);
            setProducts(products.filter(p => p._id !== id));
        } catch (err) {
            alert("Delete failed");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-end">
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-black text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#f25a2b] transition-all flex items-center gap-2 shadow-lg shadow-black/10"
                >
                    <Plus size={16} /> Add New Product
                </button>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                    <Loader2 className="animate-spin mb-2" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Syncing Warehouse...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myProducts.map((product) => (
                        <div key={product._id} className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                            <div className="h-52 bg-gray-100 relative">
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={`${BACKEND_URL}${product.images[0]}`}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300"><Package size={40} /></div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm">
                                    Stock: {product.stock}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-black uppercase text-sm tracking-tight line-clamp-1">{product.title}</h3>
                                    <span className="text-[#f25a2b] font-black text-sm">${product.price}</span>
                                </div>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                                    {categories.find(c => c._id === (product.category?._id || product.category))?.name || 'Uncategorized'}
                                </p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(product)}
                                        className="flex-1 bg-gray-50 hover:bg-black hover:text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                    >
                                        <Edit size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-10">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black uppercase tracking-tighter">
                                    {editId ? 'Modify Listing' : 'New Listing'}
                                </h2>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-5">
                                    <FormInput label="Product Title" value={formData.title} onChange={v => setFormData({ ...formData, title: v })} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormInput label="Price ($)" type="number" value={formData.price} onChange={v => setFormData({ ...formData, price: v })} />
                                        <FormInput label="Stock" type="number" value={formData.stock} onChange={v => setFormData({ ...formData, stock: v })} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Category</label>
                                        <select
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-xs uppercase outline-none focus:ring-2 focus:ring-[#f25a2b]/20"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Description</label>
                                        <textarea
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-xs h-32 resize-none outline-none focus:ring-2 focus:ring-[#f25a2b]/20"
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="PRODUCT DETAILS..."
                                        />
                                    </div>

                                    {/* Image Upload with Preview */}
                                    <div className="relative border-2 border-dashed border-gray-100 rounded-[24px] p-2 text-center hover:border-[#f25a2b] transition-colors group min-h-[140px] flex items-center justify-center overflow-hidden">
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />

                                        {imagePreview ? (
                                            <div className="relative w-full h-full">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-32 object-contain rounded-xl"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                                    <p className="text-white text-[9px] font-black uppercase">Change Image</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-4">
                                                <Upload size={24} className="mx-auto mb-2 text-gray-300 group-hover:text-[#f25a2b] transition-colors" />
                                                <p className="text-[9px] font-black uppercase text-gray-400">Add Image</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full mt-10 bg-black text-white p-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#f25a2b] transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10">
                                <Check size={18} /> {editId ? 'Update Product' : 'Publish to Store'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const FormInput = ({ label, type = "text", value, onChange }) => (
    <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">{label}</label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-xs outline-none focus:ring-2 focus:ring-[#f25a2b]/20"
            required
        />
    </div>
);

export default SellerProductManagement;