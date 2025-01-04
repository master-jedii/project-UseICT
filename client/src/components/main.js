import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/axios';

const Main = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login'); // ถ้าไม่มี token ให้พาผู้ใช้ไปหน้า login
            return;
        }

        const fetchData = async () => {
            try {
                const response = await api.get('/main', {
                    headers: { Authorization: `Bearer ${token}` },
                });
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
        console.log("Logging out...");
        localStorage.removeItem('authToken'); // ลบ token ออกจาก localStorage
        sessionStorage.removeItem('authToken'); // ลบ token ออกจาก sessionStorage
        console.log("localStorage and sessionStorage cleaned");
    
        // นำผู้ใช้กลับไปหน้า Login ทันที
        navigate('/login', { replace: true });
    };
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Main</h1>
            {data && data.user && <p>Welcome, {data.user.firstname}!</p>}

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Main;
