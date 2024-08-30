import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a Context for the authentication state
const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps your app and makes auth object available
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        return storedAuth === 'true';
    });
    const [position, setPosition] = useState(() => localStorage.getItem('position'));

    const login = (id, userPosition) => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('id', id);
        console.log(position)
        localStorage.setItem('position', userPosition); // Store user position
        setPosition(userPosition);
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.setItem('isAuthenticated', 'false');
        localStorage.removeItem('id');
        localStorage.removeItem('position'); // Remove user position
        setPosition(null);
    };

    useEffect(() => {
        localStorage.setItem('isAuthenticated', isAuthenticated.toString());
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, position, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
