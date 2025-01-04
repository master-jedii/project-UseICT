import React from 'react';
import '../View/NavbarMain.css'; // CSS จะปรับตามด้านล่าง
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';

const NavbarMain = ({ userData, onLogout }) => {
  return (
    <nav className="navbar navbar-light bg-white px-5">
      {/* ด้านซ้าย: โลโก้ */}
      <div className="d-flex align-items-center">
        <a className="navbar-brand" href="/">
          <img src="/logo.png" alt="SU Kits Logo" style={{ height: '105px' }} />
        </a>
      </div>
      {/* ตรงกลาง: ลิงก์ */}
      <div className="d-flex justify-content-center">
        <ul className="navbar-nav flex-row">
          <li className="nav-item mx-4">
            <a className="nav-link" href="#" style={{ fontSize: '20px' }}>
              รายการอุปกรณ์
            </a>
          </li>
          <li className="nav-item mx-4">
            <a className="nav-link" href="#" style={{ fontSize: '20px' }}>
              สถานะการยืม
            </a>
          </li>
          <li className="nav-item mx-4">
            <a className="nav-link" href="#" style={{ fontSize: '20px' }}>
              กำหนดการคืน
            </a>
          </li>
        </ul>
      </div>
      {/* ด้านขวา: การแจ้งเตือน, ชื่อผู้ใช้, Logout */}
      <div className="d-flex align-items-center">
        <div className="notification mx-3">
          <FontAwesomeIcon icon={faBell} />
          <span className="notification-badge">1</span>
        </div>
        <div className="user-info d-flex align-items-center mx-3">
          <FontAwesomeIcon icon={faUser} />
          <span className="mx-2" style={{ fontSize: '20px' }}>
            {userData?.name || 'Guest'}
          </span>
        </div>
        <button
          className="btn"
          style={{
            backgroundColor: '#009498',
            color: '#fff',
            border: 'none',
            height: '51px',
            width: '144px',
            borderRadius: '5px',
            fontSize: '20px',
            fontFamily: "'Sarabun', sans-serif"
          }}
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavbarMain;
