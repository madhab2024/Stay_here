const express = require('express');
const router = express.Router();
const { updateRoom } = require('../controllers/roomController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);

router.patch('/:roomId', authorize('owner'), updateRoom);

module.exports = router;
