import React from 'react';
import '../CSS/MainAdmin.css';
import myLogo from '../../assets/LOGO.png';
import '../CSS/NavbarAdmin.css';
import { NavLink } from 'react-router-dom';  // ใช้ NavLink แทน Link
import { Link } from 'react-router-dom';
import { useState } from 'react';

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
              className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'} // ใช้ isActive เพื่อตรวจสอบเส้นทาง
            >
              Dashboard
            </NavLink>
          </li>
          <li className={`menu-item ${showSubmenu ? 'active' : ''}`}>
            
            <div onClick={toggleSubmenu} className="submenu-toggle">
              <i className="fas fa-tools"></i>
              รายการอุปกรณ์
              <span
                className={`submenu-toggle-icon ${showSubmenu ? 'rotate' : ''}`}
              >
                ▼
              </span>
            </div>
            {showSubmenu && (
              <ul className={`submenu ${showSubmenu ? 'show' : ''}`}>
                <li className="submenu-item">
                  <NavLink to="/admin/equipment/type_id" className="submenu-link">
                    รหัสอุปกรณ์
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          <li className="menu-item">
            <i className="fa-solid fa-chart-simple"></i>
            <NavLink
              to="/offerBorrow"
              className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'} // ใช้ isActive เพื่อตรวจสอบเส้นทาง
            >
              สถานะการยืม
            </NavLink>
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
