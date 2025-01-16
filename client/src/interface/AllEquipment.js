import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../interface/CSS/AllEquipment.css"; // ไฟล์ CSS
import NavbarMain from "../components/NavbarMain.js";
import Showborrow from "./showborrow.js";

const AllEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(''); // เพิ่ม state สำหรับคำค้นหา

  // ดึงค่าหมวดหมู่จาก query string
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category") || "ทั้งหมด"; // ค่าเริ่มต้นคือ "ทั้งหมด"

  // ฟังก์ชันดึงข้อมูลอุปกรณ์ตามหมวดหมู่
  const fetchEquipment = () => {
    Axios.get(`http://localhost:3333/showequipment?category=${category}`)
      .then((response) => {
        // กรองเฉพาะอุปกรณ์ที่มี status เป็น "พร้อมใช้งาน"
        const availableEquipment = response.data.filter(item => item.status === "พร้อมใช้งาน");
        setEquipment(availableEquipment);
      })
      .catch((err) => console.error("Error fetching equipment:", err));
  };

  const filterBySearch = (items) => {
    if (!searchTerm) return items; // ถ้าไม่มีคำค้นหาให้คืนค่าทั้งหมด
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
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

  useEffect(() => {
    if (searchTerm) {
      const filteredEquipment = filterBySearch(equipment);
      setEquipment(filteredEquipment);
    } else {
      fetchEquipment(); // รีเฟรชข้อมูลทั้งหมดหากไม่มีคำค้นหา
    }
  }, [searchTerm]); // อัปเดตข้อมูลเมื่อคำค้นหาเปลี่ยนแปลง

  // ฟังก์ชัน Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div>
      <NavbarMain userData={user} onLogout={handleLogout} />
      <div className='header-equipment-list-1'>
        <h1 style={{ textAlign: "center", margin: "20px 0" }}>{category}</h1>
      </div>
      {/* เพิ่ม input ค้นหา */}
      <div className='search-cata-bar1'>
          <div className="input-container1">
            <i className="fa fa-search search-icon" aria-hidden="true"></i>
            <input
              placeholder={ "ค้นหา...."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      <div className="equipment-list-1">
        {equipment.length > 0 ? (
          equipment.map((item, idx) => (
            <div className="equipment-item-1" key={idx}>
                <div className="equipment-image-1">
                  <img
                    src={`http://localhost:3333/uploads/${item.image}`}
                    alt={item.name}
                  />
                </div>
                <div className="equipment-details-1">
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <span>จำนวน: {item.quantity}</span>
                  <div className='showborrow-1'>
                    <Showborrow equipmentId={item.equipment_id} equipmentName={item.name} />
                  </div>
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
