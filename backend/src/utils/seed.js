const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { User, Property, Room, Booking } = require('../models');

// Load env vars
dotenv.config();

// Simple config loader if env.js is complex, but here we just need the URI
// Adjust path to .env if running from root or src
// If passing via command line, this might be redundant but safe
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/stay_here';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('DB Connection Error:', err);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing data
        console.log('Clearing database...');
        await Booking.deleteMany({});
        await Room.deleteMany({});
        await Property.deleteMany({});
        await User.deleteMany({});

        // Create Users
        console.log('Creating users...');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);

        const admin = await User.create({
            email: 'admin@stayhere.com',
            passwordHash,
            roles: ['admin']
        });

        const owner = await User.create({
            email: 'owner@stayhere.com',
            passwordHash,
            roles: ['owner']
        });

        const customer = await User.create({
            email: 'customer@stayhere.com',
            passwordHash,
            roles: ['customer']
        });

        // Create Property
        console.log('Creating property...');
        const property = await Property.create({
            ownerId: owner._id,
            name: 'Seaside Paradise Villa',
            location: 'Malibu, California',
            description: 'A beautiful villa right on the beach with stunning sunset views.',
            policies: {
                checkInTime: '15:00',
                checkOutTime: '11:00',
                maxStay: 14
            },
            status: 'approved',
            amenities: ['Wifi', 'Pool', 'Parking', 'Beach Access'],
            rules: ['No smoking', 'No parties']
        });

        // Create Rooms
        console.log('Creating rooms...');
        const room1 = await Room.create({
            propertyId: property._id,
            type: 'Ocean View Suite',
            capacity: { adults: 2, children: 1, total: 3 },
            count: 5,
            basePrice: 350,
            amenities: ['King Bed', 'Balcony', 'Jacuzzi']
        });

        const room2 = await Room.create({
            propertyId: property._id,
            type: 'Standard Garden Room',
            capacity: { adults: 2, children: 0, total: 2 },
            count: 10,
            basePrice: 150,
            amenities: ['Queen Bed', 'Garden View']
        });

        console.log('Data Seeded Successfully!');
        console.log('-----------------------------------');
        console.log(`Admin: admin@stayhere.com`);
        console.log(`Owner: owner@stayhere.com`);
        console.log(`Customer: customer@stayhere.com`);
        console.log('Password for all: password123');
        console.log('-----------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedData();
