import React, { useState, useEffect } from 'react';
import { Package, Truck, Clock, CheckCircle, Search } from 'lucide-react';
import { getSellerOrders } from '../../services/orderApi';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getSellerOrders();
            setOrders(data);
        } catch (err) {
            console.error("Error fetching seller orders", err);
        } finally {
            setLoading(false);
        }
    };

    // Filter orders based on search term (order ID)
    const filteredOrders = orders.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'bg-emerald-100 text-emerald-600';
            case 'pending': return 'bg-orange-100 text-[#f25a2b]';
            case 'shipped': return 'bg-blue-100 text-blue-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-end">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="SEARCH ORDER ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-[#f25a2b]/20 outline-none w-64"
                    />
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center p-20 text-gray-400 font-bold uppercase tracking-widest">Loading Shipments...</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {orders.length === 0 ? (
                        <div className="bg-white p-20 rounded-[40px] text-center border-2 border-dashed border-gray-100">
                            <Package className="mx-auto text-gray-200 mb-4" size={48} />
                            <p className="text-gray-400 font-black uppercase tracking-widest">No orders found yet</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div key={order._id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-[#f25a2b]">
                                        <Package size={28} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-sm uppercase tracking-tighter">{order._id}</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Customer: {order.user?.name || 'Guest'}</p>
                                        <div className="flex items-center gap-2 mt-2 text-gray-500 font-bold text-[9px] uppercase">
                                            <Clock size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 border-x border-gray-50 px-8 hidden lg:block">
                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Shipping To</p>
                                    <p className="text-[11px] font-bold uppercase leading-tight line-clamp-2">
                                        {order.shippingAddress || "123 street near rose market - 12345"}
                                    </p>
                                </div>

                                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Total Payout</p>
                                        <p className="text-lg font-black text-[#f25a2b]">${(order.totalAmount || order.totalPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default SellerOrders;