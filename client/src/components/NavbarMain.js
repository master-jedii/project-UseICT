import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import '../View/NavbarMain.css'; // ใช้ไฟล์ CSS แยก
import { jwtDecode } from 'jwt-decode';
import { io } from "socket.io-client";
import axios from '../service/axios';

const NavbarMain = ({ userData, onLogout }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertClass, setAlertClass] = useState(""); // สำหรับจัดการคลาส alert

  const togglePopup = async () => {
    setIsPopupOpen(prevState => !prevState);
    if (!isPopupOpen) {
      try {
        const response = await axios.get('http://localhost:3333/api/notifications', { 
          params: { userId: userData.id }
        });
        setNotifications(response.data);
        setNewNotificationsCount(0); 
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:5000", { query: { userId: userData?.id } });
  
    socket.on("borrowApproved", (data) => {
      if (data.userId === userData.id) {
        setNotifications(prevNotifications => [...prevNotifications, { ...data.borrowDetails, message: data.message }]);
        setNewNotificationsCount(prevCount => prevCount + 1);
        setAlertMessage(data.message);
        setAlertClass('success');  // ประเภทการแจ้งเตือน (สำเร็จ)
        setIsAlertVisible(true);
        setTimeout(() => setIsAlertVisible(false), 5000);
      }
    });

    socket.on("borrowRejected", (data) => {
      if (data.userId === userData.id) {
        setNotifications(prevNotifications => [...prevNotifications, { ...data.borrowDetails, message: data.message }]);
        setNewNotificationsCount(prevCount => prevCount + 1);
        setAlertMessage(data.message);
        setAlertClass('error');  // ประเภทการแจ้งเตือน (ข้อผิดพลาด)
        setIsAlertVisible(true);
        setTimeout(() => setIsAlertVisible(false), 5000);
      }
    });

    socket.on("borrowDeleted", (data) => {
      if (data.userId === userData.id) {
        setNotifications(prevNotifications => [...prevNotifications, { ...data.borrowDetails, message: data.message }]);
        setNewNotificationsCount(prevCount => prevCount + 1);
        setAlertMessage(data.message);
        setAlertClass('warning');  // ประเภทการแจ้งเตือน (เตือนภัย)
        setIsAlertVisible(true);
        setTimeout(() => setIsAlertVisible(false), 5000);
      }
    });
  
    return () => {
      socket.disconnect();
    };
  }, [userData]);

  const handleLogoClick = () => navigate('/');
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
              onClick={togglePopup} 
            />
            {newNotificationsCount > 0 && (
              <div className="notification-count">{newNotificationsCount}</div>
            )}
          </div>

          <button className="logout-button" onClick={handleLogout}>
            ออกจากระบบ
          </button>
        </div>
      </div>

      {/* แสดง alert เมื่อมีข้อความแจ้งเตือน */}
      {isAlertVisible && (
        <div className={`alert-box ${alertClass}`}>
          <p>{alertMessage}</p>
          <span className="closebtn" onClick={() => setIsAlertVisible(false)}>&times;</span>
        </div>
      )}

      {/* แสดง Modal ถ้าต้องการ */}
      {isPopupOpen && (
        <div className="notification-popup">
          <div className="popup-content">
            <h2>การแจ้งเตือน</h2>
            <ul>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li key={notification.borrow_id}>
                    <p>สถานะ: {notification.status}</p>
                    <p>ชื่ออุปกรณ์: {notification.equipment_name}</p>
                    <p>รหัสอุปกรณ์: {notification.equipment_id}</p>
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
