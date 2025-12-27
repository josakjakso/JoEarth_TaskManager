// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // ฟังก์ชันเช็คสถานะจาก Backend
    const checkAuthStatus = async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    useEffect(() => {
        if (user) {
            console.log("User Data Updated from checkAuthStatus:", user);
        } else {
            console.log("No User Logged In from checkAuthStatus:");
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook เพื่อให้เรียกใช้ง่ายๆ
export const useAuth = () => useContext(AuthContext);