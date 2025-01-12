import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useLocation } from "react-router-dom";
import "../interface/CSS/AllEquipment.css"; // ไฟล์ CSS
import Navbarmain  from "../components/NavbarMain";

const AllEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const location = useLocation();

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

  useEffect(() => {
    fetchEquipment(); // ดึงข้อมูลเมื่อโหลดหน้า
  }, [category]); // โหลดข้อมูลใหม่เมื่อเปลี่ยน category

  return (
    <div className="all-equipment">
        <Navbarmain ></Navbarmain >
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
