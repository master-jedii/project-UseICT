import axios from 'axios';

// สร้าง instance ของ Axios
const api = axios.create({
    baseURL: 'http://localhost:3333', // URL หลักของ API
    timeout: 5000, // ตั้งเวลา Timeout (ms)
});

// เพิ่ม Interceptor เพื่อเพิ่ม Authorization Header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // ดึง token จาก localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
