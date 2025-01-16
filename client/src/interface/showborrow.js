import React, { useState, useEffect } from "react";
import axios from "axios";
import "../interface/CSS/showborrow.css";
import "../interface/CSS/Modal.css";
import api from "../service/axios";

const Showborrow = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [borrowDate, setBorrowDate] = useState(getToday());
  const [returnDate, setReturnDate] = useState(getDefaultReturnDate(getToday()));
  const [UserID, setUserId] = useState(""); // เก็บ UserID
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        console.warn("No token found in sessionStorage");
        return;
      }
      try {
        const response = await api.get("/main", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(response.data.user.id); // อัปเดต UserID
      } catch (error) {
        console.error("Error fetching user ID:", error.response || error.message);
      }
    };
    fetchUserId();
  }, []);

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
        UserID={UserID} // ส่ง UserID ไปยัง Modal
      />
    </div>
  );
};

const Modal = ({
  isOpen,
  onClose,
  borrowDate,
  returnDate,
  onBorrowDateChange,
  minDate,
  UserID,
}) => {
  const [formData, setFormData] = useState({
    UserID: UserID,
    subject: "",
    location: "",
    borrowDate,
    returnDate,
    name: "", // เพิ่ม field name สำหรับชื่ออุปกรณ์
  });

  useEffect(() => {
    // Fetch UserID & Equipment data when Modal opens
    const fetchEquipmentData = async () => {
      try {
        const response = await axios.get("http://localhost:3333/api/equipment");
        const equipmentList = response.data; // ข้อมูลทั้งหมดจาก API
    
        console.log("Equipment List:", equipmentList);
        
        // ตัวอย่าง: อัปเดตข้อมูลใน state
        if (equipmentList.length > 0) {
          const { equipment_id, name } = equipmentList[0]; // เลือกตัวแรกในรายการ
          setFormData((prev) => ({
            ...prev,
            equipment_id,
            name,
          }));
        }
      } catch (error) {
        console.error("Error fetching equipment data:", error.response || error.message);
      }
    };
    
    if (isOpen) {
      fetchEquipmentData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (UserID) {
      setFormData((prev) => ({ ...prev, UserID }));
    }
  }, [UserID]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!UserID) {
      alert("ไม่พบข้อมูลผู้ใช้งาน");
      return;
    }

    if (!formData.subject || !formData.name || !formData.location) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const dataToSend = {
      UserID: UserID,
      subject: formData.subject,
      name: formData.name, // ส่งชื่ออุปกรณ์
      place: formData.location,
      borrow_d: borrowDate,
      return_d: returnDate,
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
                  value={formData.UserID || "กำลังโหลด..."}
                  readOnly
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
                <label htmlFor="name">ชื่ออุปกรณ์</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name || "กำลังโหลด..."}
                  readOnly
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

            <div className="new-form-grid">
              <div>
                <label htmlFor="borrowDate">วันที่ยืม</label>
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
                <label htmlFor="returnDate">กำหนดคืน</label>
                <input
                  type="date"
                  id="returnDate"
                  value={returnDate}
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
