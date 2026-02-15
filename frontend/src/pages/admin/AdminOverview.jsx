import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Loader2, Users, ListTree, DollarSign, ArrowUpRight } from 'lucide-react';
import { getAllUsers } from '../../services/userApi';
import { getCategories } from '../../services/categoryApi';
import { getSellerOrders } from '../../services/orderApi';

const AdminOverview = () => {
    const [stats, setStats] = useState({
        userCount: 0,
        categoryCount: 0,
        totalRevenue: 0
    });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRealData = async () => {
            setLoading(true);
            try {
                const [users, categories, orders] = await Promise.all([
                    getAllUsers(),
                    getCategories(),
                    getSellerOrders()
                ]);

                const actualTotalRev = orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

                const realSalesByCategory = categories.map(cat => {
                    const categoryRevenue = orders.reduce((acc, order) => {
                        // Check if any item in this order belongs to the current category
                        const hasCategoryMatch = order.items?.some(item =>
                            item.productId?.category === cat._id ||
                            item.productId?.category?.name === cat.name
                        );
                        return hasCategoryMatch ? acc + (order.totalAmount || 0) : acc;
                    }, 0);

                    return {
                        name: cat.name,
                        revenue: categoryRevenue
                    };
                });

                setStats({
                    userCount: users.length,
                    categoryCount: categories.length,
                    totalRevenue: actualTotalRev
                });

                setChartData(realSalesByCategory);
            } catch (error) {
                console.error("Dashboard Sync Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRealData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-4">
                <Loader2 className="animate-spin" size={40} />
                <p className="text-[10px] font-black uppercase tracking-widest">Fetching Live Database...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Real-time Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Platform Users"
                    value={stats.userCount}
                    icon={<Users size={20} />}
                    color="text-blue-600"
                    bg="bg-blue-50"
                />
                <StatCard
                    title="Active Categories"
                    value={stats.categoryCount}
                    icon={<ListTree size={20} />}
                    color="text-orange-600"
                    bg="bg-orange-50"
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    icon={<DollarSign size={20} />}
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                />
            </div>

            {/* Real Revenue Chart */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tighter">Sales by Category</h3>
                    </div>
                </div>

                {/* CRITICAL FIX: Ensure this div has a fixed height and a min-width */}
                <div style={{ width: '100%', height: 350, minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 9, fontWeight: 900, fill: '#6b7280' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                            />
                            <Tooltip
                                cursor={{ fill: '#f9fafb' }}
                                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="revenue" radius={[8, 8, 0, 0]} barSize={40}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#f25a2b' : '#000000'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, bg }) => (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm transition-all hover:shadow-md group">
        <div className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black tracking-tighter">{value}</p>
    </div>
);

export default AdminOverview;