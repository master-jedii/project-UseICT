import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import '../View/NavbarMain.css';
import { jwtDecode } from 'jwt-decode';

const NavbarMain = ({ userData, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/'); // เปลี่ยนเส้นทางไปยังหน้าแรก
  };

  const handleLogout = () => {
    onLogout(); // เรียกฟังก์ชัน Logout ที่ส่งมาจาก props
    navigate('/'); // เปลี่ยนเส้นทางไปยังหน้า Login
  };

  // ตรวจสอบ role ของผู้ใช้
  let isAdmin = false;
  try {
    const token = localStorage.getItem('token'); // ดึง token จาก localStorage
    if (token) {
      const decodedToken = jwtDecode(token); // ถอดรหัส token
      isAdmin = decodedToken.role === 'admin'; // ตรวจสอบว่า role เป็น admin หรือไม่
    }
  } catch (error) {
    console.error('Token Decode Error:', error);
  }

  return (
    <nav className="navbar_main">
      <div className="navbar-left">
        <img
          src="/logo.png"
          alt="SU Kits Logo"
          className="logo"
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div className="navbar-links">
        <Link to="/main"><p>รายการอุปกรณ์</p></Link>
        <Link to="/status"><p>สถานะการยืม</p></Link>
        <Link to="/return"><p>กำหนดการคืน</p></Link>
      </div>

      {/* แสดงปุ่มสำหรับไปหน้า Admin เฉพาะผู้ใช้ที่มี role เป็น admin */}
      {isAdmin && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <button onClick={() => navigate('/admin')} className="btn btn-primary">
            ไปที่หน้า Admin
          </button>
        </div>
      )}

      <div className="navbar-right">
        <div className="user-info">
          <FontAwesomeIcon icon={faUser} />
          <span>{userData?.firstname || 'Guest'}</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarMain;
