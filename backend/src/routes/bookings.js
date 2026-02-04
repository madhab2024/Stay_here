const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getOwnerBookings } = require('../controllers/bookingController');
const { protect, authorize } = require('../middlewares/auth');

// Protected routes (Login required)
router.use(protect);

router.post('/', createBooking);
router.get('/mine', getMyBookings);

// Owner routes
router.get('/owner', authorize('owner'), getOwnerBookings);

module.exports = router;
