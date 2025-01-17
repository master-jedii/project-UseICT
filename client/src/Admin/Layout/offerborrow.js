import NavbarAdmin from "./NavbarAdmin";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import '../CSS/adminStatus.css';
import Swal from 'sweetalert2'; // นำเข้า SweetAlert2

const AdminBorrowStatus = () => {
  const [borrowData, setBorrowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);  // เก็บข้อมูลที่กรองแล้ว
  const [loading, setLoading] = useState(true);  // สถานะการโหลด
  const [error, setError] = useState(null);  // เก็บข้อผิดพลาด
  const [searchUserID, setSearchUserID] = useState(""); // เก็บค่าที่กรอกเพื่อค้นหา UserID

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
        setFilteredData(response.data);  // เริ่มต้นแสดงข้อมูลทั้งหมด
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching all borrow data:", err);
        setError('Error fetching borrow data.');
        setLoading(false);
      });
  };

  // ฟังก์ชันสำหรับค้นหาข้อมูลตาม UserID
  const handleSearch = () => {
    if (isNaN(searchUserID) || searchUserID.trim() === "") {
      setError('กรุณากรอกหมายเลข UserID ที่ถูกต้อง');
      setFilteredData(borrowData);  // คืนค่ากลับเป็นข้อมูลทั้งหมด
      return;
    }

    const filtered = borrowData.filter(borrow => borrow.UserID.toString().includes(searchUserID));
    setFilteredData(filtered);
    setError(null);  // เคลียร์ข้อผิดพลาด
  };

  // ฟังก์ชันสำหรับเคลียร์การค้นหา
  const handleClearSearch = () => {
    setSearchUserID(""); // เคลียร์ช่องค้นหา
    setFilteredData(borrowData); // แสดงข้อมูลทั้งหมด
    setError(null);  // เคลียร์ข้อผิดพลาด
  };

  useEffect(() => {
    fetchAllBorrowData();
  }, []);

  return (
    <div>
      <div className="admin-dashboard">
        <NavbarAdmin />
        <div className="admin-status-container">
            <header className="admin-header-1">
              <div className="admin-header-info">
                <h1>รายการยืมทั้งหมด</h1>
              </div>
            </header>
            {/* ช่องกรอกค้นหาตาม UserID */}
            <div className="search-container">
              <input 
                className="Search-admin-2"
                type="number" 
                value={searchUserID}
                onChange={(e) => setSearchUserID(e.target.value)} // เก็บค่าที่กรอก
                placeholder="ค้นหาด้วยรหัสนักศึกษา"
              />
              <button className="Search-admin-1" onClick={handleSearch}>ค้นหา</button>
              <button  onClick={handleClearSearch}>เคลียร์</button>
        </div>

        {loading && <div>กำลังโหลดข้อมูล...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}

        {!loading && !error && (
          <table className="admin-status-table">
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>ผู้ใช้</th>
                <th>อุปกรณ์</th>
                <th>อุปกรณ์ ID</th>
                <th>วันที่ยืม</th>
                <th>วันที่คืน</th>
                <th>สถานะ</th>
                <th>เวลาส่งคำร้อง</th>
                <th>ดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((borrow) => (
                <tr key={borrow.borrow_id}>
                  <td>{borrow.borrow_id}</td>
                  <td>{borrow.UserID}</td>
                  <td>{borrow.equipment_name}</td>
                  <td>{borrow.equipment_id}</td>
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
    </div>
  );
};

export default AdminBorrowStatus;
