import NavbarMain from './NavbarMain';
import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import '../View/status.css';

const Status = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [borrowStatus, setBorrowStatus] = useState([]);

  // ดึงข้อมูลผู้ใช้
  const fetchUser = () => {
    const token = localStorage.getItem("token");
    if (token) {
      Axios.get("http://localhost:3333/main", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          setUser(response.data.user);
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
          navigate("/login");
        });
    }
  };

  const fetchBorrowStatus = () => {
    const token = localStorage.getItem("token");
    if (token) {
      Axios.get("http://localhost:3333/api/borrow-status", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          setBorrowStatus(response.data); // เก็บข้อมูล borrow status
        })
        .catch((err) => {
          console.error("Error fetching borrow status:", err);
        });
    }
  };
  useEffect(() => {
    fetchUser(); // ดึงข้อมูลผู้ใช้
    fetchBorrowStatus(); // ดึงข้อมูลสถานะการยืม
  }, []); // เรียกทั้งสองฟังก์ชันเมื่อ Component เริ่มทำงาน

  // ฟังก์ชัน Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div>
      <NavbarMain userData={user} onLogout={handleLogout} />
      <div className="status-container-1">
        <h2 className="status-title-1">สถานะการยืม</h2>
        <table className="status-table-1">
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>อุปกรณ์</th>
              <th>วันที่ยืม</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {borrowStatus.map((borrow, index) => (
              <tr key={borrow.borrow_id}>
                <td>{index + 1}</td>
                <td>{borrow.equipment_name}</td>
                <td>{new Date(borrow.borrow_date).toLocaleDateString()}</td>
                <td>{borrow.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );  
};

export default Status;
