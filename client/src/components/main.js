// Main.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/axios';
import NavbarMain from './NavbarMain'; // นำเข้า NavbarMain
import DisplayEquipment from '../interface/DisplayEquipment';


const Main = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // ตรวจสอบ token ที่เก็บใน localStorage
    if (!token) {
      navigate('/login'); // ถ้าไม่มี token ให้พาผู้ใช้ไปหน้า login
      return;
    }

    const fetchData = async () => {
      try {
        const response = await api.get('/main', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log('Data from server:', response.data); // ตรวจสอบข้อมูลที่ได้รับจาก API

        if (response.data.user) {
          setData(response.data); // ถ้ามีข้อมูล user ให้ตั้งค่าที่ state
        } else {
          setError('User data not found');
        }
      } catch (error) {
        // console.error('Error fetching main data:', error);
        setError(error.response?.data?.message || error.message || 'Error fetching main data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem('token'); // ลบ token ออกจาก localStorage
    sessionStorage.removeItem('authToken'); // ลบ token ออกจาก sessionStorage
    localStorage.removeItem('notifications');
    console.log("localStorage and sessionStorage cleaned");

    // นำผู้ใช้กลับไปหน้า Login ทันที
    navigate('/login', { replace: true });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ backgroundColor: "#E3E6E6" }}>
      {/* ตรวจสอบว่า data.user มีข้อมูลหรือไม่ */}
      {data && data.user ? (
        <>
          <NavbarMain userData={data.user} onLogout={handleLogout} /> {/* ส่งฟังก์ชัน Logout */}
          
        </>
      ) : (
        <div>No user data available</div> // ถ้าไม่มีข้อมูลผู้ใช้แสดงข้อความนี้
      )}
      <DisplayEquipment />
    </div>
  );
};

export default Main;
