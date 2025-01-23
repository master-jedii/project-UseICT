import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import Showborrow from './showborrow';
import NavbarMain from '../components/NavbarMain';
import { useLocation, useNavigate } from "react-router-dom";
import '../interface/CSS/EqListbyT.css';

const EquipmentListByType = () => {
  const { typeId } = useParams(); // ดึง type_id จาก URL
  const [equipment, setEquipment] = useState([]);
  const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้
  const [currentCategory, setCurrentCategory] = useState("ทั้งหมด"); // ใช้สำหรับเก็บ category ที่แท้จริง
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(''); // เพิ่ม state สำหรับคำค้นหา

  const queryParams = new URLSearchParams(location.search);
  const queryCategory = queryParams.get("category") || "ทั้งหมด"; // ค่าเริ่มต้นคือ "ทั้งหมด"

  // ฟังก์ชันดึงข้อมูลอุปกรณ์
  const fetchEquipment = () => {
    let url = `http://localhost:3333/showequipment`;
    if (queryCategory !== "ทั้งหมด") {
      url += `?category=${queryCategory}`;
    } else if (typeId) {
      url = `http://localhost:3333/showequipment/type/${typeId}`;
    }

    Axios.get(url)
      .then((response) => {
        const availableEquipment = response.data.filter(item => item.status === "พร้อมใช้งาน");
        setEquipment(availableEquipment);

        // ดึง category จริงจากข้อมูลที่ได้รับ
        if (availableEquipment.length > 0) {
          setCurrentCategory(availableEquipment[0].category || queryCategory);
        } else {
          setCurrentCategory(queryCategory);
        }
      })
      .catch((err) => console.error("Error fetching equipment:", err));
  };

  const filterBySearch = (items) => {
    if (!searchTerm) return items; // ถ้าไม่มีคำค้นหาให้คืนค่าทั้งหมด
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

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
          navigate("/login");
        });
    }
  };

  useEffect(() => {
    fetchUser(); // ดึงข้อมูลผู้ใช้
  }, []);

  useEffect(() => {
    fetchEquipment(); // ดึงข้อมูลอุปกรณ์
  }, [queryCategory, typeId]); // โหลดข้อมูลใหม่เมื่อ queryCategory หรือ typeId เปลี่ยนแปลง

  useEffect(() => {
    if (searchTerm) {
      const filteredEquipment = filterBySearch(equipment);
      setEquipment(filteredEquipment);
    } else {
      fetchEquipment(); // รีเฟรชข้อมูลเมื่อไม่มีคำค้นหา
    }
  }, [searchTerm]); // อัปเดตข้อมูลเมื่อคำค้นหาเปลี่ยนแปลง

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div>
      <NavbarMain userData={user} onLogout={handleLogout} />
      <div className='header-equipment-list-2'>
        <h1 style={{ textAlign: "center", margin: "20px 0" }}>
           {currentCategory}
        </h1>
      </div>
      <div className="equipment-list-2">
        <div className='search-cata-bar2'>
          <div className="input-container2">
            <i className="fa fa-search search-icon" aria-hidden="true"></i>
            <input
              placeholder="ค้นหา...."
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
              <div key={item.id} className="equipment-item-2">
                <div className="equipment-image-2">
                  {item.image && <img src={`http://localhost:3333/uploads/${item.image}`} alt={item.name} />}
                </div>
                <div className="equipment-details-2">
                  <h4>{item.name}</h4>
                  <p>รหัสอุปกรณ์ : {item.equipment_id}</p>
                  <p>รายละเอัยด : {item.description} </p>
                  <div className="showborrow-2">
                    <Showborrow equipmentId={item.equipment_id} equipmentName={item.name} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>ไม่มีข้อมูลในหมวดหมู่ "{currentCategory}"</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentListByType;
