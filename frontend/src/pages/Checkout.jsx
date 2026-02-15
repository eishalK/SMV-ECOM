import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiShoppingBag } from "react-icons/fi";
import { getCart } from '../services/cartApi';
import { createOrder } from '../services/orderApi';
import { clearCart } from '../services/cartApi';
import { useDispatch } from 'react-redux';
import { setCart } from '../redux/cartSlice';

const Checkout = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const BACKEND_URL = "http://localhost:5000";

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    zipCode: '',
    shippingMethod: 'Delivery'
  });

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const data = await getCart();

        setItems(data.products || []);
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to load checkout items", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCheckoutData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const subTotal = items.reduce((acc, item) => {
    const price = item.productId?.price || 0;
    return acc + (price * item.quantity);
  }, 0);

  const shipping = 5.00;
  const discount = 10.00;
  const total = subTotal + shipping - discount;

  // Submit Order
  const handlePayNow = async (e) => {
    if (e) e.preventDefault();

    if (!formData.fullName || !formData.email) {
      toast.error("Please fill in the required shipping details.");
      return;
    }

    try {
      const orderData = {

        items: items.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price
        })),
        totalAmount: total,
        shippingAddress: formData
      };

      await createOrder(orderData);
      await clearCart();
      dispatch(setCart([]));

      toast.success("Order placed successfully!");
      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Error: " + (error.response?.data?.message || "Could not place order"));
    }
  };

  if (loading) return <div className="p-10 text-center uppercase tracking-widest">Loading...</div>;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <FiShoppingBag size={60} className="text-gray-200" />
        <h2 className="text-xl font-bold uppercase tracking-widest">Your cart is empty</h2>
        <Link to="/" className="bg-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#f25a2b]">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Shipping Information Form */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Checkout</h2>
            <form onSubmit={handlePayNow} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <label className="flex items-center gap-2 p-4 border rounded-md cursor-pointer">
                  <input type="radio" name="shippingMethod" value="Delivery" checked={formData.shippingMethod === 'Delivery'} onChange={handleChange} /> 🚚 Delivery
                </label>
              </div>

              <input name="fullName" value={formData.fullName} onChange={handleChange} type="text" placeholder="Full name *" className="w-full p-3 border rounded-md outline-none focus:ring-1 focus:ring-orange-500" required />
              <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email address *" className="w-full p-3 border rounded-md outline-none focus:ring-1 focus:ring-orange-500" required />
              <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="Phone number *" className="w-full p-3 border rounded-md outline-none focus:ring-1 focus:ring-orange-500" required />

              <div className="grid grid-cols-3 gap-4">
                <input name="city" value={formData.city} onChange={handleChange} type="text" placeholder="City" className="p-3 border rounded-md" />
                <input name="state" value={formData.state} onChange={handleChange} type="text" placeholder="State" className="p-3 border rounded-md" />
                <input name="zipCode" value={formData.zipCode} onChange={handleChange} type="text" placeholder="ZIP Code" className="p-3 border rounded-md" />
              </div>

              <button type="submit" className="hidden">Submit</button>
            </form>
          </div>

          {/* Review Your Cart */}
          <div className="bg-white p-8 rounded-lg shadow-sm h-fit">
            <h3 className="text-lg font-bold mb-6">Review your cart</h3>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div key={item.productId._id} className="flex gap-4">
                  <img
                    src={item.productId?.images?.length > 0 ? `${BACKEND_URL}${item.productId.images[0]}` : '/placeholder.png'}
                    alt={item.productId?.title}
                    className="w-16 h-16 object-contain bg-gray-100 rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold">{item.productId?.title}</p>
                    <p className="text-xs text-gray-500">{item.quantity}x</p>
                    <p className="text-sm font-bold">${Number(item.productId?.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>${subTotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-red-500"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-lg pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>

            <button
              onClick={handlePayNow}
              className="w-full bg-black text-white py-4 rounded-md font-bold mt-6 hover:bg-[#f25a2b] transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;