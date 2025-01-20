import NavbarMain from './NavbarMain';
import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import '../View/status.css';
import logo from '../assets/LOGO.png';

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

  const cancelRequest = (borrowId) => {
    const token = localStorage.getItem("token");
    if (token) {
      Axios.delete(`http://localhost:3333/api/borrow-status/${borrowId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          alert("คำร้องขอถูกยกเลิกเรียบร้อยแล้ว");
          setBorrowStatus((prev) => prev.filter((borrow) => borrow.borrow_id !== borrowId));
        })
        .catch((err) => {
          console.error("Error cancelling request:", err);
          alert("ไม่สามารถยกเลิกคำร้องขอได้ กรุณาลองใหม่อีกครั้ง");
        });
    }
  };

  const printRequest = (borrow) => {
    const printContent = `
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;700&display=swap');
            body {
              font-family: 'Prompt', sans-serif;
              margin: 20px;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header img {
              max-width: 100px;
            }
            .header h1 {
              margin: 10px 0;
              font-size: 24px;
            }
            .content {
              border: 1px solid #ddd;
              padding: 20px;
              border-radius: 8px;
              background-color: #f9f9f9;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              font-size: 12px;
              color: #555;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logo}" alt="Logo" />
            <h1>ระบบยืมอุปกรณ์</h1>
            <p>บริษัท ABC จำกัด | โทร: 02-123-4567 | อีเมล: info@abc.com</p>
          </div>
          <div class="content">
            <h2>ข้อมูลคำร้องขอ</h2>
            <p><strong>ชื่ออุปกรณ์:</strong> ${borrow.equipment_name}</p>
            <p><strong>รหัสอุปกรณ์:</strong> ${borrow.equipment_id}</p>
            <p><strong>วันที่ยืม:</strong> ${new Date(borrow.borrow_date).toLocaleDateString("th-TH")}</p>
            <p><strong>วันที่คืน:</strong> ${new Date(borrow.return_date).toLocaleDateString("th-TH")}</p>
            <p><strong>สถานะ:</strong> ${borrow.status}</p>
          </div>
          <div class="footer">
            <p>เอกสารนี้สร้างขึ้นโดยระบบเมื่อ ${new Date().toLocaleString("th-TH")}</p>
          </div>
        </body>
      </html>
    `;
  
    const newWindow = window.open("", "_blank");
    newWindow.document.write(printContent);
    newWindow.document.close();
    newWindow.print();
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
              <th>รหัสอุปกรณ์</th> {/* เพิ่มคอลัมน์รหัสอุปกรณ์ */}
              <th>วันที่ยืม</th>
              <th>วันที่คืน</th>
              <th>เวลาส่งคำร้อง</th>
              <th>สถานะ</th>
              <th>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {borrowStatus.map((borrow, index) => (
              <tr key={borrow.borrow_id}>
                <td>{index + 1}</td>
                <td>{borrow.equipment_name}</td>
                <td>{borrow.equipment_id}</td> {/* แสดงรหัสอุปกรณ์ */}
                <td>{new Date(borrow.borrow_date).toLocaleDateString("th-TH")}</td>
                <td>{new Date(borrow.return_date).toLocaleDateString("th-TH")}</td>
                <td>{new Date(borrow.created_at).toLocaleString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}</td>
                <td
                  className={
                    borrow.status === "อนุมัติ"
                      ? "status-approved"
                      : borrow.status === "รอดำเนินการ"
                        ? "status-pending"
                        : borrow.status === "ปฏิเสธ"
                          ? "status-rejected"
                          : borrow.status === "ข้อเสนอถูกลบ"
                            ? "status-deleted"
                            : ""
                  }
                >
                  {borrow.status}
                </td>

                <td>
                  {(borrow.status === "รอดำเนินการ" || borrow.status === "ข้อเสนอถูกลบ" || borrow.status === "ปฏิเสธ") && (
                    <button
                      className="cancel-button-status"
                      onClick={() => cancelRequest(borrow.borrow_id)}
                    >
                      ยกเลิกคำร้องขอ
                    </button>
                  )}

                  {borrow.status === "อนุมัติ" && (
                    <button
                      className="print-button-status"
                      onClick={() => printRequest(borrow)}
                    >
                      ปริ้นข้อมูล
                    </button>
                  )}

                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Status;
