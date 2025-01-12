import React, { useState } from "react";
import axios from "axios";
import "../interface/CSS/showborrow.css";
import "../interface/CSS/Modal.css";

const Showborrow = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [borrowDate, setBorrowDate] = useState(getToday());
  const [returnDate, setReturnDate] = useState(getDefaultReturnDate(getToday()));

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  function getToday() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  function getDefaultReturnDate(startDate) {
    const startDateObj = new Date(startDate);
    startDateObj.setDate(startDateObj.getDate() + 7);
    return startDateObj.toISOString().split("T")[0];
  }

  const handleBorrowDateChange = (event) => {
    const newBorrowDate = event.target.value;
    setBorrowDate(newBorrowDate);

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
  const [formData, setFormData] = useState({
    userId: "",
    subject: "",
    equipment: "",
    location: "",
    borrowDate,
    returnDate,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      borrowDate,
      returnDate,
    };

    try {
      const response = await axios.post("/api/borrow", dataToSend);
      alert(response.data.message || "บันทึกข้อมูลสำเร็จ");
      onClose();
    } catch (error) {
      if (error.response) {
        // เมื่อมี response error จาก server
        alert(error.response.data.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      } else {
        // เมื่อไม่มีการตอบกลับ (เช่น network error)
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
      }
      console.error("Error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>คำร้องขอยืมอุปกรณ์</h2>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-grid">
              <div>
                <label htmlFor="userId">รหัสผู้ยืม</label>
                <input
                  type="text"
                  id="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="subject">รายวิชา / โครงการ</label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">เลือกวิชา</option>
                  <option value="subject1">โครงการ 1</option>
                  <option value="subject2">โครงการ 2</option>
                </select>
              </div>
            </div>
            <div className="form-grid">
              <div>
                <label htmlFor="equipment">วัสดุประสงค์ในการยืมอุปกรณ์</label>
                <input
                  type="text"
                  id="equipment"
                  value={formData.equipment}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="location">สถานที่ใช้งาน</label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-grid">
              <div>
                <label htmlFor="borrow-date">วันที่ยืม</label>
                <input
                  type="date"
                  id="borrowDate"
                  value={borrowDate}
                  onChange={(e) => {
                    onBorrowDateChange(e);
                    handleChange(e);
                  }}
                  min={minDate}
                  required
                />
              </div>
              <div>
                <label htmlFor="return-date">กำหนดคืน</label>
                <input
                  type="date"
                  id="returnDate"
                  value={returnDate}
                  readOnly
                />
              </div>
            </div>
            <div className="form-row note">
              <span>*สามารถยืมอุปกรณ์ได้สูงสุด 7 วัน</span>
            </div>
            <div className="form-buttons">
              <button type="submit" className="submit-btn">
                ยืนยันอุปกรณ์
              </button>
              <button type="button" className="cancel-btn" onClick={onClose}>
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Showborrow;
