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
    objective: "",  // เปลี่ยนจาก equipment เป็น objective
    place: "",      // เปลี่ยนจาก location เป็น place
    borrow_d: borrowDate,  // เปลี่ยนจาก borrowDate เป็น borrow_d
    return_d: returnDate,  // เปลี่ยนจาก returnDate เป็น return_d
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      borrow_d: borrowDate,  // ใช้ borrow_d
      return_d: returnDate,  // ใช้ return_d
    };
  
    try {
      const response = await axios.post("http://localhost:3333/api/borrow", dataToSend);
      alert(response.data.message || "บันทึกข้อมูลสำเร็จ");
      onClose();
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      } else {
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
      }
      console.error("Error:", error);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="new-modal">
      <div className="new-modal-content">
        <div className="new-modal-header">
          <h2>คำร้องขอยืมอุปกรณ์</h2>
        </div>
        <div className="new-modal-body">
          <form onSubmit={handleSubmit} className="new-form-container">
            <div className="new-form-grid">
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
            <div className="new-form-grid">
              <div>
                <label htmlFor="objective">วัสดุประสงค์ในการยืมอุปกรณ์</label>
                <input
                  type="text"
                  id="objective"
                  value={formData.objective}  // ใช้ objective แทน equipment
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="place">สถานที่ใช้งาน</label>
                <input
                  type="text"
                  id="place"
                  value={formData.place}  // ใช้ place แทน location
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="new-form-grid">
              <div>
                <label htmlFor="borrow_d">วันที่ยืม</label>
                <input
                  type="date"
                  id="borrow_d"
                  value={borrowDate}  // ใช้ borrow_d แทน borrowDate
                  onChange={(e) => {
                    onBorrowDateChange(e);
                    handleChange(e);
                  }}
                  min={minDate}
                  required
                />
              </div>
              <div>
                <label htmlFor="return_d">กำหนดคืน</label>
                <input
                  type="date"
                  id="return_d"
                  value={returnDate}  // ใช้ return_d แทน returnDate
                  readOnly
                />
              </div>
            </div>
            <div className="new-form-row note">
              <span>*สามารถยืมอุปกรณ์ได้สูงสุด 7 วัน</span>
            </div>
            <div className="new-form-buttons">
              <button type="submit" className="new-submit-btn">
                ยืนยันอุปกรณ์
              </button>
              <button type="button" className="new-cancel btn-danger" onClick={onClose}>
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
