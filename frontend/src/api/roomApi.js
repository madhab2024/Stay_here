import api from '../services/api';

export const fetchRooms = async (propertyId) => {
    const response = await api.get(`/properties/${propertyId}/rooms`);
    return response.data;
};

export const addRoom = async (propertyId, roomData) => {
    const response = await api.post(`/properties/${propertyId}/rooms`, roomData);
    return response.data;
};

export const updateRoom = async (roomId, roomData) => {
    const response = await api.patch(`/rooms/${roomId}`, roomData);
    return response.data;
};
