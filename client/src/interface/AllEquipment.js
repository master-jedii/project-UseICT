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
  const [searchTerm, setSearchTerm] = useState(''); // เพิ่ม state สำหรับคำค้นหา

  // เพิ่ม state สำหรับ pagination
  const [currentPage, setCurrentPage] = useState(1); // หน้าเริ่มต้นคือ 1
  const [itemsPerPage] = useState(10); // จำนวนรายการที่แสดงในแต่ละหน้า
  const [totalItems, setTotalItems] = useState(0); // จำนวนรายการทั้งหมด

  // ดึงค่าหมวดหมู่จาก query string
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category") || "ทั้งหมด"; // ค่าเริ่มต้นคือ "ทั้งหมด"

  // ฟังก์ชันดึงข้อมูลอุปกรณ์ตามหมวดหมู่
  const fetchEquipment = () => {
    Axios.get(`http://localhost:3333/showequipment?category=${category}`)
      .then((response) => {
        // กรองข้อมูลที่มี status เป็น "พร้อมใช้งาน"
        const availableEquipment = response.data.filter(item => item.status === "พร้อมใช้งาน");

        // จัดกลุ่มข้อมูลที่ได้โดยใช้ type_id
        const groupedEquipment = availableEquipment.reduce((acc, item) => {
          if (!acc[item.type_id]) {
            acc[item.type_id] = {
              ...item,
              totalQuantity: 0, // ตัวแปรนับจำนวน
            };
          }
          acc[item.type_id].totalQuantity += 1; // เพิ่มจำนวนอุปกรณ์ที่มี type_id เดียวกัน
          return acc;
        }, {});

        // แปลง Object ให้เป็น Array และตั้งค่า state
        const equipmentArray = Object.values(groupedEquipment);
        setTotalItems(equipmentArray.length); // ตั้งค่าจำนวนรายการทั้งหมด
        setEquipment(equipmentArray); // เก็บข้อมูลอุปกรณ์ที่กรองแล้ว
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

  const handleViewAllClick = (typeId) => {
    // ใช้ navigate เพื่อไปยังหน้าที่กรองข้อมูลโดยใช้ type_id
    navigate(`/equipment/${typeId}`);
  };

  // คำนวณข้อมูลที่จะต้องแสดงในหน้าปัจจุบัน
  const indexOfLastEquipment = currentPage * itemsPerPage;
  const indexOfFirstEquipment = indexOfLastEquipment - itemsPerPage;
  const currentEquipment = equipment.slice(indexOfFirstEquipment, indexOfLastEquipment);

  // คำนวณจำนวนหน้าที่ต้องแสดง
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
            placeholder={"ค้นหา...."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="equipment-list-1">
        {currentEquipment.length > 0 ? (
          currentEquipment.map((item, idx) => (
            <div className="equipment-item-1" key={idx}>
              <div className="equipment-image-1">
                <img
                  src={`http://localhost:3333/uploads/${item.image}`}
                  alt={item.name}
                />
              </div>
              <div className="equipment-details-1">
                <h4>{item.name}</h4>
                <p>รายละเอียด: {item.description}</p>
                <span className="number-eq">จำนวน: {item.totalQuantity}</span>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <button
                    className="all-eq-button"
                    onClick={() => handleViewAllClick(item.type_id)}
                  >
                    ยืมอุปกรณ์
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>ไม่มีข้อมูลในหมวดหมู่ "{category}" หรือ ไม่มีอุปกรณ์ที่พร้อมใช้งาน</p>
        )}
      </div>

      <div className="pagination-allEquipment">
        {/* Display the page numbers */}
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
  );
};

export default AllEquipment;
