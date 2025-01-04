// Main.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/axios';
import NavbarMain from './NavbarMain'; // นำเข้า NavbarMain

const Main = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken'); // ตรวจสอบ token ที่เก็บใน localStorage
    if (!token) {
      navigate('/login'); // ถ้าไม่มี token ให้พาผู้ใช้ไปหน้า login
      return;
    }

    const fetchData = async () => {
        try {
          const token = localStorage.getItem('authToken');
      
          if (!token) {
            throw new Error("No token found");
          }
      
          const response = await api.get('/main', {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          console.log('Data from server:', response.data); // ตรวจสอบข้อมูลที่ได้รับจาก API
          setData(response.data);
        } catch (error) {
          console.error('Error fetching main data:', error);
          setError(error.response?.data?.message || error.message || 'Error fetching main data');
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
        <NavbarMain userData={data.user} onLogout={handleLogout} /> {/* ส่งฟังก์ชัน Logout */}
    </div>
  );
};

export default Main;
