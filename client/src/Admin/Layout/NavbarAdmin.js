import React, { useState } from 'react';
import Axios from 'axios';
import '../CSS/MainAdmin.css';
import NavbarAdmin from './NavbarAdmin';

const MainAdmin = ({ userData }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  // ฟังก์ชัน Logout
  const handleLogout = () => {
    console.log("Logged out");
    // เพิ่มการจัดการ Logout เช่น Clear token หรือ Redirect
  };

  // เปิด/ปิด Modal
  const toggleModal = () => {
    setShowModal(!showModal);
    // Reset ค่า input เมื่อปิด Modal
    setName("");
    setDescription("");
    setCategory("");
    setImage(null);
  };

  // ฟังก์ชันเพิ่มอุปกรณ์
  const addEquipment = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("image", image);

    Axios.post("http://localhost:3333/create", formData)
      .then(() => {
        alert("เพิ่มอุปกรณ์เรียบร้อย!");
        toggleModal();
      })
      .catch((err) => {
        console.error(err);
        alert("เกิดข้อผิดพลาดในการเพิ่มอุปกรณ์");
      });
  };

  return (
    <div>
      {/* ตรวจสอบข้อมูลผู้ใช้ */}
      {userData ? (
        <>
          <NavbarAdmin userData={userData} onLogout={handleLogout} />
          <div className="Adminss">
            <h1>Main Admin</h1>
            <button className="btn btn-primary" onClick={toggleModal}>
              เพิ่มอุปกรณ์
            </button>
            {/* Modal สำหรับเพิ่มอุปกรณ์ */}
            {showModal && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={toggleModal}>
                    &times;
                  </span>
                  <h2>เพิ่มอุปกรณ์</h2>
                  <form onSubmit={addEquipment}>
                    <label htmlFor="name">ชื่ออุปกรณ์:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter equipment name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <label htmlFor="description">รายละเอียด:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter equipment description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                    <label htmlFor="category">หมวดหมู่:</label>
                    <select
                      className="form-control"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        เลือกหมวดหมู่
                      </option>
                      <option value="กล้อง">กล้อง</option>
                      <option value="ขาตั้งกล้อง">ขาตั้งกล้อง</option>
                      <option value="ไฟสำหรับถ่ายทำ">ไฟสำหรับถ่ายทำ</option>
                      <option value="อุปกรณ์ด้านเสียง">อุปกรณ์ด้านเสียง</option>
                      <option value="อุปกรณ์จัดแสง">อุปกรณ์จัดแสง</option>
                      <option value="อุปกรณ์อื่นๆ">อุปกรณ์อื่นๆ</option>
                    </select>
                    <label htmlFor="file">เลือกไฟล์:</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setImage(e.target.files[0])}
                      required
                    />
                    <button type="submit" className="btn btn-success">
                      เพิ่มอุปกรณ์
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div>No user data available</div>
      )}
    </div>
  );
};

export default MainAdmin;
