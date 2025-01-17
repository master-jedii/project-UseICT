import React, { useState } from 'react'; // เพิ่ม useState
import '../CSS/MainAdmin.css';
import myLogo from '../../assets/LOGO.png';
import '../CSS/NavbarAdmin.css';
import { NavLink } from 'react-router-dom'; // ใช้ NavLink แทน Link
import { Link } from 'react-router-dom';

const NavbarAdmin = () => {
  const [showSubmenu, setShowSubmenu] = useState(false); // สถานะสำหรับควบคุมการแสดงหัวข้อย่อย

  const toggleSubmenu = () => {
    setShowSubmenu(!showSubmenu); // สลับสถานะ
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <div className="logo-container">
          <Link to="/main">
            <img src={myLogo} alt="SU Kits Logo" className="logo" />
          </Link>
          <h1 className="title"></h1>
        </div>
        <ul className="menu">
          <li className="menu-item">
            <i className="fa-solid fa-chart-simple"></i>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
            >
              Dashboard
            </NavLink>
          </li>
          <li className="menu-item">
            
            <div onClick={toggleSubmenu} className="submenu-toggle">
              <i className="fas fa-tools"></i>
              รายการอุปกรณ์
            </div>
            {showSubmenu && ( // แสดงหัวข้อย่อยเมื่อ showSubmenu เป็น true
              <ul className="submenu">
                <li className="submenu-item">
                  <NavLink to="/mainadmin" className="submenu-link">
                    รายการทั้งหมด
                  </NavLink>
                </li>
                <li className="submenu-item">
                  <NavLink to="/equipment/code" className="submenu-link">
                    รหัสอุปกรณ์
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          <li className="menu-item">
            <i className="fas fa-handshake"></i> สถานะการยืม
          </li>
          <li className="menu-item">
            <i className="fas fa-history"></i> กำหนดการคืน
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavbarAdmin;
