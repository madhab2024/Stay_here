/**
 * Maps the room form state to a clean Room domain object.
 * 
 * @param {Object} formState - The raw form state from the room form.
 * @returns {Object} The formatted Room domain object.
 */
export const mapRoomFormToRoom = (formState) => {
    const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

    // Determine price logic: prefer basePrice, fallback to bookingOptions.pricePerNight
    const price = Number(formState.basePrice) || Number(formState.bookingOptions?.pricePerNight) || 0;

    return {
        id: generateId(),
        type: formState.type?.trim() || 'Standard Room',
        capacity: {
            adults: Number(formState.capacity?.adults) || 2,
            children: Number(formState.capacity?.children) || 0,
            total: Number(formState.capacity?.total) || 2
        },
        count: Number(formState.count) || 1,
        price: price,
        amenities: Array.isArray(formState.amenities) ? [...formState.amenities] : [],
        extraCharges: {
            extraBed: Number(formState.extraCharges?.extraBed) || 0,
            cleaningFee: Number(formState.extraCharges?.cleaningFee) || 0
        },
        // We can add description here if the domain model requires it, 
        // though the prompt task list specifically asked for id, type, capacity, count, price, amenities, extraCharges.
        // It's safe to include if present in form.
        description: formState.description?.trim() || ''
    };
};
