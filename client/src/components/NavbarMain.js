import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import '../View/NavbarMain.css';
import { jwtDecode } from 'jwt-decode';
import { io } from "socket.io-client";
import axios from '../service/axios'; // เพิ่ม axios สำหรับเรียก API

const NavbarMain = ({ userData, onLogout }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]); // เก็บข้อมูลการแจ้งเตือน
  const [isPopupOpen, setIsPopupOpen] = useState(false); // ใช้สำหรับเปิด/ปิด Modal
  const [newNotificationsCount, setNewNotificationsCount] = useState(0); // เก็บจำนวนการแจ้งเตือนใหม่
  
  const togglePopup = async () => {
    setIsPopupOpen(prevState => !prevState);
    if (!isPopupOpen) {
      try {
        // เรียก API ดึงข้อมูลการแจ้งเตือน
        const response = await axios.get('http://localhost:3333/api/notifications', { 
          params: { userId: userData.id } 
        });
        console.log('Fetched Notifications:', response.data); // ตรวจสอบข้อมูลที่ได้
        setNotifications(response.data); // อัปเดต State
        setNewNotificationsCount(0); // รีเซ็ตจำนวนการแจ้งเตือนใหม่เมื่อเปิด Modal
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
  };
  

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      query: { userId: userData?.id }
    });
    socket.on("borrowApproved", (notification) => {
      // ตรวจสอบว่า notification เป็นของผู้ใช้คนนี้หรือไม่
      if (notification.userId === userData.id) {
        setNotifications(prevNotifications => [...prevNotifications, notification]);
        setNewNotificationsCount(prevCount => prevCount + 1); // เพิ่มจำนวนการแจ้งเตือนใหม่
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userData]);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  let isAdmin = false;
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && decodedToken.exp > currentTime) {
        isAdmin = decodedToken.role === "admin";
      } else {
        console.warn("Token has expired");
      }
    }
  } catch (error) {
    console.error("Token Decode Error:", error);
  }

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

      <div className="navbar-right">
        <div className="user-info">
          <FontAwesomeIcon className='icon-user' icon={faUser} />
          <span>{userData?.firstname || 'Guest'}</span>

          {isAdmin && (
            <div style={{ textAlign: 'center', margin: '20px 0px' }}>
              <button onClick={() => navigate('/admin')} className="btn btn-primary-1">
                ไปที่หน้า Admin
              </button>
            </div>
          )}

          <div className="notification-icon" style={{ position: 'relative' }}>
            <FontAwesomeIcon 
              icon={faBell} 
              style={{ cursor: 'pointer', fontSize: '24px' }} 
              onClick={togglePopup} // เมื่อคลิกที่ไอคอนการแจ้งเตือน
            />
            {newNotificationsCount > 0 && (
              <div className="notification-count">
                {newNotificationsCount}
              </div>
            )}
          </div>

          <button className="logout-button" onClick={handleLogout}>
            ออกจากระบบ
          </button>
        </div>
      </div>

      {/* แสดง modal เมื่อ isPopupOpen เป็น true */}
      {isPopupOpen && (
        <div className="notification-popup">
          <div className="popup-content">
            <h2>การแจ้งเตือน</h2>
            <ul>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li key={notification.id}>
                    <p>สถานะ: {notification.status}</p>
                    <p>ชื่ออุปกรณ์: {notification.equipment_name}</p>
                    <p>รหัสอุปกรณ์: {notification.equipment_id}</p>
                    <p>{notification.message}</p> {/* ข้อความจาก server */}
                  </li>
                ))
              ) : (
                <li>ไม่มีการแจ้งเตือนใหม่</li>
              )}
            </ul>
            <button onClick={togglePopup} className="close-popup-button">
              ปิด
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarMain;
