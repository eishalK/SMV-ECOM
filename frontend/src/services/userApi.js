import API from './api';

export const getAllUsers = async () => {
    const res = await API.get('/users');
    return res.data;
};

export const getUserById = async (userId) => {
    const res = await API.get(`/users/${userId}`);
    return res.data;
};

export const updateUserRole = async (userId, role) => {
    const res = await API.put(`/users/${userId}`, { role });
    return res.data;
};

export const deleteUser = async (userId) => {
    const res = await API.delete(`/users/${userId}`);
    return res.data;
};