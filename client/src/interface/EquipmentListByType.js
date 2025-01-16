import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import Showborrow from './showborrow';
import NavbarMain from '../components/NavbarMain';
import { useLocation, useNavigate } from "react-router-dom";

const EquipmentListByType = () => {
  const { typeId } = useParams(); // ดึง type_id จาก URL
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
        const availableEquipment = response.data.filter(item => item.status === "พร้อมใช้งาน");
        setEquipment(availableEquipment); // กรองเฉพาะอุปกรณ์ที่พร้อมใช้งาน
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

  // ดึงข้อมูลอุปกรณ์จากประเภท typeId
  const fetchEquipmentByType = () => {
    Axios.get(`http://localhost:3333/showequipment/type/${typeId}`)
      .then((response) => {
        const availableEquipment = response.data.filter(item => item.status === "พร้อมใช้งาน");
        setEquipment(availableEquipment); // กรองเฉพาะอุปกรณ์ที่พร้อมใช้งาน
      })
      .catch((err) => console.error("Error fetching equipment by type:", err));
  };

  useEffect(() => {
    fetchUser(); // ดึงข้อมูลผู้ใช้
    fetchEquipmentByType(); // ดึงข้อมูลอุปกรณ์ตาม typeId
  }, [typeId]); // โหลดข้อมูลใหม่เมื่อเปลี่ยน typeId

  useEffect(() => {
    fetchEquipment(); // ดึงข้อมูลอุปกรณ์ตามหมวดหมู่
  }, [category]); // โหลดข้อมูลใหม่เมื่อเปลี่ยน category

  useEffect(() => {
    if (searchTerm) {
      const filteredEquipment = filterBySearch(equipment);
      setEquipment(filteredEquipment);
    } else {
      fetchEquipmentByType(); // รีเฟรชข้อมูลเมื่อไม่มีคำค้นหา
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
      <div className="equipment-list">
        <div className='search-cata-bar1'>
          <div className="input-container1">
            <i className="fa fa-search search-icon" aria-hidden="true"></i>
            <input
              placeholder={"ค้นหา...."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="equipment-cards">
          {equipment.length === 0 ? (
            <p>กำลังโหลด...</p>
          ) : equipment.length > 0 ? (
            equipment.map((item) => (
              <div key={item.id} className="card">
                <div className="card-body">
                  {item.image && <img src={`http://localhost:3333/uploads/${item.image}`} alt={item.name} className="card-img-top" />}
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.description}</p>
                  {/* ส่ง equipmentId ไปยัง Showborrow */}
                  <Showborrow equipmentId={item.equipment_id} equipmentName={item.name} />
                </div>
              </div>
            ))
          ) : (
            <p>ไม่มีข้อมูลอุปกรณ์ในหมวดหมู่นี้</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default EquipmentListByType;
