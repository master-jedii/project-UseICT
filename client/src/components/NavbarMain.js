import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import '../View/NavbarMain.css';

const NavbarMain = ({ userData, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/'); // เปลี่ยนเส้นทางไปยังหน้าแรก
  };

  const handleLogout = () => {
    onLogout(); // เรียกฟังก์ชัน Logout ที่ส่งมาจาก props
    navigate('/login'); // เปลี่ยนเส้นทางไปยังหน้า Login
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
        <div className="navbar-links">
          <Link to="/equipment">รายการอุปกรณ์</Link>
          <Link to="/status">สถานะการยืม</Link>
          <Link to="/return">กำหนดการคืน</Link>
        </div>
      </div>
      <div className="navbar-right">
        <div className="notification">
          <FontAwesomeIcon icon={faBell} />
          {/* <span className="notification-badge">1</span> */}
        </div>
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
