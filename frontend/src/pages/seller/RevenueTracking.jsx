import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, Filter, DollarSign, PieChart, Clock, Loader2 } from 'lucide-react';
import { getSellerOrders } from '../../services/orderApi';

const RevenueTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const data = await getSellerOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching revenue:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenueData();
  }, []);

  // --- Financial Calculations ---
  // Gross: The sum of totalAmount 
  const totalGross = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
  
  // Fee: A 10% platform fee
  const platformFees = totalGross * 0.10;
  
  // Net: What the seller actually keeps
  const netRevenue = totalGross - platformFees;

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-4">
      <Loader2 className="animate-spin" size={40} />
      <p className="text-[10px] font-black uppercase tracking-widest">Calculating Finances...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RevenueCard 
          title="Total Sales (Gross)" 
          value={`$${totalGross.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
          sub="Total items sold value" 
          icon={<DollarSign size={20} />} 
          color="border-black"
          trend="up"
        />
        <RevenueCard 
          title="Net Revenue" 
          value={`$${netRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
          sub="Ready for payout" 
          icon={<PieChart size={20} />} 
          color="border-[#f25a2b]"
          hasAction
        />
        <RevenueCard 
          title="Platform Fees" 
          value={`$${platformFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
          sub="10% Flat Rate" 
          icon={<Clock size={20} />} 
          color="border-gray-200"
        />
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-black uppercase text-xs tracking-[0.2em]">Transaction History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] text-gray-400 uppercase font-black tracking-[0.15em]">
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5">Gross Amount</th>
                <th className="px-8 py-5">Fee (10%)</th>
                <th className="px-8 py-5">Net Revenue</th>
                <th className="px-8 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => {
                const gross = order.totalAmount || 0;
                const fee = gross * 0.10;
                const net = gross - fee;

                return (
                  <tr key={order._id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-8 py-6 text-[11px] font-bold text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-xs uppercase">#{order._id.slice(-6)}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                        {order.customerId?.name || "Guest Customer"}
                      </p>
                    </td>
                    <td className="px-8 py-6 font-bold text-xs text-black">${gross.toFixed(2)}</td>
                    <td className="px-8 py-6 text-[11px] font-bold text-red-400">-${fee.toFixed(2)}</td>
                    <td className="px-8 py-6 font-black text-sm text-[#f25a2b]">${net.toFixed(2)}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-[#f25a2b]'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="p-20 text-center text-gray-400 uppercase font-black text-[10px] tracking-widest">
              No transactions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable Card Component for cleaner code
const RevenueCard = ({ title, value, sub, icon, color, trend, hasAction }) => (
  <div className={`bg-white p-8 rounded-[32px] shadow-sm border-t-8 ${color} transition-all hover:shadow-md`}>
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:text-black transition-colors">
        {icon}
      </div>
      {trend === 'up' && (
        <span className="flex items-center text-emerald-500 text-[10px] font-black uppercase">
          <ArrowUpCircle size={12} className="mr-1" /> Growth
        </span>
      )}
    </div>
    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">{title}</p>
    <h2 className="text-3xl font-black tracking-tighter mb-1">{value}</h2>
    <p className="text-[10px] font-bold text-gray-300 italic uppercase tracking-tighter">{sub}</p>
    
    {hasAction && (
      <button className="mt-6 w-full bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#f25a2b] transition-all">
        Request Payout
      </button>
    )}
  </div>
);

export default RevenueTracking;