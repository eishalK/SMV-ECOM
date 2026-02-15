import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import DataTable from '../../components/DataTable';
import { getSellerOrders, updateOrderStatus } from '../../services/orderApi';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await getSellerOrders();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Order Load Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadOrders(); }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await updateOrderStatus(id, status);
            loadOrders(); 
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    const tableData = orders.map(order => ({
        ...order, 
        customerName: order.customerId?.name || "Guest User",
        statusBadge: (
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
                {order.status}
            </span>
        ),
        amountDisplay: `$${Number(order.totalAmount || 0).toFixed(2)}`,
        dateDisplay: new Date(order.createdAt).toLocaleDateString()
    }));

    return (
        <div className="p-6 space-y-6">
        {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100">
                    <p className="text-[10px] font-black uppercase text-gray-400">Total Revenue</p>
                    <h3 className="text-2xl font-black">${orders.reduce((acc, o) => acc + o.totalAmount, 0).toFixed(2)}</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100">
                    <p className="text-[10px] font-black uppercase text-gray-400">Active Orders</p>
                    <h3 className="text-2xl font-black text-blue-500">{orders.filter(o => o.status !== 'Delivered').length}</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100">
                    <p className="text-[10px] font-black uppercase text-gray-400">Total Orders</p>
                    <h3 className="text-2xl font-black">{orders.length}</h3>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-gray-50">
                    <h2 className="font-black uppercase tracking-tighter text-xl">Recent Orders</h2>
                </div>

                <DataTable 
                    columns={['Order ID', 'Customer', 'Status', 'Amount', 'Placed On']}
                    keys={['_id', 'customerName', 'statusBadge', 'amountDisplay', 'dateDisplay']}
                    data={tableData}
                    renderActions={(order) => (
                        <div className="flex items-center gap-3">
                            <select 
                                className="bg-gray-50 border-none text-[10px] font-bold uppercase p-2 rounded-lg outline-none"
                                value={order.status}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                           
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default OrderManagement;