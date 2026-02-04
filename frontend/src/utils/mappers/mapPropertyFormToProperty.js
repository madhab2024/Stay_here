/**
 * Maps the property form state to a clean Property domain object.
 * 
 * @param {Object} formState - The raw form state from the property form.
 * @param {string|number} ownerId - The ID of the owner creating the property.
 * @returns {Object} The formatted Property domain object.
 */
export const mapPropertyFormToProperty = (formState, ownerId) => {
    const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

    return {
        id: generateId(),
        ownerId: ownerId,
        name: formState.basicInfo?.name?.trim() || 'Untitled Property',
        location: formState.basicInfo?.location?.trim() || '',
        description: formState.basicInfo?.description?.trim() || '',
        // Flatten or structured policies
        policies: {
            checkInTime: formState.policies?.checkInTime || '14:00',
            checkOutTime: formState.policies?.checkOutTime || '11:00',
            cancellationPolicy: formState.policies?.cancellationPolicy || 'flexible',
            minStay: Number(formState.policies?.minStay) || 1,
            maxStay: Number(formState.policies?.maxStay) || 30
        },
        amenities: Array.isArray(formState.amenities) ? [...formState.amenities] : [],
        rules: Array.isArray(formState.rules) ? [...formState.rules] : [],
        
        // Status defaults to pending upon submission via this mapper
        status: 'pending',
        
        // Rooms are initialized as empty, to be populated by Room mappers later
        rooms: [],
        
        createdAt: new Date().toISOString()
    };
};
