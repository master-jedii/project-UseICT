import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/axios';

const Dashboard = () => {
    const [data, setData] = useState(null); // เก็บข้อมูล JSON จาก API
    const [loading, setLoading] = useState(true); // สถานะการโหลด
    const [error, setError] = useState(null); // เก็บข้อผิดพลาด
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const response = await api.get('/main', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // เก็บข้อมูล JSON ที่ได้รับ
                setData(response.data);
            } catch (error) {
                setError(error.response?.data?.message || 'Error fetching main data');
                console.error('Error fetching main data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // ลบ token ออกจาก localStorage
        navigate('/login'); // นำผู้ใช้กลับไปที่หน้า Login
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>main</h1>
            {/* แสดงเฉพาะ firstname ของ user */}
            {data && data.user && <p>Welcome, {data.user.firstname}!</p>}

            {/* ปุ่ม Logout */}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
