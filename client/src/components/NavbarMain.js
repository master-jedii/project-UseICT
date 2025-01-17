import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import '../View/NavbarMain.css';
import { jwtDecode } from 'jwt-decode'; // ใช้ jwtDecode แทน jwt_decode

const NavbarMain = ({ userData, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/'); // เปลี่ยนเส้นทางไปยังหน้าแรก
  };

  const handleLogout = () => {
    onLogout(); // เรียกฟังก์ชัน Logout ที่ส่งมาจาก props
    navigate('/'); // เปลี่ยนเส้นทางไปยังหน้า Login
  };

  const handleAdminClick = () => {
      const token = localStorage.getItem('token'); // ดึง token จาก sessionStorage
      if (!token) {
        alert('กรุณาล็อกอินก่อน');
        return;
      }
      try {
        // ถอดรหัส token
        const decodedToken = jwtDecode(token); // ใช้ jwtDecode
        console.log('Decoded Token:', decodedToken);
    
        // ตรวจสอบ role จาก token
        const role = decodedToken.role || null;
    
        if (!role) {
          alert('ไม่พบข้อมูล role ใน token');
          return;
        }
    
        if (role === 'admin') {
          navigate('/admin'); // พาไปยังหน้า Admin
        } else {
          alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
        }
      } catch (error) {
        console.error('Token Decode Error:', error);
        alert('เกิดข้อผิดพลาดในการถอดรหัส token');
      }
    };

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

      
      {/* ปุ่มสำหรับไปหน้า Admin */}
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <button onClick={handleAdminClick} className="btn btn-primary">
          ไปที่หน้า Admin
        </button>
      </div>
      
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
