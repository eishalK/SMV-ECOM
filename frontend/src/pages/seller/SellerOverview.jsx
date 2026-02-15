import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Users, Wallet, FileText, TrendingUp, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getSellerOrders } from '../../services/orderApi';

const SellerOverview = () => {
    const { user } = useOutletContext();
    const navigate = useNavigate();
    const [loginTime, setLoginTime] = useState("");

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([]);
    const [performanceData, setPerformanceData] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        const fetchSellerData = async () => {
            setLoading(true);
            try {
                const now = new Date();
                setLoginTime(`${now.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);

                const orders = await getSellerOrders();

                const totalEarnings = orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
                
                // calculate unique customers
                const uniqueCustomerIds = new Set(
                    orders.map(order => order.customerId?._id || order.customerId)
                );
                const customerCount = uniqueCustomerIds.size;

                setStats([
                    { 
                        label: "My Customers", 
                        value: customerCount.toLocaleString(), 
                        growth: "+0%", 
                        icon: <Users size={20} />, 
                        iconBg: "bg-orange-50 text-[#f25a2b]" 
                    },
                    { 
                        label: "Total Orders", 
                        value: orders.length.toLocaleString(), 
                        growth: "+0%", 
                        icon: <FileText size={20} />, 
                        iconBg: "bg-blue-50 text-blue-600" 
                    },
                    { 
                        label: "Total Earnings", 
                        value: `$${totalEarnings.toLocaleString()}`, 
                        growth: "+0%", 
                        icon: <Wallet size={20} />, 
                        iconBg: "bg-emerald-50 text-emerald-600" 
                    },
                ]);

                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const monthlyData = months.map(month => ({ name: month, earnings: 0 }));

                orders.forEach(order => {
                    const date = new Date(order.createdAt);
                    const monthIndex = date.getMonth();
                    monthlyData[monthIndex].earnings += (order.totalAmount || 0);
                });

                const currentMonth = new Date().getMonth();
                setPerformanceData(monthlyData.slice(0, currentMonth + 1));
                setRecentOrders(orders.slice(0, 3));

            } catch (error) {
                console.error("Seller Data Error:", error);
                setStats([]);
                setPerformanceData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSellerData();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-4">
            <Loader2 className="animate-spin" size={40} />
            <p className="text-[10px] font-black uppercase tracking-widest">Syncing Store Data...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex justify-between items-start hover:shadow-lg transition-shadow">
                        <div>
                            <h2 className="text-3xl font-black tracking-tighter mb-1">{stat.value}</h2>
                            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">{stat.label}</p>
                            <div className={`mt-3 text-[10px] font-black ${stat.growth.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                                {stat.growth} <span className="text-gray-300 font-normal">VS LAST MONTH</span>
                            </div>
                        </div>
                        <div className={`p-4 rounded-2xl ${stat.iconBg}`}>{stat.icon}</div>
                    </div>
                ))}
            </div>
            {/* Side-by-Side Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                            <TrendingUp size={16} className="text-[#f25a2b]" /> Monthly Earnings
                        </h3>
                        <button onClick={() => navigate('/dashboard/orders')} className="text-[9px] font-black uppercase text-[#f25a2b] hover:underline">View All Orders</button>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                                <YAxis hide={true} domain={['auto', 'auto']} />
                                <Tooltip
                                    formatter={(value) => [`$${value.toLocaleString()}`, 'Earnings']}
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', fontSize: '10px', fontWeight: 'bold' }}
                                />
                                <Line type="monotone" dataKey="earnings" stroke="#f25a2b" strokeWidth={4} dot={{ r: 4, fill: '#f25a2b', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Log Section */}
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                    <h3 className="font-black uppercase text-xs tracking-[0.2em] mb-8">System Activity</h3>
                    <div className="space-y-8">
                        <ActivityItem color="bg-emerald-500" title="Session Started" time={loginTime} />

                        {recentOrders.length > 0 ? (
                            recentOrders.map((order, i) => (
                                <ActivityItem
                                    key={order._id}
                                    color={i === 0 ? "bg-[#f25a2b]" : "bg-blue-500"}
                                    title={`Order #${order._id.slice(-6)} Received`}
                                    time={new Date(order.createdAt).toLocaleDateString()}
                                />
                            ))
                        ) : (
                            <ActivityItem color="bg-gray-300" title="No recent orders" time="---" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActivityItem = ({ color, title, time }) => (
    <div className="flex gap-4">
        <div className={`w-2 h-2 rounded-full ${color} mt-1.5 shrink-0`} />
        <div>
            <p className="text-[11px] font-black leading-none mb-1">{title}</p>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{time}</p>
        </div>
    </div>
);

export default SellerOverview;