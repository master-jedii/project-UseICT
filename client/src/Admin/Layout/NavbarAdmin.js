import React from 'react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../CSS/MainAdmin.css';
import myLogo from '../../assets/LOGO.png';
import '../CSS/NavbarAdmin.css';
import Axios from 'axios';

const NavbarAdmin = () => {
    const navigate = useNavigate(); // Initialize navigate function
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
  
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
    <div className="admin-dashboard">
      <div className="sidebar">
        <div className="logo-container">
          <img src={myLogo} alt="SU Kits Logo" className="logo" />
          <h1 className="title">SU Kits</h1>
        </div>
        <ul className="menu">
          <li className="menu-item active">
            <i className="fas fa-tools"></i> รายการอุปกรณ์
          </li>
          <li className="menu-item">
            <i className="fas fa-handshake"></i> สถานะการยืม
          </li>
          <li className="menu-item">
            <i className="fas fa-history"></i> กำหนดการคืน
          </li>
        </ul>
      </div>
      
      <div className="main-content">
        <header className="admin-header">
          <div className="admin-header-info">
            <h1>Dashboard</h1>
          </div>
          <div className="admin-header-actions">
            <i className="fas fa-bell notification-icon"></i>
            <span className="user-name">Mos Kittipit</span>
          </div>
        </header>
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
  );
};

export default NavbarAdmin;
