const express = require('express');
const router = express.Router();
const { getAllPropertiesAdmin, approveProperty, rejectProperty } = require('../controllers/propertyController');
const { protect, authorize } = require('../middlewares/auth');

// All routes here are admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/properties', getAllPropertiesAdmin);
router.patch('/properties/:id/approve', approveProperty);
router.patch('/properties/:id/reject', rejectProperty);

module.exports = router;
