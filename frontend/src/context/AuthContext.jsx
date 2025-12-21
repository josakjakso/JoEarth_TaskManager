// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // ใช้เช็คว่ากำลังโหลดข้อมูลตอนเปิดเว็บไหม

    // ฟังก์ชันเช็คสถานะจาก Backend
    const checkAuthStatus = async () => {
        try {
            const response = await api.get('/auth/me'); // Backend ตรวจ Cookie ตรงนี้
            setUser(response.data); // เก็บข้อมูล user เช่น { id: 1, name: 'John' }

        } catch (error) {
            setUser(null); // ถ้า 401 หรือ Error แปลว่าไม่ได้ล็อกอิน
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus(); // ทำงานทันทีที่ App โหลดครั้งแรก (Refresh หน้าจอ)
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