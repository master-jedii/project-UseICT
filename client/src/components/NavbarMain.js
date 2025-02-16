import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import '../View/NavbarMain.css'; // ใช้ไฟล์ CSS แยก
import { jwtDecode } from 'jwt-decode';
import { io } from "socket.io-client";
import axios from '../service/axios';
import Swal from 'sweetalert2';

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
        // เรียงลำดับการแจ้งเตือนจากใหม่สุดไปเก่าสุด
        const sortedNotifications = response.data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        setNotifications(sortedNotifications);
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
        setNotifications(prevNotifications => {
          const updatedNotifications = [...prevNotifications, { ...data.borrowDetails, message: data.message }];
          return updatedNotifications.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        });
        setNewNotificationsCount(prevCount => prevCount + 1);
        setAlertMessage(data.message);
        setAlertClass('success');  // ประเภทการแจ้งเตือน (สำเร็จ)
        setIsAlertVisible(true);
        setTimeout(() => setIsAlertVisible(false), 5000);
      }
    });

    socket.on("borrowRejected", (data) => {
      if (data.userId === userData.id) {
        setNotifications(prevNotifications => {
          const updatedNotifications = [...prevNotifications, { ...data.borrowDetails, message: data.message }];
          return updatedNotifications.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        });
        setNewNotificationsCount(prevCount => prevCount + 1);
        setAlertMessage(data.message);
        setAlertClass('error');  // ประเภทการแจ้งเตือน (ข้อผิดพลาด)
        setIsAlertVisible(true);
        setTimeout(() => setIsAlertVisible(false), 5000);
      }
    });

    socket.on("borrowDeleted", (data) => {
      if (data.userId === userData.id) {
        setNotifications(prevNotifications => {
          const updatedNotifications = [...prevNotifications, { ...data.borrowDetails, message: data.message }];
          return updatedNotifications.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        });
        setNewNotificationsCount(prevCount => prevCount + 1);
        setAlertMessage(data.message);
        setAlertClass('warning');  // ประเภทการแจ้งเตือน (เตือนภัย)
        setIsAlertVisible(true);
        setTimeout(() => setIsAlertVisible(false), 5000);
      }
    });

    socket.on("borrowReturned", (data) => {
      // ตรวจสอบว่า userId ที่ได้รับจากข้อมูลตรงกับ user ที่กำลังใช้งาน
      if (data.userId === userData.id) {
        // เพิ่มการแจ้งเตือนใหม่ใน state
        setNotifications(prevNotifications => {
          const updatedNotifications = [...prevNotifications, { ...data.borrowDetails, message: data.message }];
          return updatedNotifications.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        });
    
        // เพิ่มจำนวนการแจ้งเตือนใหม่
        setNewNotificationsCount(prevCount => prevCount + 1);
    
        // ตั้งค่าข้อความแจ้งเตือน
        setAlertMessage(data.message);
        setAlertClass('success');  // กำหนดประเภทการแจ้งเตือนเป็น success (การคืนอุปกรณ์สำเร็จ)
        
        // แสดง alert
        setIsAlertVisible(true);
    
        // ซ่อน alert หลังจาก 5 วินาที
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

  const handleDeleteNotification = async (borrowId) => {
    const confirmResult = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: "การแจ้งเตือนนี้จะถูกลบถาวร!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก',
    });
  
    if (confirmResult.isConfirmed) {
      try {
        // ลบการแจ้งเตือน
        await axios.delete(`http://localhost:3333/api/notifications/${borrowId}`);
        setNotifications(prevNotifications =>
          prevNotifications.filter(notification => notification.borrow_id !== borrowId)
        );
        setNewNotificationsCount(prevCount => prevCount - 1);
  
        Swal.fire(
          'ลบสำเร็จ!',
          'การแจ้งเตือนถูกลบเรียบร้อย.',
          'success'
        );
      } catch (error) {
        console.error("Error deleting notification:", error);
        Swal.fire(
          'เกิดข้อผิดพลาด!',
          'ไม่สามารถลบการแจ้งเตือนได้.',
          'error'
        );
      }
    }
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

          <div className="notification-icon" style={{ position: 'relative', left: '5px', top: '5px' }}>
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
                notifications.map((notification, index) => {
                  console.log(notification);
                  const isLatest = index === 0;  // เช็คว่าเป็นข้อมูลล่าสุด

                  // ตรวจสอบค่า reject_reason
                  const rejectReasonMessage = notification.reject_reason === null
                    ? "รอดำเนินการ" // ถ้า reject_reason เป็น null ให้แสดง "รอดำเนินการ"
                    : notification.reject_reason; // ถ้ามี reject_reason แสดงค่าของมัน

                  return (
                    <li key={notification.borrow_id} className={isLatest ? 'new-notification' : ''}>
                      {isLatest && (
                        <span className="notification-icon">
                          <FontAwesomeIcon icon={faBell} style={{ marginRight: '8px', color: '#FF5722' }} />
                          <strong>แจ้งเตือนใหม่</strong>
                        </span>
                      )}
                      <p>สถานะ: {notification.status}</p>
                      <p>ชื่ออุปกรณ์: {notification.equipment_name}</p>
                      <p>รหัสอุปกรณ์: {notification.equipment_id}</p>
                      <p>อัพเดตเมื่อ: {new Date(notification.updated_at).toLocaleString('th-TH', { hour12: false })}</p>
                      <p>เหตุผล: {rejectReasonMessage}</p>  {/* แสดงเหตุผล ถ้า null ให้แสดงว่า รอดำเนินการ */}
                      <button
                        className="delete-notification-button"
                        onClick={() => handleDeleteNotification(notification.borrow_id)}
                      >
                        ลบ
                      </button>
                    </li>
                  );
                })
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