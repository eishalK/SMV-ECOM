import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Loader2, X, Check } from 'lucide-react';
import DataTable from '../../components/DataTable';
import { getCategories, deleteCategory, createCategory, updateCategory } from '../../services/categoryApi';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null); // Track if we are editing

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure? This may affect products in this category.")) return;
        try {
            await deleteCategory(id);
            setCategories(prev => prev.filter(c => c._id !== id));
        } catch (error) {
            alert("Delete failed.");
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    return (
        <div className="animate-in fade-in duration-500 space-y-8">
            <header className="flex justify-between items-end">
                <button 
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-[10px] font-black tracking-widest hover:bg-[#f25a2b] transition-all shadow-lg hover:shadow-orange-500/20"
                >
                    <Plus size={16} /> Create New Category
                </button>
            </header>

            {loading ? (
                <div className="flex justify-center p-20 text-gray-400">
                    <Loader2 className="animate-spin" />
                </div>
            ) : (
                <DataTable 
                    columns={['Name', 'Created At']}
                    keys={['name', 'createdAt']}
                    data={categories}
                    renderActions={(item) => (
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleEdit(item)}
                                className="p-2 hover:text-[#f25a2b] transition-colors"
                            >
                                <Edit size={16} />
                            </button>
                            <button 
                                onClick={() => handleDelete(item._id)}
                                className="p-2 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
                />
            )}

            {isModalOpen && (
                <LocalCategoryModal 
                    isOpen={isModalOpen} 
                    category={editingCategory}
                    onClose={() => setIsModalOpen(false)} 
                    onSuccess={loadCategories} 
                />
            )}
        </div>
    );
};

// --- LOCAL SUB-COMPONENT ---
const LocalCategoryModal = ({ isOpen, onClose, onSuccess, category }) => {
    // If category exists, we are in EDIT mode, otherwise ADD mode
    const [name, setName] = useState(category ? category.name : '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (category) {
                // UPDATE Action
                await updateCategory(category._id, name);
            } else {
                // CREATE Action
                await createCategory(name); 
            }
            onSuccess();
            onClose();
        } catch (error) {
            alert(error.response?.data?.message || "Operation failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black tracking-tighter uppercase">
                            {category ? 'Edit Category' : 'New Category'}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                                Category Title
                            </label>
                            <input 
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Modern Furniture"
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#f25a2b]/20 focus:border-[#f25a2b] transition-all font-bold"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-black text-white p-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#f25a2b] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? "Processing..." : (
                                <>
                                    <Check size={16} /> {category ? 'Update Category' : 'Save Category'}
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CategoryManagement;