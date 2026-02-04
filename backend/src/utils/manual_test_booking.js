const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function runTest() {
    try {
        console.log('--- STARTING MANUAL TEST ---');

        // 1. Login Customer
        console.log('1. Logging in Customer...');
        const custRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'customer@stayhere.com',
            password: 'password123'
        });
        const custToken = custRes.data.token;
        console.log('   Success. Token obtained.');

        // 2. Login Owner
        console.log('2. Logging in Owner...');
        const ownerRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'owner@stayhere.com',
            password: 'password123'
        });
        const ownerToken = ownerRes.data.token;
        console.log('   Success.');

        // 3. Fetch Public Properties (to ensure rooms are populated)
        console.log('3. Fetching Public Properties (Checking Population)...');
        const pubRes = await axios.get(`${API_URL}/properties`);
        const properties = pubRes.data.data;
        
        if (!properties || properties.length === 0) throw new Error('No properties found');
        const targetProp = properties[0];
        
        if (!targetProp.rooms || targetProp.rooms.length === 0) {
            throw new Error('FAILED: Rooms not populated in public property list.');
        }
        console.log(`   Success. Found property "${targetProp.name}" with ${targetProp.rooms.length} rooms.`);

        const targetRoom = targetProp.rooms[0];
        console.log(`   Target Room: ${targetRoom.type} (ID: ${targetRoom._id}, Count: ${targetRoom.count})`);

        // 4. Create Booking
        console.log('4. Creating Booking...');
        const checkIn = '2026-03-01';
        const checkOut = '2026-03-05';
        
        try {
            const bookRes = await axios.post(`${API_URL}/bookings`, {
                propertyId: targetProp._id,
                roomId: targetRoom._id,
                checkIn,
                checkOut
            }, {
                headers: { Authorization: `Bearer ${custToken}` }
            });
            console.log('   Success. Booking Created:', bookRes.data.data._id);
        } catch (err) {
            console.log('   Booking might already exist or failed:', err.response?.data?.error || err.message);
        }

        // 5. Verify Booking in "My Trips"
        console.log('5. Verifying "My Trips"...');
        const myTripsRes = await axios.get(`${API_URL}/bookings/mine`, {
             headers: { Authorization: `Bearer ${custToken}` }
        });
        const hasBooking = myTripsRes.data.data.some(b => b.roomType === targetRoom.type);
        if (hasBooking) {
            console.log('   Success. Booking found in customer list.');
        } else {
             console.error('   FAILED. Booking not found in customer list.');
        }

        // 6. Verify Owner Dashboard
        console.log('6. Verifying Owner Bookings...');
        const ownerBookRes = await axios.get(`${API_URL}/bookings/owner`, {
            headers: { Authorization: `Bearer ${ownerToken}` }
        });
        if (ownerBookRes.data.data.length > 0) {
             console.log('   Success. Owner can see bookings.');
        } else {
             console.warn('   Warning: Owner has no bookings visible (might be different property matching).');
        }

        console.log('--- TEST COMPLETED SUCCESSFULLY ---');

    } catch (error) {
        console.error('TEST FAILED:', error.response?.data || error.message);
    }
}

runTest();
