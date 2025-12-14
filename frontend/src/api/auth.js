const API_BASE_URL = 'http://localhost:8080'; 

// ฟังก์ชันสำหรับ Sign In
export const signIn = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to sign in');
    }

    return response.json(); 
};


export const signUp = async (email, password , name) => {
    const response = await fetch(`${API_BASE_URL}/testAddUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to sign up');
    }

    return response.json(); 
};