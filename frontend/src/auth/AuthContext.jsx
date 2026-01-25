import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Restore auth state from localStorage on load
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');

        if (storedUser && storedToken && storedRole) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            setRole(storedRole);
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

    if (loading) {
        return <div>Loading...</div>; // Simple loading state for now
    }

    return (
        <AuthContext.Provider value={{ user, token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
