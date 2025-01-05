import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../CSS/MainAdmin.css';
import myLogo from '../../assets/LOGO.png';

const MainAdmin = () => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <div className="logo-container">
          <img src={myLogo} alt="SU Kits Logo" className="logo" />
          <h1 className="title">SU Kits</h1>
        </div>
        <ul className="menu">
          <li className="menu-item active">
            <i className="fas fa-tools"></i> รายการอุปกรณ์
          </li>
          <li className="menu-item">
            <i className="fas fa-handshake"></i> สถานะการยืม
          </li>
          <li className="menu-item">
            <i className="fas fa-history"></i> กำหนดการคืน
          </li>
        </ul>
      </div>
      <div className="main-content">
        <header className="admin-header">
          <div className="admin-header-info">
            <h1>Dashboard</h1>
          </div>
          <div className="admin-header-actions">
            <i className="fas fa-bell notification-icon"></i>
            <span className="user-name">Mos Kittipit</span>
          </div>
        </header>
        <div className="content-area">
          <button 
            className="add-equipment-btn" 
            onClick={() => navigate('/formaddequipment')} // Navigate to FormAddEquiment
          >
            ยืมอุปกรณ์
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainAdmin;
