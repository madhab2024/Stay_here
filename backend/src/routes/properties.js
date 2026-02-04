const express = require('express');
const router = express.Router();
const { createProperty, getMyProperties, getPublicProperties } = require('../controllers/propertyController');
const { protect, authorize } = require('../middlewares/auth');

const roomRouter = require('./rooms');

// Re-route into other resource routers
router.use('/:propertyId/rooms', roomRouter);

// Public routes
router.get('/', getPublicProperties);

// Protected routes (Owner)
router.post('/', protect, authorize('owner'), createProperty);
router.get('/mine', protect, authorize('owner'), getMyProperties);

module.exports = router;
