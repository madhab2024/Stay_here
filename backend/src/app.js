const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const adminRoutes = require('./routes/admin');
const errorHandler = require('./middlewares/error');

const app = express();

// Security & Utility Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
app.use('/properties', propertyRoutes);
app.use('/bookings', require('./routes/bookings'));
app.use('/rooms', require('./routes/roomUpdates')); // For /rooms/:id updates
app.use('/admin', adminRoutes);


// Global Error Handler
app.use(errorHandler);

module.exports = app;
