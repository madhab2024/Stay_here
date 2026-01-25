import { createContext, useContext, useState } from 'react';

const PropertyContext = createContext(null);

export const MOCK_PROPERTIES_DATA = [
    {
        id: 1,
        name: "Luxury Seaside Villa",
        location: "Malibu, California",
        price: 450,
        status: "Available",
        image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Experience the ultimate in seaside luxury with this stunning villa. Featuring panoramic ocean views, a private infinity pool, and direct beach access, this is the perfect getaway for those seeking relaxation and style. The interior boasts modern furnishings, a gourmet kitchen, and spacious living areas."
    },
    {
        id: 2,
        name: "Modern Mountain Retreat",
        location: "Aspen, Colorado",
        price: 320,
        status: "Available",
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Nestled in the heart of the Rockies, this modern retreat offers breathtaking mountain views and easy access to world-class skiing. Enjoy the cozy fireplace, hot tub, and sleek design. Perfect for winter sports enthusiasts and summer hikers alike."
    },
    {
        id: 3,
        name: "Urban Industrial Loft",
        location: "Brooklyn, New York",
        price: 210,
        status: "Available",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Immerse yourself in the vibrant city life with this stylish industrial loft in Brooklyn. Featuring high ceilings, exposed brick walls, and large windows, this space is a photographer's dream. Walk to trendy cafes, art galleries, and rooftop bars."
    },
    {
        id: 4,
        name: "Cozy Forest Cottage",
        location: "Portland, Oregon",
        price: 150,
        status: "Available",
        image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Escape to nature in this charming forest cottage. Surrounded by towering trees and lush greenery, it's a peaceful sanctuary for reading, writing, or simply unplugging. Features a wood-burning stove and a wraparound deck."
    },
    {
        id: 5,
        name: "Tropical Beach Bungalow",
        location: "Bali, Indonesia",
        price: 180,
        status: "Available",
        image: "https://images.unsplash.com/photo-1570213489059-0aac6626cade?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Wake up to the sound of waves in this authentic Balinese bungalow. Steps away from the white sandy beach, it offers a private garden, open-air bathroom, and traditional thatched roof. A true tropical paradise."
    },
    {
        id: 6,
        name: "Historic Downtown Apartment",
        location: "Prague, Czech Republic",
        price: 130,
        status: "Available",
        image: "https://images.unsplash.com/photo-1501183638710-841dd1904471?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Stay in the heart of history with this renovated apartment in Prague's Old Town. Walk to the Charles Bridge and Astronomical Clock. The apartment blends historic charm with modern amenities for a comfortable stay."
    }
];

export const PropertyProvider = ({ children }) => {
    const [properties, setProperties] = useState(MOCK_PROPERTIES_DATA);

    const addProperty = (property) => {
        console.log('PropertyContext: Adding property', property);
        setProperties(prev => {
            const updated = [...prev, property];
            console.log('PropertyContext: New properties list', updated);
            return updated;
        });
    };

    const updatePropertyStatus = (id, newStatus) => {
        setProperties(prev => prev.map(p =>
            p.id === id ? { ...p, status: newStatus } : p
        ));
    };

    return (
        <PropertyContext.Provider value={{ properties, addProperty, updatePropertyStatus }}>
            {children}
        </PropertyContext.Provider>
    );
};

export const useProperties = () => {
    const context = useContext(PropertyContext);
    if (!context) {
        throw new Error('useProperties must be used within a PropertyProvider');
    }
    return context;
};
