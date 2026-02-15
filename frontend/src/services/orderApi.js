import API from './api';

export const getSellerOrders = async () => {
    const res = await API.get('/orders/seller');
    return res.data;
};

export const getCustomerOrders = async () => {
    const res = await API.get('/orders/customer');
    return res.data;
};

export const getOrderById = async (orderId) => {
    const res = await API.get(`/orders/${orderId}`);
    return res.data;
};

// Required for Checkout page
export const createOrder = async (orderData) => {
    const res = await API.post('/orders', orderData);
    return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
    // Admin only route
    const res = await API.put(`/orders/${orderId}`, { status });
    return res.data;
};