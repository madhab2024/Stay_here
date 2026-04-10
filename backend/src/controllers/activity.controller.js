const activityService = require('../services/activity.service');

/**
 * @desc    Record a new user activity
 * @route   POST /api/activity
 * @access  Private/Public (Depending on if userId is extracted from JWT or provided)
 */
exports.recordActivity = async (req, res) => {
    try {
        const activityData = {
            ...req.body,
            // If user is logged in, use their ID from req.user, otherwise from body
            userId: req.user?._id || req.body.userId,
            device: req.headers['user-agent'],
            timestamp: new Date()
        };

        // Basic validation
        if (!activityData.userId) {
            return res.status(400).json({
                success: false,
                message: 'userId is required'
            });
        }

        if (!activityData.actionType) {
            return res.status(400).json({
                success: false,
                message: 'actionType is required'
            });
        }

        const result = await activityService.trackActivity(activityData);

        if (result.skipped) {
            return res.status(200).json({
                success: true,
                message: `Activity processed but not stored: ${result.reason}`,
                data: null
            });
        }

        res.status(201).json({
            success: true,
            message: 'Activity tracked successfully',
            data: result.data
        });

    } catch (error) {
        console.error('Activity Tracking Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while tracking activity',
            error: error.message
        });
    }
};
