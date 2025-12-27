import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; 

export const addTask = async (title, description, assignedTo, startDate, dueDate, status, priority) => {
    let a = new Date(startDate).toISOString() ;
    let b = new Date(dueDate).toISOString() ;
    console.log('addTask called with:', { title, description, assignedTo,a , b });
    try {
        const response = await axios.post(`${API_BASE_URL}/testAddTask`, {
            title: title,
            description: description, 
            user_id: assignedTo, 
            status : status,
            priority : priority,
            start_date: startDate ? new Date(startDate).toISOString() : null, 
            due_date: dueDate ? new Date(dueDate).toISOString() : null,
        },
    {
        withCredentials: true, 
      });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message );
    }
};

export const getTasks = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/testTask`, {
        withCredentials: true, 
      });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    } 
};

