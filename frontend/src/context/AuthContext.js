import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserProfile } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (isAuthenticated) {
                try {
                    const userData = await getUserProfile();
                    setUser(userData);
                } catch (error) {
                    console.error('Error loading user:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, [isAuthenticated]);

    const login = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        window.location.href = '/login';
    };

    const value = {
        isAuthenticated,
        user,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 