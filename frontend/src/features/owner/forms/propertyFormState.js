export const initialPropertyFormState = {
    basicInfo: {
        name: '',
        location: '', // Can be expanded to object later if needed (address, lat/long)
        description: '',
        category: '' // e.g., Villa, Apartment, Hotel
    },
    images: [],
    policies: {
        checkInTime: '14:00',
        checkOutTime: '11:00',
        cancellationPolicy: 'flexible', // flexible, moderate, strict
        minStay: 1,
        maxStay: 30
    },
    amenities: [], // List of amenity IDs or strings
    rules: [], // List of house rules
    status: 'draft' // draft, published, archived
};

export const createPropertyFormState = (overrides = {}) => ({
    ...initialPropertyFormState,
    ...overrides
});
