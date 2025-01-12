import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import '../View/NavbarMain.css';

const NavbarMain = ({ userData, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/'); // เปลี่ยนเส้นทางไปยังหน้าแรก
  };

  const handleLogout = () => {
    onLogout(); // เรียกฟังก์ชัน Logout ที่ส่งมาจาก props
    navigate('/'); // เปลี่ยนเส้นทางไปยังหน้า Login
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
            <Link to="/equipment"><p>รายการอุปกรณ์</p></Link>
            <Link to="/status"><p>สถานะการยืม</p></Link>
            <Link to="/return"><p>กำหนดการคืน</p></Link>
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
