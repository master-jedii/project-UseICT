import NavbarMain from './NavbarMain';
import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import '../View/status.css';
import logo from '../assets/LOGO.png';
import Swal from "sweetalert2";

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
      Swal.fire({
        title: "ยกเลิกคำร้อง?",
        text: "ต้องการยกเลิกคำร้องขอนี้",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#009498",
        cancelButtonColor: "#ff5858",
        confirmButtonText: "ตกลง",
        cancelButtonText: " ยกเลิก",
      }).then((result) => {
        if (result.isConfirmed) {
          Axios.delete(`http://localhost:3333/api/borrow-status/${borrowId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((response) => {
              Swal.fire("ยกเลิกสำเร็จ!", "คำร้องขอถูกยกเลิกเรียบร้อยแล้ว", "success");
              setBorrowStatus((prev) => prev.filter((borrow) => borrow.borrow_id !== borrowId));
            })
            .catch((err) => {
              console.error("Error cancelling request:", err);
              Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถยกเลิกคำร้องขอได้ กรุณาลองใหม่อีกครั้ง", "error");
            });
        }
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
              margin: 0;
              line-height: 1.5;
              color: #333;
              font-size: 11pt;
            }
            /* กำหนดขนาดกระดาษเป็น A4 */
            @page {
              size: A4;
              margin: 15mm;
            }
            .header {
              text-align: center;
              margin-bottom: 10px;
              border-bottom: 2px solid #009498;
              padding-bottom: 5px;
            }
            .header img {
              max-width: 80px;
            }
            .header h1 {
              margin: 5px 0;
              font-size: 16pt;
              color: #009498;
              font-weight: 700;
            }
            .header p {
              font-size: 9pt;
              color: #555;
              margin-top: 5px;
            }
            .content {
              margin-top: 10mm;
              border: 1px solid #009498;
              padding: 8mm;
              border-radius: 8px;
              background-color: #f9f9f9;
              max-width: 100%;
              box-sizing: border-box;
            }
            .content h2 {
              font-size: 14pt;
              color: #000;
              margin-bottom: 10px;
              text-align: center;
              font-weight: 700;
            }
            /* เพิ่มการจัดเรียงหมวดหมู่ */
            .content .section {
              margin-bottom: 15px;
            }
            .content .section h3 {
              font-size: 12pt;
              color: #009498;
              font-weight: 700;
              margin-bottom: 5px; /* ลบขีดเส้นใต้ */
            }
            .content .section div {
              margin-bottom: 10px;
            }
            .content p {
              margin: 5px 0;
              font-size: 10pt;
              line-height: 1.5;
            }
            .content p strong {
              font-weight: 600;
            }
            /* เพิ่มสีเขียวให้กับคำว่า "อนุมัติ" */
            .approved-status {
              color: #28a745; /* สีเขียว */
              font-weight: bold;
            }
            .footer {
              text-align: center;
              font-size: 8pt;
              color: #555;
              border-top: 1px solid #ddd;
              padding-top: 8mm;
            }
            .footer p {
              margin: 5px 0;
            }
            .signature {
              margin-top: 40px;
              text-align: center;
            }
            .signature p {
              font-size: 10pt;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logo}" alt="Logo" />
            <h1>คณะเทคโนโลยีสารสนเทศและการสื่อสาร<br>มหาวิทยาลัยศิลปากร</h1>
            <p>สำนักงานคณะเทคโนโลยีสารสนเทศและการสื่อสาร | โทร: 09-1765-9890</p>
          </div>
          <div class="content">
            <h2>รายละเอียดคำร้องขอการยืมอุปกรณ์</h2>

            <!-- ข้อมูลส่วนตัว -->
            <div class="section">
              <h3>ข้อมูลส่วนตัว</h3>
              <p><strong>รหัสผู้ใช้:</strong> ${borrow.UserID}</p>
              <p><strong>ชื่อ-นามสกุล:</strong> ${borrow.firstname} ${borrow.lastname}</p>
              <p><strong>ชั้นปี:</strong> ${borrow.grade}</p>
              <p><strong>สาขาวิชา:</strong> ${borrow.branch}</p>
              <p><strong>อีเมล:</strong> ${borrow.email}</p>
               <p><strong>เบอร์โทรศัพท์:</strong> ${borrow.phone_number}</p>
            </div>

            <!-- รายละเอียดการยืมอุปกรณ์ -->
            <div class="section">
              <h3>รายละเอียดการยืมอุปกรณ์</h3>
              <p><strong>รหัสอุปกรณ์:</strong> ${borrow.equipment_id}</p>
              <p><strong>ชื่ออุปกรณ์ที่ยืม:</strong> ${borrow.equipment_name}</p>
              <p><strong>วัตถุประสงค์:</strong> ${borrow.objective}</p>
              <p><strong>สถานที่ใช้งาน:</strong> ${borrow.place}</p>
            </div>

            <!-- กำหนดการยืมคืน -->
            <div class="section">
              <h3>กำหนดการยืมคืน</h3>
              <p><strong>วันที่ยืม:</strong> ${new Date(borrow.borrow_date).toLocaleDateString("th-TH")}</p>
              <p><strong>วันที่ต้องการคืน:</strong> ${new Date(borrow.return_date).toLocaleDateString("th-TH")}</p>
              <p><strong>สถานะคำร้องขอ:</strong> <span class="approved-status">อนุมัติ</span></p> <!-- เปลี่ยนสีเป็นสีเขียว -->
            </div>

          </div>
          <div class="footer">
            <p>เอกสารนี้สร้างขึ้นโดยระบบเมื่อ ${new Date().toLocaleString("th-TH")}</p>
            <p>หากมีข้อสงสัย กรุณาติดต่อแผนกเทคโนโลยีสารสนเทศ</p>
          </div>
          <div class="signature">
            <p>__________________________</p>
            <p>ลายเซ็นผู้ยืม</p>
          </div>
        </body>
      </html>
    `;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(printContent);
    newWindow.document.close();

    // หน่วงเวลา 1 วินาทีให้ข้อมูลโหลดเสร็จก่อนการพิมพ์
    setTimeout(() => {
      newWindow.print();
    }, 1000);
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
                      <i className="fas fa-file-alt" style={{ marginRight: "8px" }}></i>
                      ปริ้นเอกสาร
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
