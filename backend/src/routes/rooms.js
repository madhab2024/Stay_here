const express = require('express');
const router = express.Router({ mergeParams: true }); // Merge params to access :propertyId from parent router if nested
const { addRoom, getRooms, updateRoom } = require('../controllers/roomController');
const { protect, authorize } = require('../middlewares/auth');

// All room routes are protected
router.use(protect);

// Routes for /properties/:propertyId/rooms (mounted in properties.js usually, or here if standalone)
// The user asked to fully implement room management.
// The task says: GET /properties/:propertyId/rooms, POST /properties/:propertyId/rooms
// AND PATCH /rooms/:roomId.
// So we might need two router files or one flexible one.
// Let's keep it simple: 
// 1. We will mount this router at /properties/:propertyId/rooms for the first two.
// 2. We will mount this COPY or separate routes for /rooms/:roomId.

// Case 1: /properties/:propertyId/rooms
router.route('/')
    .get(authorize('owner'), getRooms)
    .post(authorize('owner'), addRoom);

module.exports = router;
