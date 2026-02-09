import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore auth state from localStorage on initial load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');

        if (storedUser && storedToken && storedRole) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
                setRole(storedRole);
            } catch (error) {
                // Clear corrupted data
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('role');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, accessToken, userRole) => {
        setUser(userData);
        setToken(accessToken);
        setRole(userRole);

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', accessToken);
        localStorage.setItem('role', userRole);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setRole(null);

        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const upgradeToOwner = () => {
        const newRole = 'owner';
        setRole(newRole);
        localStorage.setItem('role', newRole);

        // Optionally update user object if roles are stored there too
        if (user && !user.roles?.includes('owner')) {
            const updatedUser = { ...user, roles: [...(user.roles || []), 'owner'] };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    if (loading) {
        return <div className="w-screen h-screen bg-white"></div>;
    }

    return (
        <AuthContext.Provider value={{ user, token, role, login, logout, updateUser, upgradeToOwner }}>
            {children}
        </AuthContext.Provider>
    );
};
