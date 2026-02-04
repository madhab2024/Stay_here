const { Booking, Room, Property } = require('../models');

// @desc    Create a new booking
// @route   POST /bookings
// @access  Private (Customer)
exports.createBooking = async (req, res, next) => {
    try {
        const { propertyId, roomId, checkIn, checkOut } = req.body;

        // 1. Validate Date Inputs
        if (!checkIn || !checkOut) {
            const error = new Error('Please provide check-in and check-out dates');
            error.statusCode = 400;
            throw error;
        }

        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (start < today) {
            const error = new Error('Check-in date cannot be in the past');
            error.statusCode = 400;
            throw error;
        }

        if (end <= start) {
            const error = new Error('Check-out date must be after check-in date');
            error.statusCode = 400;
            throw error;
        }

        // 2. Validate Property and Room
        const property = await Property.findById(propertyId);
        if (!property) {
            const error = new Error('Property not found');
            error.statusCode = 404;
            throw error;
        }

        if (property.status !== 'approved') {
            const error = new Error('Property is not available for booking');
            error.statusCode = 400;
            throw error;
        }

        const room = await Room.findById(roomId);
        if (!room) {
            const error = new Error('Room not found');
            error.statusCode = 404;
            throw error;
        }

        if (room.propertyId.toString() !== propertyId) {
            const error = new Error('Room does not belong to the specified property');
            error.statusCode = 400;
            throw error;
        }

        // 3. Availability Logic
        // Calculate overlapping bookings for this specific room type
        const overlappingBookingsCount = await Booking.countDocuments({
            roomId: roomId,
            status: 'confirmed',
            $or: [
                {
                    // Existing booking overlaps with new dates
                    checkIn: { $lt: end },
                    checkOut: { $gt: start }
                }
            ]
        });

        if (overlappingBookingsCount >= room.count) {
            const error = new Error('No rooms available for the selected dates');
            error.statusCode = 409; // Conflict
            throw error;
        }

        // 4. Calculate Price (Simple logic for now: nights * basePrice)
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        const totalPrice = diffDays * room.basePrice;

        // 5. Create Booking
        const booking = await Booking.create({
            userId: req.user.id,
            propertyId,
            roomId,
            checkIn: start,
            checkOut: end,
            totalPrice,
            status: 'confirmed'
        });

        res.status(201).json({
            success: true,
            data: booking
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user's bookings
// @route   GET /bookings/mine
// @access  Private
exports.getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id })
            .populate({
                path: 'propertyId',
                select: 'name location description image' // Ensure image/description in Property model if needed
            })
            .populate({
                path: 'roomId',
                select: 'type basePrice'
            })
            .sort({ createdAt: -1 });

        // Transform response to match frontend expectations if necessary
        // or just return clean data. Use map if specific structure needed.
        const formattedBookings = bookings.map(b => ({
            id: b._id,
            propertyName: b.propertyId ? b.propertyId.name : 'Unknown Property',
            location: b.propertyId ? b.propertyId.location : 'Unknown Location',
            roomType: b.roomId ? b.roomId.type : 'Unknown Room',
            price: b.totalPrice,
            image: b.propertyId ? b.propertyId.image : null, // Add image field to Property model if missing
            dates: {
                checkIn: b.checkIn.toISOString().split('T')[0],
                checkOut: b.checkOut.toISOString().split('T')[0]
            },
            bookedAt: b.createdAt
        }));

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: formattedBookings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get bookings for properties owned by the user
// @route   GET /bookings/owner
// @access  Private (Owner)
exports.getOwnerBookings = async (req, res, next) => {
    try {
        // Find all properties owned by this user
        const properties = await Property.find({ ownerId: req.user.id }).select('_id');
        const propertyIds = properties.map(p => p._id);

        // Find bookings for these properties
        const bookings = await Booking.find({ propertyId: { $in: propertyIds } })
            .populate('userId', 'email') // Get customer info
            .populate('roomId', 'type')
            .populate('propertyId', 'name')
            .sort({ createdAt: -1 });

        // Group by property (optional, but requested "Overview")
        // The user asked for "Group by property" behavior in some way, 
        // but typically a flat list with property info is easier for basic tables.
        // We will return a flat list but include property details so frontend can group if needed.

        const formattedBookings = bookings.map(b => ({
            id: b._id,
            propertyName: b.propertyId ? b.propertyId.name : 'Unknown',
            customerEmail: b.userId ? b.userId.email : 'Unknown',
            roomType: b.roomId ? b.roomId.type : 'Unknown',
            price: b.totalPrice,
            dates: {
                checkIn: b.checkIn.toISOString().split('T')[0],
                checkOut: b.checkOut.toISOString().split('T')[0]
            },
            status: b.status,
            createdAt: b.createdAt
        }));

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: formattedBookings
        });

    } catch (error) {
        next(error);
    }
};
