import { createContext, useContext, useState, useEffect } from 'react';
import { fetchPublicProperties } from '../api/propertyApi';

const PropertyContext = createContext(null);

export const PropertyProvider = ({ children }) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProperties = async () => {
            try {
                setLoading(true);
                const response = await fetchPublicProperties();
                // Map _id to id for frontend compatibility
                const mappedProperties = response.data.map(p => ({
                    ...p,
                    id: p._id // Ensure we have a string ID for URL routing
                }));
                setProperties(mappedProperties);
            } catch (err) {
                console.error("Failed to load properties:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadProperties();
    }, []);

    const addProperty = (property) => {
        // Optimistic update or refetch - for simplicity, we rely on refetching usually
        // but let's just append for now if needed (though Owner dashboard handles its own state)
        // Actually, this method was for the mock. We might not need it exposed here.
        // We'll keep it as a stub or minimal update if necessary.
        setProperties(prev => [...prev, property]);
    };

    const updatePropertyStatus = (id, newStatus) => {
        setProperties(prev => prev.map(p =>
            p.id === id ? { ...p, status: newStatus } : p
        ));
    };

    const updateProperty = (id, updatedFields) => {
        setProperties(prev => prev.map(p =>
            p.id === id ? { ...p, ...updatedFields } : p
        ));
    };

    return (
        <PropertyContext.Provider value={{
            properties,
            loading,
            error,
            addProperty,
            updatePropertyStatus,
            updateProperty
        }}>
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
