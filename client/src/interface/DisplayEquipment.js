import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../View/DisplayEquipment.css';

const DisplayEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const navigate = useNavigate();

  // ฟังก์ชันดึงข้อมูลอุปกรณ์
  const getEquipment = () => {
    Axios.get("http://localhost:3333/admin")
      .then((response) => {
        setEquipment(response.data);
      })
      .catch((err) => console.error(err));
  };

  // ดึงข้อมูลเมื่อ component โหลด
  useEffect(() => {
    getEquipment();
  }, []);

  // ฟังก์ชันกรองอุปกรณ์ที่มีชื่อไม่ซ้ำ
  const getUniqueEquipment = (equipmentList) => {
    const seen = new Set();
    return equipmentList.filter((item) => {
      if (seen.has(item.name)) {
        return false;
      }
      seen.add(item.name);
      return true;
    });
  };

  // กรองข้อมูลตามหมวดหมู่ที่ต้องการ
  const categories = ["กล้อง", "เลนส์", "ขาตั้งกล้อง", "ไฟสำหรับถ่ายทำ", "อุปกรณ์ด้านเสียง", "อุปกรณ์จัดแสง", "อุปกรณ์อื่นๆ"];

  // กรองข้อมูลที่มีชื่อไม่ซ้ำจากหมวดหมู่ต่างๆ
  const filteredEquipment = categories.map((category) => {
    return {
      category,
      items: getUniqueEquipment(equipment.filter((item) => item.category === category)),
    };
  });

  return (
    <div className="equipment-list">
      <div className="header-category">
        {/* แสดงอุปกรณ์แต่ละหมวดหมู่ */}
        {filteredEquipment.map((categoryData, index) => (
          <div key={index}>
            <h1>{categoryData.category}</h1> {/* เพิ่ม h1 แสดงชื่อหมวดหมู่ */}

            <div className="equipment-container">
              {categoryData.items.length > 0 ? (
                categoryData.items.slice(0, 8).map((item, idx) => (
                  <div className="card" style={{ width: "18rem", margin: "10px" }} key={idx}>
                    <img
                      src={`http://localhost:3333/uploads/${item.image}`}
                      className="card-img-top"
                      alt={item.name}
                    />
                    <div className="card-body">
                      <h4 className="card-title">{item.name}</h4>
                      <p className="card-text">{item.description}</p>
                      <a href="#" className="btn btn-primary custom-borrow-btn">ยืมอุปกรณ์</a>
                    </div>
                  </div>
                ))
              ) : (
                <p>ไม่มีข้อมูลในหมวดหมู่ "{categoryData.category}"</p>
              )}
            </div>

            {/* ปุ่มดูทั้งหมดสำหรับแต่ละหมวดหมู่ */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                className="btn btn-secondary"
                onClick={() => navigate(`/all-equipment/${categoryData.category}`)} // เปลี่ยนหน้าไปยัง /all-equipment/หมวดหมู่
              >
                ดูทั้งหมด
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayEquipment;
