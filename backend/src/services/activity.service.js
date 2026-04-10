const UserActivity = require('../models/UserActivity');

/**
 * Service to handle user activity tracking logic
 */
const trackActivity = async (activityData) => {
    const { userId, actionType, hotelId, roomId, duration, searchQuery } = activityData;

    // 1. Filter: Ignore noisy "view" actions with duration < 5s
    if (actionType === 'view' && duration < 5) {
        return { skipped: true, reason: 'Noisy data: duration too short' };
    }

    // 2. Validation: If search, must have searchQuery
    if (actionType === 'search' && (!searchQuery || Object.keys(searchQuery).length === 0)) {
        throw new Error('searchQuery is required for search actions');
    }

    // 3. Dedup Logic: Prevent duplicate entries within a short time (e.g., 5 seconds)
    // We check if an identical action by the same user on the same object happened very recently
    const fiveSecondsAgo = new Date(Date.now() - 5000);
    const recentDuplicate = await UserActivity.findOne({
        userId,
        actionType,
        hotelId: hotelId || null,
        roomId: roomId || null,
        timestamp: { $gte: fiveSecondsAgo }
    });

    if (recentDuplicate) {
        return { skipped: true, reason: 'Duplicate action within 5 seconds' };
    }

    // 4. Create and save the activity
    const activity = await UserActivity.create(activityData);
    
    return { success: true, data: activity };
};

module.exports = {
    trackActivity
};
