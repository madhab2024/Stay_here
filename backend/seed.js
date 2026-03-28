const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: __dirname + '/.env' });

const Property = require('./src/models/Property');
const Room = require('./src/models/Room');

const images = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ff2d6c411?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598928506311-c55dd1b3112e?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505691938895-1758d7bef511?w=800&auto=format&fit=crop"
];

const seedDB = async () => {
    // Exact official User ID provided by you
    const officialOwnerId = "69c6bd0360b2dc71e58c3b38";

    console.log(`Updating json file to fix image urls first...`);
    const dataPath = path.join(__dirname, '../data_prep/properties_import.json');
    if (!fs.existsSync(dataPath)) {
        console.error(`Cannot find the generated json file at ${dataPath}`);
        process.exit(1);
    }
    
    let rawPropertiesData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    // Rewrite the data to have different beautiful images
    rawPropertiesData.forEach((prop, index) => {
        prop.coverImage = images[index % images.length];
    });

    // Save back the modified data so the data file has the updated URLs
    fs.writeFileSync(dataPath, JSON.stringify(rawPropertiesData, null, 4));
    console.log(`✅ Updated images in properties_import.json`);

    try {
        console.log("Connecting to MongoDB Atlas...");
        const dbUri = process.env.MONGO_URI;
        if (!dbUri) throw new Error("MONGO_URI is missing in .env");
        
        await mongoose.connect(dbUri);
        
        console.log(`Assigning records to Official Owner ID: ${officialOwnerId}`);

        // Empty existing properties so we can cleanly "re-feed" it
        console.log("Deleting existing Property data...");
        await Property.deleteMany({});
        console.log("✅ Property collection cleared.");

        console.log("Deleting existing Room data...");
        await Room.deleteMany({});
        console.log("✅ Room collection cleared.");

        // Replace python's placeholder generic $oid with the verified real MongoDB User ID
        const propertiesData = rawPropertiesData.map(prop => {
            prop.ownerId = new mongoose.Types.ObjectId(officialOwnerId);
            return prop;
        });

        console.log(`Found ${propertiesData.length} formatted properties. Seeding into DB...`);
        const result = await Property.insertMany(propertiesData, { ordered: false });
        console.log(`✅ Successfully seeded ${result.length} properties!`);
        
        // --- Add Rooms to each Property ---
        console.log(`Generating rooms for all ${result.length} properties...`);
        const roomTypes = ["Standard Room", "Deluxe Room", "Suite", "Family Suite"];
        const roomsToInsert = [];

        for (const property of result) {
            // Give each property 2 to 4 random types of rooms
            const numRoomTypes = Math.floor(Math.random() * 3) + 2; 
            const selectedTypes = [...roomTypes].sort(() => 0.5 - Math.random()).slice(0, numRoomTypes);
            
            for (const type of selectedTypes) {
                let price, capacityAdults, count;
                
                if (type === "Standard Room") {
                    price = Math.floor(Math.random() * 1500) + 1500; // 1500 - 3000
                    capacityAdults = 2;
                    count = Math.floor(Math.random() * 10) + 5; // 5 - 14 rooms available
                } else if (type === "Deluxe Room") {
                    price = Math.floor(Math.random() * 2000) + 3000; // 3000 - 5000
                    capacityAdults = 2;
                    count = Math.floor(Math.random() * 6) + 3; // 3 - 8 rooms available
                } else if (type === "Suite") {
                    price = Math.floor(Math.random() * 3000) + 5000; // 5000 - 8000
                    capacityAdults = 2;
                    count = Math.floor(Math.random() * 3) + 1; // 1 - 3 rooms available
                } else { // Family Suite
                    price = Math.floor(Math.random() * 4000) + 7000; // 7000 - 11000
                    capacityAdults = 4;
                    count = Math.floor(Math.random() * 2) + 1; // 1 - 2 rooms available
                }
                
                roomsToInsert.push({
                    propertyId: property._id,
                    type: type,
                    capacity: {
                        adults: capacityAdults,
                        children: type === "Family Suite" ? 2 : Math.floor(Math.random() * 2), // 0-1 child or 2 for family
                        total: capacityAdults + (type === "Family Suite" ? 2 : 1)
                    },
                    count: count,
                    basePrice: price,
                    amenities: ["Free WiFi", "Air Conditioning", "TV", "Room Service"],
                    extraCharges: {
                        extraBed: Math.floor(Math.random() * 500) + 500,
                        cleaningFee: Math.floor(Math.random() * 200) + 100
                    }
                });
            }
        }
        
        console.log(`Prepared ${roomsToInsert.length} rooms to seed...`);
        const roomResult = await Room.insertMany(roomsToInsert, { ordered: false });
        console.log(`✅ Successfully seeded ${roomResult.length} rooms!`);

    } catch (err) {
        if (err.code === 11000) {
            console.log("Duplicate data found. Reseeding might have mixed results but mostly succeeded.");
        } else {
            console.error("Error seeding data:", err.message);
        }
    } finally {
        console.log("Closing connection...");
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        process.exit(0);
    }
};

seedDB();
