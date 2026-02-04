export const initialRoomFormState = {
    type: '', // e.g., "Deluxe Suite", "Single Room"
    description: '',
    capacity: {
        adults: 2,
        children: 1,
        total: 3
    },
    count: 1, // Number of physical rooms of this type
    basePrice: 0,
    bookingOptions: {
        pricePerNight: 0,
        currency: 'USD'
    },
    amenities: [], // Room-specific amenities
    images: [],
    extraCharges: {
        extraBed: 0,
        cleaningFee: 0
    },
    availability: {
        isAvailable: true,
        blockedDates: []
    }
};

export const createRoomFormState = (overrides = {}) => ({
    ...initialRoomFormState,
    ...overrides
});
