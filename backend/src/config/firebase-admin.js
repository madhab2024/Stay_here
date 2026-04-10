const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');

if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('[INFO] Firebase Admin initialized with service account');
} else {
    // Fallback for development if they use PROJECT_ID (limited functionality)
    admin.initializeApp({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID
    });
    console.warn('[WARN] Firebase Admin initialized WITHOUT service account. Token verification might fail.');
}

module.exports = admin;
