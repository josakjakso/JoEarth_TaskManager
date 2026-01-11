import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8080'; 
const API_BASE_URL = import.meta.env.VITE_API_URL;

// ฟังก์ชันสำหรับ Sign In
export const signIn = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/testlogin`, {
            email,
            password,
        },
    {
        withCredentials: true, 
      });
        const { refresh_token } = response.data;
        localStorage.setItem('ref_token', refresh_token); // เก็บไว้ส่งใน Header
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to sign in');
    }
};

export const signInGuest = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/testlogin`, {
            "email": "guest@joeart.xyz",
            "password": "guestguest"
        },
    {
        withCredentials: true, 
      });
        const { refresh_token } = response.data;
        localStorage.setItem('ref_token', refresh_token); // เก็บไว้ส่งใน Header
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

export const signOut = async () => {
  try {
        const token = localStorage.getItem('ref_token');
        
        const response = await axios.post(`${API_BASE_URL}/signout`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        });
        return response;
    } catch (error) {
        console.error("Server-side revoke failed:", error);
    } finally {
        localStorage.removeItem('ref_token');
    }
};

export const googleOauth = () => {
    
    window.location.href = `${API_BASE_URL}/auth/google`;
};
