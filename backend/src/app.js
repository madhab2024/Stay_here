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

const corsOptions = {
    origin: true,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/customer', require('./routes/customer'));
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/rooms', require('./routes/roomUpdates'));
app.use('/api/admin', adminRoutes);


// Global Error Handler
app.use(errorHandler);

module.exports = app;
