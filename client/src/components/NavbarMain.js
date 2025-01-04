import React from 'react';
import '../View/NavbarMain.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';

const NavbarMain = ({ userData, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/logo.png" alt="SU Kits Logo" className="logo" />
        <div className="navbar-links">
          <a href="/equipment">รายการอุปกรณ์</a>
          <a href="/status">สถานะการยืม</a>
          <a href="/return">กำหนดการคืน</a>
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
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarMain;
