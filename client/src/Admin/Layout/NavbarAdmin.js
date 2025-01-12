import React from 'react';
import '../CSS/MainAdmin.css';
import myLogo from '../../assets/LOGO.png';
import '../CSS/NavbarAdmin.css';
import { Link } from 'react-router-dom';
import MainAdmin from './MainAdmin';


const NavbarAdmin = () => {
  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <div className="logo-container">
          <img src={myLogo} alt="SU Kits Logo" className="logo" />
          <h1 className="title">SU Kits</h1>
        </div>
        <ul className="menu">
          <li className="menu-item ">
            <i className="fa-solid fa-chart-simple"></i> 
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="menu-item active">
            <i className="fas fa-tools"></i> 
            <Link to="/mainadmin">รายการอุปกรณ์</Link>
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