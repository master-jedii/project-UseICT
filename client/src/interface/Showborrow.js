import React, { useState, useEffect } from "react";
import "../interface/CSS/showborrow.css";
import "../interface/CSS/Modal.css";

const Showborrow = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [borrowDate, setBorrowDate] = useState("2024-01-01");
  const [returnDate, setReturnDate] = useState("2024-01-08");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleBorrowDateChange = (event) => {
    const newBorrowDate = event.target.value;
    setBorrowDate(newBorrowDate);

    // Set return date to 7 days after the borrow date
    const borrowDateObj = new Date(newBorrowDate);
    borrowDateObj.setDate(borrowDateObj.getDate() + 7);
    const newReturnDate = borrowDateObj.toISOString().split('T')[0]; // Get date in YYYY-MM-DD format
    setReturnDate(newReturnDate);
  };

  return (
    <div className="showborrow-container">
      <button className="open-modal-btn" onClick={openModal}>
        ยืมอุปกรณ์
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        borrowDate={borrowDate}
        returnDate={returnDate}
        onBorrowDateChange={handleBorrowDateChange}
      />
    </div>
  );
};

const Modal = ({ isOpen, onClose, borrowDate, returnDate, onBorrowDateChange }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>คำร้องขอยืมอุปกรณ์</h2>
        </div>
        <div className="modal-body">
          <div className="form-container">
            <div className="form-grid">
              <div>
                <label htmlFor="user-id">รหัสผู้ยืม</label>
                <input type="text" id="user-id" />
              </div>
              <div>
                <label htmlFor="subject">รายวิชา / โครงการ</label>
                <select id="subject">
                  <option value="">เลือกวิชา</option>
                  <option value="subject1">โครงการ 1</option>
                  <option value="subject2">โครงการ 2</option>
                </select>
              </div>
            </div>
            <div className="form-grid">
              <div>
                <label htmlFor="equipment">วัสดุประสงค์ในการยืมอุปกรณ์</label>
                <input type="text" id="equipment" />
              </div>
              <div>
                <label htmlFor="location">สถานที่ใช้งาน</label>
                <input type="text" id="location" />
              </div>
            </div>
            <div className="form-grid">
              <div>
                <label htmlFor="borrow-date">วันที่ยืม</label>
                <input
                  type="date"
                  id="borrow-date"
                  value={borrowDate}
                  onChange={onBorrowDateChange}
                />
              </div>
              <div>
                <label htmlFor="return-date">กำหนดคืน</label>
                <input
                  type="date"
                  id="return-date"
                  value={returnDate}
                  readOnly
                />
              </div>
            </div>
            <div className="form-row note">
              <span>*สามารถยืมอุปกรณ์ได้สูงสุด 7 วัน</span>
            </div>
            <div className="form-buttons">
              <button className="submit-btn">ยืนยันอุปกรณ์</button>
              <button className="cancel-btn" onClick={onClose}>
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Showborrow;
