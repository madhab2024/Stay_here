const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
// Correct middleware path
const { protect } = require('../middlewares/auth');

/**
 * Route: POST /api/activity
 * Description: Track a user action
 * Note: Not strictly protecting it with 'protect' to allow tracking guest browsing,
 * but the controller will pick up user info if available.
 */
router.post('/', activityController.recordActivity);

module.exports = router;
