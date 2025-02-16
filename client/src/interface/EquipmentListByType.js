import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import Showborrow from './showborrow';
import NavbarMain from '../components/NavbarMain';
import { useLocation, useNavigate } from "react-router-dom";
import '../interface/CSS/EqListbyT.css';
import ButtonDetail from '../interface/ButtonDetail'


const EquipmentListByType = () => {
  const { typeId } = useParams(); // ดึง type_id จาก URL
  const [equipment, setEquipment] = useState([]); // เก็บข้อมูลอุปกรณ์
  const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้
  const [currentCategory, setCurrentCategory] = useState("ทั้งหมด"); // เก็บหมวดหมู่
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(''); // คำค้นหา
  const [currentPage, setCurrentPage] = useState(1); // หน้าที่แสดงในปัจจุบัน
  const [itemsPerPage, setItemsPerPage] = useState(10); // จำนวนอุปกรณ์ที่จะแสดงในแต่ละหน้า
  const [totalPages, setTotalPages] = useState(1); // จำนวนทั้งหมดของหน้า

  const queryParams = new URLSearchParams(location.search);
  const queryCategory = queryParams.get("category") || "ทั้งหมด"; // หมวดหมู่ที่เลือก

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
          navigate("/login"); // ถ้าไม่มีการล็อกอินให้ไปที่หน้า login
        });
    } else {
      navigate("/login");
    }
  };

  // ฟังก์ชันดึงข้อมูลอุปกรณ์จาก API
  const fetchEquipment = (page = 1) => {
    let url = `http://localhost:3333/showequipment?page=${page}&limit=${itemsPerPage}`;
    if (queryCategory !== "ทั้งหมด") {
      url += `&category=${queryCategory}`;
    } else if (typeId) {
      url = `http://localhost:3333/showequipment/type/${typeId}?page=${page}&limit=${itemsPerPage}`;
    }

    Axios.get(url)
      .then((response) => {
        const availableEquipment = response.data.filter(item => item.status === "พร้อมใช้งาน");
        setEquipment(availableEquipment);

        // คำนวณจำนวนหน้า
        const total = availableEquipment.length;
        const pages = Math.ceil(total / itemsPerPage); // คำนวณจำนวนหน้าทั้งหมด
        setTotalPages(pages);

        // ตั้งค่าหมวดหมู่
        if (availableEquipment.length > 0) {
          setCurrentCategory(availableEquipment[0].category || queryCategory);
        } else {
          setCurrentCategory(queryCategory);
        }
      })
      .catch((err) => console.error("Error fetching equipment:", err));
  };

  useEffect(() => {
    fetchUser(); // ดึงข้อมูลผู้ใช้
    fetchEquipment(currentPage); // ดึงข้อมูลเมื่อเปลี่ยนหน้า
  }, [currentPage, queryCategory, typeId]); // เมื่อ category หรือ typeId หรือ currentPage เปลี่ยนแปลง

  useEffect(() => {
    if (searchTerm) {
      const filteredEquipment = equipment.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setEquipment(filteredEquipment);
    } else {
      fetchEquipment(currentPage); // รีเฟรชข้อมูลเมื่อไม่มีคำค้นหา
    }
  }, [searchTerm, currentPage]); // อัปเดตข้อมูลเมื่อคำค้นหาหรือหน้าเปลี่ยนแปลง

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('authToken');
    navigate('/');
  };

  // คำนวณข้อมูลที่จะแสดงในหน้า
  const indexOfLastEquipment = currentPage * itemsPerPage;
  const indexOfFirstEquipment = indexOfLastEquipment - itemsPerPage;
  const currentEquipment = equipment.slice(indexOfFirstEquipment, indexOfLastEquipment);

  return (
    <div>
      <NavbarMain userData={user} onLogout={handleLogout} /> {/* ส่งข้อมูลผู้ใช้ให้ NavbarMain */}
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
          {currentEquipment.length === 0 ? (
            <p>กำลังโหลด...</p>
          ) : currentEquipment.map((item) => (
            <div key={item.id} className="equipment-item-2">
              <div className="equipment-image-2">
                {item.image && <img src={`http://localhost:3333/uploads/${item.image}`} alt={item.name} />}
              </div>
              <div className="equipment-details-2">
                <h4>{item.name}</h4>
                <p>รหัสอุปกรณ์ : {item.equipment_id}</p>
                <p>รายละเอียดย่อย : {item.description} </p>
                <div className="showborrow-2">
                  <Showborrow equipmentId={item.equipment_id} equipmentName={item.name} />
                  <ButtonDetail defectId={item.equipment_id} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination-type">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EquipmentListByType;
