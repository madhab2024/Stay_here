const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function testBookingFlow() {
    try {
        console.log('=== Starting Booking System Test ===');

        // 1. Login as Customer
        console.log('\n1. Logging in as customer...');
        const customerRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'customer@stayhere.com',
            password: 'password123'
        });
        const customerToken = customerRes.data.token;
        console.log('Customer logged in. Token acquired.');

        // 2. Login as Owner to get Property ID
        console.log('\n2. Logging in as owner...');
        const ownerRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'owner@stayhere.com',
            password: 'password123'
        });
        const ownerToken = ownerRes.data.token;
        
        // 3. Get Owner Properties
        console.log('\n3. Fetching owner properties...');
        const propsRes = await axios.get(`${API_URL}/properties/mine`, {
            headers: { Authorization: `Bearer ${ownerToken}` }
        });
        
        if (propsRes.data.data.length === 0) {
            throw new Error('No properties found for owner. Run seed script properly.');
        }

        const propertyId = propsRes.data.data[0]._id; // Accessing by _id is standard for internal logic
        console.log(`Found Property: ${propsRes.data.data[0].name} (ID: ${propertyId})`);

        // 4. Get a Room from Property (Mocking this step as endpoints mock data or I need to fetch public prop)
        // Better to fetch public property details to get room ID
        const publicPropRes = await axios.get(`${API_URL}/properties`, {
             headers: { Authorization: `Bearer ${customerToken}` } // Optional
        });
        
        // Find the mathcing property
        const targetProp = publicPropRes.data.data.find(p => p._id === propertyId);
        // Note: In current implementation, rooms are in a separate collection, we need to find them.
        // There isn't a direct "get rooms for property" public endpoint documented in my previous turn,
        // but PropertyDetails.jsx uses one? No, it uses `property.rooms`.
        // Wait, the seed script created rooms. The property model I saw earlier *didn't* have rooms array in schema (it had virtual comment).
        // Let's check how `getPublicProperties` populates rooms. It likely doesn't yet!
        // CHECKPOINT: If `getPublicProperties` doesn't return rooms, frontend can't book.
        
        // Let's assumes we need to fetch rooms. I'll use a direct cheat for the test or fix the controller.
        // Let's look at `propertyController.js` again. Use `view_file` to check `getPublicProperties`.
        
    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

// Actually, I can't run axios script easily if the server isn't running.
// I should rely on the `run_command` tool to run the server in background?
// Or I can write a script that imports `app` and `supertest`. That's better.
