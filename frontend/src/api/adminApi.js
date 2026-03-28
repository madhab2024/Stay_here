import api from '../services/api';

export const fetchAdminStats = () => {
    return api.get('/admin/stats');
};

export const fetchAllUsers = () => {
    return api.get('/admin/users');
};

export const fetchAllProperties = () => {
    return api.get('/admin/properties');
};

export const fetchHostApplications = (status = null) => {
    const params = status ? { status } : {};
    return api.get('/admin/host-applications', { params });
};

export const getHostApplication = (id) => {
    return api.get(`/admin/host-applications/${id}`);
};

export const approveHostApplication = (id) => {
    return api.patch(`/admin/host-applications/${id}/approve`);
};

export const rejectHostApplication = (id, reason) => {
    return api.patch(`/admin/host-applications/${id}/reject`, { reason });
};
