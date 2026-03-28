const express = require('express');
const router = express.Router();
const { getAllPropertiesAdmin, approveProperty, rejectProperty } = require('../controllers/propertyController');
const { getAllHostApplications, getHostApplication, approveHostApplication, rejectHostApplication } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

// All routes here are admin only
router.use(protect);
router.use(authorize('admin'));

// Property routes
router.get('/properties', getAllPropertiesAdmin);
router.patch('/properties/:id/approve', approveProperty);
router.patch('/properties/:id/reject', rejectProperty);

// Host application routes
router.get('/host-applications', getAllHostApplications);
router.get('/host-applications/:id', getHostApplication);
router.patch('/host-applications/:id/approve', approveHostApplication);
router.patch('/host-applications/:id/reject', rejectHostApplication);

module.exports = router;
