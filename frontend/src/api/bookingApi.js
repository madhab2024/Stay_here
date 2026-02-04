import client from './client';

export const createBooking = async (bookingData) => {
    const response = await client.post('/bookings', bookingData);
    return response.data;
};

export const fetchMyBookings = async () => {
    const response = await client.get('/bookings/mine');
    return response.data;
};

export const fetchOwnerBookings = async () => {
    const response = await client.get('/bookings/owner');
    return response.data;
};
