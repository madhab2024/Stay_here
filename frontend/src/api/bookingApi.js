import api from '../services/api';

export const createBooking = async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
};

export const fetchMyBookings = async () => {
    const response = await api.get('/bookings/mine');
    return response.data;
};

export const fetchOwnerBookings = async () => {
    const response = await api.get('/bookings/owner');
    return response.data;
};
