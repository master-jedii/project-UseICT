import NavbarAdmin from "./NavbarAdmin";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import '../CSS/adminStatus.css';

const AdminBorrowStatus = () => {
  const [borrowData, setBorrowData] = useState([]);
  const [loading, setLoading] = useState(true);  // สถานะการโหลด
  const [error, setError] = useState(null);  // เก็บข้อผิดพลาด

  // ดึงข้อมูลการยืมทั้งหมด
  const fetchAllBorrowData = () => {
    const token = sessionStorage.getItem("authToken"); // ใช้ Token สำหรับ Admin จาก sessionStorage
    if (!token) {
      setError('Token not found. Please log in again.'); // แจ้งเตือนถ้าไม่พบ token
      setLoading(false);
      return;
    }
  
    // เรียก API เพื่อดึงข้อมูล borrow
    Axios.get("http://localhost:3333/api/borrow/all", {
      headers: { Authorization: `Bearer ${token}` }, // ส่ง token ไปใน header ของ request
    })
      .then((response) => {
        setBorrowData(response.data); // ตั้งค่าข้อมูลที่ได้จาก API
        setLoading(false); // ตั้งสถานะว่าโหลดเสร็จ
      })
      .catch((err) => {
        console.error("Error fetching all borrow data:", err); // แสดงข้อผิดพลาดในคอนโซล
        setError('Error fetching borrow data.'); // ตั้งค่าข้อความแสดงข้อผิดพลาด
        setLoading(false); // ตั้งสถานะว่าโหลดเสร็จ
      });
  };
  
  useEffect(() => {
    fetchAllBorrowData();
  }, []);

  return (
    <div>
      <NavbarAdmin />
      <div className="admin-status-container">
        <h2 className="admin-status-title">รายการการยืมทั้งหมด</h2>
        {loading && <div>กำลังโหลดข้อมูล...</div>}  {/* แสดงข้อความโหลดข้อมูล */}
        {error && <div style={{ color: 'red' }}>{error}</div>}  {/* แสดงข้อความข้อผิดพลาด */}

        {!loading && !error && (
          <table className="admin-status-table">
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>ผู้ใช้</th>
                <th>อุปกรณ์</th>
                <th>วันที่ยืม</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {borrowData.map((borrow) => (
                <tr key={borrow.borrow_id}>
                  <td>{borrow.borrow_id}</td>
                  <td>{borrow.UserID}</td>
                  <td>{borrow.equipment_name}</td>
                  <td>{new Date(borrow.borrow_date).toLocaleDateString()}</td>
                  <td>{borrow.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminBorrowStatus;
