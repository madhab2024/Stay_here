const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);
router.get('/me', protect, authController.getCurrentUser);
router.put('/profile', protect, authController.updateProfile);

router.post('/become-host', 
    protect, 
    upload.fields([
        { name: 'profilePhoto', maxCount: 1 },
        { name: 'idFrontImage', maxCount: 1 },
        { name: 'idBackImage', maxCount: 1 },
        { name: 'selfieWithId', maxCount: 1 }
    ]),
    authController.becomeHost
);

router.get('/host-status', protect, authController.getHostStatus);

module.exports = router;
