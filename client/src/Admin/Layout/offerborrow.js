import NavbarAdmin from "./NavbarAdmin";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import '../CSS/adminStatus.css';
import Swal from 'sweetalert2'; // นำเข้า SweetAlert2

const AdminBorrowStatus = () => {
  const [borrowData, setBorrowData] = useState([]);
  const [loading, setLoading] = useState(true);  // สถานะการโหลด
  const [error, setError] = useState(null);  // เก็บข้อผิดพลาด

  // ฟังก์ชันสำหรับการอนุมัติคำขอ
  const approveBorrowRequest = (borrowId) => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setError('Token not found. Please log in again.');
      return;
    }

    // ใช้ SweetAlert2 ให้ยืนยันการอนุมัติ
    Swal.fire({
      title: 'คุณต้องการอนุมัติคำขอนี้หรือไม่?',
      text: "เมื่อคุณอนุมัติแล้วจะไม่สามารถย้อนกลับได้",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'อนุมัติ',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.put(
          `http://localhost:3333/api/borrow/approve/${borrowId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then((response) => {
            Swal.fire({
              icon: 'success',
              title: 'คำขอได้รับการอนุมัติแล้ว!',
              text: 'คำขอนี้ได้รับการอนุมัติแล้ว',
            });

            // รีเฟรชข้อมูลหลังการอนุมัติ
            fetchAllBorrowData();  // ดึงข้อมูลใหม่จากเซิร์ฟเวอร์
          })
          .catch((err) => {
            console.error("Error approving borrow request:", err);
            setError('Error approving borrow request.');
          });
      }
    });
  };

  // ฟังก์ชันสำหรับการปฏิเสธคำขอ
  const rejectBorrowRequest = (borrowId) => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setError('Token not found. Please log in again.');
      return;
    }

    // ใช้ SweetAlert2 ให้ยืนยันการปฏิเสธ
    Swal.fire({
      title: 'คุณต้องการปฏิเสธคำขอนี้หรือไม่?',
      text: "คำขอนี้จะถูกปฏิเสธทันที",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ปฏิเสธ',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.put(
          `http://localhost:3333/api/borrow/reject/${borrowId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then((response) => {
            Swal.fire({
              icon: 'error',
              title: 'คำขอถูกปฏิเสธ',
              text: 'คำขอการยืมถูกปฏิเสธแล้ว',
            });

            // รีเฟรชข้อมูลหลังการปฏิเสธ
            fetchAllBorrowData();  // ดึงข้อมูลใหม่จากเซิร์ฟเวอร์
          })
          .catch((err) => {
            console.error("Error rejecting borrow request:", err);
            setError('Error rejecting borrow request.');
          });
      }
    });
  };

  // ฟังก์ชันสำหรับการลบคำขอออกจากระบบ
  const deleteBorrowRequest = (borrowId) => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setError('Token not found. Please log in again.');
      return;
    }

    // ใช้ SweetAlert2 ยืนยันการลบ
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: "คุณต้องการเปลี่ยนสถานะคำขอนี้เป็น 'ข้อเสนอถูกลบ' หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.put(
          `http://localhost:3333/api/borrow/delete/${borrowId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then((response) => {
            Swal.fire({
              icon: 'success',
              title: 'สถานะคำขอถูกเปลี่ยนแล้ว',
              text: 'คำขอได้รับการเปลี่ยนสถานะเป็น "ข้อเสนอถูกลบ"',
            });

            // รีเฟรชข้อมูลหลังการลบ
            fetchAllBorrowData();  // ดึงข้อมูลใหม่จากเซิร์ฟเวอร์
          })
          .catch((err) => {
            console.error("Error deleting borrow request:", err);
            setError('Error updating borrow request status.');
          });
      }
    });
  };

  // ฟังก์ชันดึงข้อมูลการยืมทั้งหมด
  const fetchAllBorrowData = () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setError('Token not found. Please log in again.');
      setLoading(false);
      return;
    }

    Axios.get("http://localhost:3333/api/borrow/all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        setBorrowData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching all borrow data:", err);
        setError('Error fetching borrow data.');
        setLoading(false);
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
        {loading && <div>กำลังโหลดข้อมูล...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}

        {!loading && !error && (
          <table className="admin-status-table">
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>ผู้ใช้</th>
                <th>อุปกรณ์</th>
                <th>อุปกรณ์ ID</th> {/* เพิ่มคอลัมน์นี้ */}
                <th>วันที่ยืม</th>
                <th>วันที่คืน</th>
                <th>สถานะ</th>
                <th>เวลาส่งคำร้อง</th>
                <th>ดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {borrowData.map((borrow) => (
                <tr key={borrow.borrow_id}>
                  <td>{borrow.borrow_id}</td>
                  <td>{borrow.UserID}</td>
                  <td>{borrow.equipment_name}</td>
                  <td>{borrow.equipment_id}</td> {/* เพิ่มการแสดง equipment_id */}
                  <td>{new Date(borrow.borrow_date).toLocaleDateString("th-TH")}</td>
                  <td>{new Date(borrow.return_date).toLocaleDateString("th-TH")}</td>
                  <td>{borrow.status}</td>
                  <td>{new Date(borrow.created_at).toLocaleString("th-TH", {
                    year: "numeric",   
                    month: "long",     
                    day: "numeric",    
                    hour: "numeric",   
                    minute: "numeric", 
                  })}</td>
                  <td>
                    <button 
                      onClick={() => approveBorrowRequest(borrow.borrow_id)} 
                      className="approve-button"
                      disabled={borrow.status === "อนุมัติแล้ว" || borrow.status === "ถูกปฏิเสธ"}
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => rejectBorrowRequest(borrow.borrow_id)} 
                      className="reject-button"
                      disabled={borrow.status === "ถูกปฏิเสธ"}
                    >
                      Reject
                    </button>
                    <button onClick={() => deleteBorrowRequest(borrow.borrow_id)} className="delete-button">
                      Delete
                    </button>
                  </td>
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
