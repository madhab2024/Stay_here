const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const adminRoutes = require('./routes/admin');
const reviewRoutes = require('./routes/reviews');
const activityRoutes = require('./routes/activity.routes');
const errorHandler = require('./middlewares/error');

const app = express();

// Set trust proxy for rate limiting (especially if behind a load balancer/reverse proxy)
app.set('trust proxy', 1);

// Security & Utility Middleware
app.use(helmet());

const corsOptions = {
    origin: true,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50kb' })); // Body limit to prevent large payload attacks
app.use(morgan('dev'));

// Express 5 compatibility fix for middlewares that modify req.query
app.use((req, res, next) => {
    Object.defineProperty(req, 'query', {
        value: { ...req.query },
        writable: true,
        configurable: true,
        enumerable: true,
    });
    next();
});

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Global Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100, // 100 requests per 10 mins per IP
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again in 10 minutes.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter Rate limiting for Authentication routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 30, // 30 attempts per 15 mins
    message: {
        success: false,
        message: 'Too many login or registration attempts, please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/customer', require('./routes/customer'));
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/rooms', require('./routes/roomUpdates'));
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/activity', activityRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
