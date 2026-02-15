import API from './api';

export const getCategories = async () => {
    const res = await API.get('/categories');
    return res.data;
};

export const createCategory = async (name) => {
    const res = await API.post('/categories', { name });
    return res.data;
};

export const updateCategory = async (categoryId, name) => {
    const res = await API.put(`/categories/${categoryId}`, { name });
    return res.data;
};

export const deleteCategory = async (categoryId) => {
    const res = await API.delete(`/categories/${categoryId}`);
    return res.data;
};