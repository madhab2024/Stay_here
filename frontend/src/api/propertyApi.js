import client from './client';

export const createProperty = async (propertyData) => {
    const response = await client.post('/properties', propertyData);
    return response.data;
};

export const fetchPublicProperties = async () => {
    const response = await client.get('/properties');
    return response.data;
};

export const fetchOwnerProperties = async () => {
    const response = await client.get('/properties/mine');
    return response.data;
};

// Admin Functions
export const fetchAllPropertiesAdmin = async () => {
    const response = await client.get('/admin/properties');
    return response.data;
};

export const approveProperty = async (id) => {
    const response = await client.patch(`/admin/properties/${id}/approve`);
    return response.data;
};

export const rejectProperty = async (id) => {
    const response = await client.patch(`/admin/properties/${id}/reject`);
    return response.data;
};
