import React, { useState } from 'react';
import '../CSS/MainAdmin.css';
import myLogo from '../../assets/LOGO.png';
import '../CSS/NavbarAdmin.css';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';

const NavbarAdmin = () => {
  const [showSubmenu, setShowSubmenu] = useState(false);

  const toggleSubmenu = () => {
    setShowSubmenu(!showSubmenu);
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <div className="logo-container">
          <Link to="/main">
            <img src={myLogo} alt="SU Kits Logo" className="logo" />
          </Link>
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
          <li className={`menu-item ${showSubmenu ? 'active' : ''}`}>
            <div onClick={toggleSubmenu} className="submenu-toggle">
              <i className="fas fa-tools"></i>
              รายการอุปกรณ์
            </div>
            <ul className="submenu">
              <li className="submenu-item">
                <NavLink to="/mainadmin" className="submenu-link">
                  รายการทั้งหมด
                </NavLink>
              </li>
              <li className="submenu-item">
                <NavLink to="/admin/equipment/code" className="submenu-link">
                  รหัสอุปกรณ์
                </NavLink>
              </li>
            </ul>
          </li>
          <li className="menu-item">
            <i className="fas fa-handshake"></i>
            <NavLink
              to="/offerBorrow"
              className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
            >
              ข้อเสนอการยืม-คืน
            </NavLink>
          </li>
          <li className="menu-item">
            <i className="fas fa-history"></i>
            <NavLink
              to="/return-schedule"
              className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
            >
              กำหนดการคืน
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavbarAdmin;
