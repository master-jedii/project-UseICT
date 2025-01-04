import axios from 'axios';

// ตั้งค่าพื้นฐานสำหรับ axios
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3333', // ตั้งค่า base URL ของ API
    headers: {
        'Content-Type': 'application/json', // กำหนด Content-Type สำหรับ JSON
    },
    timeout: 10000, // ตั้งเวลา timeout สำหรับการเชื่อมต่อ
});

// หากต้องการให้แน่ใจว่ามีการตรวจสอบ token ใน header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
