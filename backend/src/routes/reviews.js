const express = require('express');
const router = express.Router();
const { addReview, getPropertyReviews } = require('../controllers/reviewController');
const { protect } = require('../middlewares/auth');

router.get('/property/:propertyId', getPropertyReviews);

router.post('/', protect, addReview);

module.exports = router;
