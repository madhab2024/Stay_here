export const initialOwnerFormState = {
    fullName: '',
    phone: '',
    email: '',
    address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    },
    verificationStatus: 'pending', // pending, verified, rejected
    documents: [], // Array to store verification documents
    profileImage: null
};

export const createOwnerFormState = (overrides = {}) => ({
    ...initialOwnerFormState,
    ...overrides
});
