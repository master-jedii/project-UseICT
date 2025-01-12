import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../interface/CSS/AllEquipment.css"; // ไฟล์ CSS
import NavbarMain from "../components/NavbarMain.js";

const AllEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้
  const location = useLocation();
  const navigate = useNavigate();

  // ดึงค่าหมวดหมู่จาก query string
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category") || "ทั้งหมด"; // ค่าเริ่มต้นคือ "ทั้งหมด"

  // ฟังก์ชันดึงข้อมูลอุปกรณ์ตามหมวดหมู่
  const fetchEquipment = () => {
    Axios.get(`http://localhost:3333/showequipment?category=${category}`)
      .then((response) => {
        setEquipment(response.data);
      })
      .catch((err) => console.error("Error fetching equipment:", err));
  };

  // ฟังก์ชันดึงข้อมูลผู้ใช้
  const fetchUser = () => {
    const token = localStorage.getItem("token");
    if (token) {
      Axios.get("http://localhost:3333/main", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          setUser(response.data.user); // เก็บข้อมูลผู้ใช้ใน state
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
          navigate("/login"); // หากไม่มี token หรือ token ไม่ถูกต้อง ให้กลับไปหน้า Login
        });
    }
  };

  useEffect(() => {
    fetchEquipment(); // ดึงข้อมูลอุปกรณ์
    fetchUser(); // ดึงข้อมูลผู้ใช้
  }, [category]); // โหลดข้อมูลใหม่เมื่อเปลี่ยน category

  // ฟังก์ชัน Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div className="all-equipment">
      <NavbarMain userData={user} onLogout={handleLogout} />
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>หมวดหมู่: {category}</h1>

      <div className="equipment-list">
        {equipment.length > 0 ? (
          equipment.map((item, idx) => (
            <div className="equipment-item" key={idx}>
              <div className="equipment-image">
                <img
                  src={`http://localhost:3333/uploads/${item.image}`}
                  alt={item.name}
                />
              </div>
              <div className="equipment-details">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <span>จำนวน: {item.quantity}</span>
                <a href="#" className="btn custom-borrow-btn">ยืมอุปกรณ์</a>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>ไม่มีข้อมูลในหมวดหมู่ "{category}"</p>
        )}
      </div>
    </div>
  );
};

export default AllEquipment;
