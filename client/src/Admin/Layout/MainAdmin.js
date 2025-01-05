import React, { useState } from 'react';
import Axios from 'axios';
import '../CSS/MainAdmin.css';
import NavbarAdmin from './NavbarAdmin';

const MainAdmin = () => {
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
    <div>
      {/* ตรวจสอบว่า data.user มีข้อมูลหรือไม่ */}
      {data && data.user ? (
        <>
          <NavbarMain userData={data.user} onLogout={handleLogout} /> {/* ส่งฟังก์ชัน Logout */}
          <Type />
        </>
      ) : (
        <div>No user data available</div> // ถ้าไม่มีข้อมูลผู้ใช้แสดงข้อความนี้
      )}
      <NavbarAdmin />
    </div>
  );
};

export default MainAdmin;
