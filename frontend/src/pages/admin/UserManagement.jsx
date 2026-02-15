import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Loader2, X, Check, Shield } from 'lucide-react';
import DataTable from '../../components/DataTable';
import { getAllUsers, deleteUser, updateUserRole } from '../../services/userApi';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // State for Role Update Modal
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Load failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // To filter users based on the search input
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (!window.confirm("Permanent Action: Delete this user?")) return;
        try {
            await deleteUser(id);
            setUsers(prev => prev.filter(u => u._id !== id));
        } catch (error) {
            alert("Delete failed");
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    return (
        <div className="animate-in fade-in duration-500 space-y-8">

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black uppercase">Users ({users.length})</h2>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="p-3 bg-white border border-gray-100 rounded-xl text-xs font-bold w-64 focus:ring-1 focus:ring-[#f25a2b] outline-none shadow-sm transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center p-20 text-gray-400">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : (
                    <DataTable
                        columns={['Name', 'Email', 'Role']}
                        keys={['name', 'email', 'role']}
                        data={filteredUsers}
                        renderActions={(user) => (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => openEditModal(user)}
                                    className="p-2 hover:text-[#f25a2b] transition-colors"
                                >
                                    <Edit size={16}/>
                                </button>
                                <button 
                                    onClick={() => handleDelete(user._id)} 
                                    className="p-2 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={16}/>
                                </button>
                            </div>
                        )}
                    />
                )}
            </div>

            {/* Local Role Update Modal */}
            {isModalOpen && (
                <RoleUpdateModal
                    user={selectedUser}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={loadUsers}
                />
            )}
        </div>
    );
};

// --- LOCAL ROLE UPDATE MODAL ---
const RoleUpdateModal = ({ user, onClose, onSuccess }) => {
    const [role, setRole] = useState(user.role);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateUserRole(user._id, role);
            onSuccess();
            onClose();
        } catch (error) {
            alert("Update failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black tracking-tighter uppercase">Edit User Role</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="mb-6">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Target User</p>
                        <p className="text-lg font-black">{user.name}</p>
                        <p className="text-xs text-gray-500 lowercase">{user.email}</p>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                                Select Permission Level
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#f25a2b] font-bold appearance-none"
                            >
                                <option value="user">User</option>
                                <option value="seller">Seller</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-black text-white p-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#f25a2b] transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? "Updating..." : (
                                <>
                                    <Shield size={16} /> Confirm New Role
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;