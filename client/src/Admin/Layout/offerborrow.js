import NavbarAdmin from "./NavbarAdmin";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import '../CSS/adminStatus.css';
import Swal from 'sweetalert2'; // นำเข้า SweetAlert2

const AdminBorrowStatus = () => {
  const [borrowData, setBorrowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // เก็บข้อมูลที่กรองแล้ว
  const [loading, setLoading] = useState(true); // สถานะการโหลด
  const [error, setError] = useState(null); // เก็บข้อผิดพลาด
  const [searchUserID, setSearchUserID] = useState(""); // เก็บค่าที่กรอกเพื่อค้นหา UserID

  // Pagination
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบัน
  const itemsPerPage = 10; // จำนวนรายการต่อหน้า

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // ฟังก์ชันสำหรับการอนุมัติคำขอ
  const approveBorrowRequest = (borrowId) => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setError('Token not found. Please log in again.');
      return;
    }

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
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'คำขอได้รับการอนุมัติแล้ว!',
              text: 'คำขอนี้ได้รับการอนุมัติแล้ว',
            });
            fetchAllBorrowData();
          })
          .catch(() => setError('Error approving borrow request.'));
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
  
    // เปิด SweetAlert2 พร้อมช่องกรอกเหตุผล
    Swal.fire({
      title: 'คุณต้องการปฏิเสธคำขอนี้หรือไม่?',
      input: 'textarea', // ใช้ textarea เพื่อให้กรอกข้อความ
      inputPlaceholder: 'กรุณากรอกเหตุผลที่ปฏิเสธ...',
      inputAttributes: {
        'aria-label': 'เหตุผลในการปฏิเสธ', // เพิ่ม Accessibility
      },
      showCancelButton: true,
      confirmButtonText: 'ปฏิเสธ',
      cancelButtonText: 'ยกเลิก',
      preConfirm: (reason) => {
        if (!reason || reason.trim() === '') {
          // ถ้าไม่ได้กรอกเหตุผล จะแสดงข้อความเตือน
          Swal.showValidationMessage('กรุณากรอกเหตุผลในการปฏิเสธ');
          return false;
        }
        return reason; // ส่งค่าเหตุผลกลับมา
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // ถ้ามีการยืนยัน ส่งคำขอไปยัง API พร้อมเหตุผล
        Axios.put(
          `http://localhost:3333/api/borrow/reject/${borrowId}`,
          { reason: result.value }, // ส่งเหตุผลใน body
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'คำขอถูกปฏิเสธ',
              text: 'คำขอการยืมถูกปฏิเสธพร้อมเหตุผล',
            });
            fetchAllBorrowData(); // อัปเดตข้อมูลหลังการปฏิเสธ
          })
          .catch(() => setError('Error rejecting borrow request.'));
      }
    });
  };


  const deleteBorrowRequest = (borrowId) => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setError('Token not found. Please log in again.');
      return;
    }
  
    // เปิด SweetAlert2 พร้อมช่องกรอกเหตุผล
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: "คุณต้องการลบคำขอนี้หรือไม่? กรุณากรอกเหตุผล",
      input: 'textarea', // ใช้ textarea เพื่อให้กรอกข้อความ
      inputPlaceholder: 'กรุณากรอกเหตุผลในการลบ...',
      inputAttributes: {
        'aria-label': 'เหตุผลในการลบคำขอ',
      },
      showCancelButton: true,
      confirmButtonText: 'ลบคำขอ',
      cancelButtonText: 'ยกเลิก',
      preConfirm: (reason) => {
        if (!reason || reason.trim() === '') {
          // ถ้าไม่ได้กรอกเหตุผล จะแสดงข้อความเตือน
          Swal.showValidationMessage('กรุณากรอกเหตุผลในการลบคำขอ');
          return false;
        }
        return reason; // ส่งค่าเหตุผลกลับมา
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // ถ้ามีการยืนยัน ส่งคำขอไปยัง API พร้อมเหตุผล
        Axios.put(
          `http://localhost:3333/api/borrow/delete/${borrowId}`,
          { deleteReason: result.value }, // ส่งเหตุผลในการลบคำขอ
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'คำขอถูกลบ',
              text: 'คำขอการยืมถูกลบพร้อมเหตุผล',
            });
            fetchAllBorrowData(); // อัปเดตข้อมูลหลังการลบคำขอ
          })
          .catch(() => setError('Error deleting borrow request.'));
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
        setFilteredData(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching borrow data.');
        setLoading(false);
      });
  };

  // ฟังก์ชันค้นหาด้วย UserID
  const handleSearch = () => {
    if (isNaN(searchUserID) || searchUserID.trim() === "") {
      setError('กรุณากรอกหมายเลข UserID ที่ถูกต้อง');
      setFilteredData(borrowData);
      return;
    }
    const filtered = borrowData.filter(borrow => borrow.UserID.toString().includes(searchUserID));
    setFilteredData(filtered);
    setError(null);
  };

  const handleClearSearch = () => {
    setSearchUserID("");
    setFilteredData(borrowData);
    setError(null);
  };

  const handleFilterStatus = (status) => {
    if (status === "ทั้งหมด") {
      setFilteredData(borrowData);
    } else {
      const filtered = borrowData.filter(borrow => borrow.status === status);
      setFilteredData(filtered);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination-container">
        {pageNumbers.map((number) => (
          <button
            key={number}
            className={`pagination-button ${currentPage === number ? "active" : ""}`}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };

  useEffect(() => {
    fetchAllBorrowData();
  }, []);

  return (
    <div>
      <div className="admin-dashboard">
        <NavbarAdmin />
        <div className="admin-dashboard-typeid">
          <header className="admin-header-info-typeid">
            <div className="admin-header-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-handshake" style={{ fontSize: '20px' }}></i>
              <h1 style={{ textAlign: 'left' }}>รายการยืมทั้งหมด</h1>
            </div>
          </header>
          <div className="search-container">
            <input
              className="Search-admin-2"
              type="number"
              value={searchUserID}
              onChange={(e) => setSearchUserID(e.target.value)}
              placeholder="ค้นหาด้วยรหัสนักศึกษา"
            />
            <button className="Search-admin-1" onClick={handleSearch}>ค้นหา</button>
            <button onClick={handleClearSearch}>เคลียร์</button>
          </div>
          <div className="filter-buttons-container-status">
            <button onClick={() => handleFilterStatus("ทั้งหมด")} className="filter-button-status">
              ทั้งหมด
            </button>
            <button onClick={() => handleFilterStatus("อนุมัติ")} className="filter-button-status">
              อนุมัติ
            </button>
            <button onClick={() => handleFilterStatus("รอดำเนินการ")} className="filter-button-status">
              รอดำเนินการ
            </button>
            <button onClick={() => handleFilterStatus("ปฏิเสธ")} className="filter-button-status">
              ปฏิเสธ
            </button>
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
                {currentItems.map((borrow) => (
                  <tr key={borrow.borrow_id}>
                    <td>{borrow.borrow_id}</td>
                    <td>{borrow.UserID}</td>
                    <td>{borrow.equipment_name}</td>
                    <td>{borrow.equipment_id}</td>
                    <td>{new Date(borrow.borrow_date).toLocaleDateString("th-TH")}</td>
                    <td>{new Date(borrow.return_date).toLocaleDateString("th-TH")}</td>
                    <td className={
                      borrow.status === "อนุมัติ"
                        ? "status-approved"
                        : borrow.status === "รอดำเนินการ"
                          ? "status-pending"
                          : borrow.status === "ปฏิเสธ"
                            ? "status-rejected"
                            : ""
                    }>
                      {borrow.status}
                    </td>
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
                        อนุมัติ
                      </button>
                      <button
                        onClick={() => rejectBorrowRequest(borrow.borrow_id)}
                        className="reject-button"
                        disabled={borrow.status === "ถูกปฏิเสธ"}
                      >
                        ปฏิเสธ
                      </button>
                      <button onClick={() => deleteBorrowRequest(borrow.borrow_id)} className="delete-button">
                        ลบคำร้องขอ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && !error && renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default AdminBorrowStatus;
