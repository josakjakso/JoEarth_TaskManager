import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; 

// ฟังก์ชันสำหรับ Sign In
export const signIn = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/testlogin`, {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to sign in');
    }
};

export const signUp = async (email, password, name) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/testAddUser`, {
            email,
            password,
            name,
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to sign up');
    }
};