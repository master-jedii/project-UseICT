import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../CSS/MainAdmin.css';
import NavbarAdmin from './NavbarAdmin';

const MainAdmin = () => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <div>
      {/* ตรวจสอบว่า data.user มีข้อมูลหรือไม่ */}
      {data && data.user ? (
        <>
          <NavbarMain userData={data.user} onLogout={handleLogout} /> {/* ส่งฟังก์ชัน Logout */}
          <Type />
        </>
      ) : (
        <div>No user data available</div> // ถ้าไม่มีข้อมูลผู้ใช้แสดงข้อความนี้
      )}
      <NavbarAdmin />
    </div>
  );
};

export default MainAdmin;
