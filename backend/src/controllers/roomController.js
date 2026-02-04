const { Room, Property } = require('../models');

// @desc    Add a room to a property
// @route   POST /properties/:propertyId/rooms
// @access  Private (Owner)
exports.addRoom = async (req, res, next) => {
    try {
        const { type, count, price, capacity, amenities } = req.body;
        const { propertyId } = req.params;

        // Check property ownership
        const property = await Property.findOne({ _id: propertyId, ownerId: req.user.id });
        if (!property) {
            const error = new Error('Property not found or you do not have permission');
            error.statusCode = 404; // Obfuscate 403 sometimes, but 404 is cleaner here
            throw error;
        }

        const room = await Room.create({
            propertyId,
            type,
            count,
            basePrice: price, // Mapping frontend 'price' to backend 'basePrice'
            capacity: capacity || { adults: 2 },
            amenities
        });

        res.status(201).json({
            success: true,
            data: room
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all rooms for a property
// @route   GET /properties/:propertyId/rooms
// @access  Private (Owner) - or Public if needed, but this flow is for Owner management
exports.getRooms = async (req, res, next) => {
    try {
        const { propertyId } = req.params;
        
        // If owner, verify ownership strictly? Or just return rooms.
        // Assuming this endpoint is for ManageRooms page, likely protected for owner.
        // If public viewing, we use getPublicProperties which populates it.
        // Let's assume Owner context here for safety.
        
        const property = await Property.findById(propertyId);
        if(!property) return res.status(404).json({error: "Not found"});
        
        // If protecting:
        if (req.user.roles.includes('owner') && property.ownerId.toString() !== req.user.id) {
             // Allow admin maybe? For now strict owner.
             return res.status(403).json({error: "Not authorized"});
        }

        const rooms = await Room.find({ propertyId });

        res.status(200).json({
            success: true,
            count: rooms.length,
            data: rooms
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a room
// @route   PATCH /rooms/:roomId
// @access  Private (Owner)
exports.updateRoom = async (req, res, next) => {
    try {
        let room = await Room.findById(req.params.roomId);
        if (!room) {
            const error = new Error('Room not found');
            error.statusCode = 404;
            throw error;
        }

        // Verify ownership of the property this room belongs to
        const property = await Property.findById(room.propertyId);
        if (!property || property.ownerId.toString() !== req.user.id) {
             const error = new Error('Not authorized');
             error.statusCode = 403;
             throw error;
        }

        // Map frontend fields (price -> basePrice)
        const fieldsToUpdate = { ...req.body };
        if (req.body.price) fieldsToUpdate.basePrice = req.body.price;

        room = await Room.findByIdAndUpdate(req.params.roomId, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: room
        });
    } catch (error) {
        next(error);
    }
};
