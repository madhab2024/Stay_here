/**
 * Maps the owner form state to a clean Owner Profile domain object.
 * 
 * @param {Object} formState - The raw form state from the owner form.
 * @param {string|number} ownerId - The unique ID of the owner.
 * @returns {Object} The formatted Owner Profile object.
 */
export const mapOwnerFormToProfile = (formState, ownerId) => {
    // Pure function: creates a new object, does not mutate inputs
    return {
        ownerId: ownerId,
        fullName: formState.fullName ? formState.fullName.trim() : '',
        phone: formState.phone ? formState.phone.trim() : '',
        email: formState.email ? formState.email.trim() : '',
        address: {
            street: formState.address?.street?.trim() || '',
            city: formState.address?.city?.trim() || '',
            state: formState.address?.state?.trim() || '',
            zipCode: formState.address?.zipCode?.trim() || '',
            country: formState.address?.country?.trim() || ''
        },
        verificationStatus: formState.verificationStatus || 'pending',
        // Optional: Map other fields if needed in the future
        updatedAt: new Date().toISOString()
    };
};
