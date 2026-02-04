import client from './client';

export const fetchRooms = async (propertyId) => {
    const response = await client.get(`/properties/${propertyId}/rooms`);
    return response.data;
};

export const addRoom = async (propertyId, roomData) => {
    const response = await client.post(`/properties/${propertyId}/rooms`, roomData);
    return response.data;
};

export const updateRoom = async (roomId, roomData) => {
    const response = await client.patch(`/rooms/${roomId}`, roomData);
    return response.data;
};
