const User = require('../models/User');
const HostApplication = require('../models/HostApplication');

// @desc    Get all host applications
// @route   GET /admin/host-applications
// @access  Private/Admin
exports.getAllHostApplications = async (req, res, next) => {
    try {
        const { status } = req.query;
        
        const filter = {};
        if (status) {
            filter.status = status;
        }

        const applications = await HostApplication.find(filter)
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single host application
// @route   GET /admin/host-applications/:id
// @access  Private/Admin
exports.getHostApplication = async (req, res, next) => {
    try {
        const application = await HostApplication.findById(req.params.id)
            .populate('userId', 'name email phone roles');

        if (!application) {
            const error = new Error('Host application not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Approve host application
// @route   PATCH /admin/host-applications/:id/approve
// @access  Private/Admin
exports.approveHostApplication = async (req, res, next) => {
    try {
        const application = await HostApplication.findById(req.params.id);

        if (!application) {
            const error = new Error('Host application not found');
            error.statusCode = 404;
            throw error;
        }

        if (application.status === 'approved') {
            const error = new Error('Application already approved');
            error.statusCode = 400;
            throw error;
        }

        // Update application status
        application.status = 'approved';
        await application.save();

        // Upgrade user role to owner
        const user = await User.findById(application.userId);
        if (user && !user.roles.includes('owner')) {
            user.roles.push('owner');
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: 'Host application approved successfully',
            data: application
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reject host application
// @route   PATCH /admin/host-applications/:id/reject
// @access  Private/Admin
exports.rejectHostApplication = async (req, res, next) => {
    try {
        const { reason } = req.body;

        const application = await HostApplication.findById(req.params.id);

        if (!application) {
            const error = new Error('Host application not found');
            error.statusCode = 404;
            throw error;
        }

        if (application.status === 'rejected') {
            const error = new Error('Application already rejected');
            error.statusCode = 400;
            throw error;
        }

        // Update application status
        application.status = 'rejected';
        application.rejectionReason = reason || 'Not specified';
        await application.save();

        res.status(200).json({
            success: true,
            message: 'Host application rejected',
            data: application
        });
    } catch (error) {
        next(error);
    }
};
