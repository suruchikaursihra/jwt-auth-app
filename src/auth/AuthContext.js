import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const isAuthenticated = !!token;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setAutoLogout(decodedToken.exp);
        }
    }, []);

    const login = (jwtToken) => {
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    }

    const isTokenExpired = (token) => {
        if (!token) return true;
        const { exp } = jwtDecode(token);
        console.log(exp)
        if (!exp) return true;
        return Date.now() >= exp * 1000;
    };

    const setAutoLogout = (exp) => {
        const expirationTime = exp * 1000 - Date.now();
        setTimeout(() => {
            logout();
        }, expirationTime);
    };


    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated, isTokenExpired }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext)