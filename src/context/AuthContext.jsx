import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check token validity
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token && isTokenValid(token)) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    // Token validation function
    const isTokenValid = (token) => {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return false;
            const payload = JSON.parse(atob(parts[1]));
            return !(payload.exp && Date.now() >= payload.exp * 1000);
        } catch (error) {
            console.log(error)
            return false;
        }
    };

    // Login function
    const login = (token, role) => {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('role', role);
        setIsLoggedIn(true);
    };

    // Logout function
    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        localStorage.removeItem('cart');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);
