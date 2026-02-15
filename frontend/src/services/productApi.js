import API from './api';

export const getProducts = async () => {
    const res = await API.get('/products');
    return res.data;
};

export const getProductById = async (id) => {
    const res = await API.get(`/products/${id}`);
    return res.data;
};

export const createProduct = async (productData) => {
    const res = await API.post('/products', productData);
    return res.data;
};

export const updateProduct = async (id, productData) => {
    const res = await API.put(`/products/${id}`, productData);
    return res.data;
};

export const deleteProduct = async (id) => {
    const res = await API.delete(`/products/${id}`);
    return res.data;
};