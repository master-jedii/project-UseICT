import React, { useState } from "react";
import "../interface/CSS/showborrow.css";
import "../interface/CSS/Modal.css";

const Showborrow = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [borrowDate, setBorrowDate] = useState(getToday());
  const [returnDate, setReturnDate] = useState(getDefaultReturnDate(getToday()));

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Helper to get today's date in YYYY-MM-DD format
  function getToday() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  // Helper to calculate the return date (7 days after the borrow date)
  function getDefaultReturnDate(startDate) {
    const startDateObj = new Date(startDate);
    startDateObj.setDate(startDateObj.getDate() + 7);
    return startDateObj.toISOString().split("T")[0];
  }

  const handleBorrowDateChange = (event) => {
    const newBorrowDate = event.target.value;
    setBorrowDate(newBorrowDate);

    // Set return date to 7 days after the borrow date
    const newReturnDate = getDefaultReturnDate(newBorrowDate);
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
        minDate={getToday()}
      />
    </div>
  );
};

const Modal = ({ isOpen, onClose, borrowDate, returnDate, onBorrowDateChange, minDate }) => {
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
                  min={minDate} // Restrict past dates
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
