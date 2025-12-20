// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true, // สำคัญ: เพื่อให้ Browser ส่ง Cookie ไปกับ Request
});

export default api;