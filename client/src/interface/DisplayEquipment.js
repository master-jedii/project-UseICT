import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import cameraIcon from '../assets/Camera.png';
import lensIcon from '../assets/Aperture.png';
import tripodIcon from '../assets/Camera on Tripod.png';
import lightIcon from '../assets/Searchlight.png';
import audioIcon from '../assets/music.png';
import lightEquipmentIcon from '../assets/Source Four Par.png';
import otherIcon from '../assets/Camera Addon Identification.png';
import '../View/DisplayEquipment.css';

const DisplayEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // Track selected category
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

  // ฟังก์ชันจัดการการคลิกไอคอนหมวดหมู่
  const handleIconClick = (category) => {
    setSelectedCategory(category); // อัปเดตหมวดหมู่ที่เลือก
    console.log(`Category selected: ${category}`);
  };

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

  // กรองเฉพาะหมวดหมู่ที่เลือก
  const selectedCategoryItems = selectedCategory
    ? filteredEquipment.find((categoryData) => categoryData.category === selectedCategory)?.items || []
    : [];

  return (
    <div className="equipment-list">
      
      <div className="header-category">
        <input placeholder='ค้นหา .....'></input>
        <div className="category-icons">
          <div className="category" onClick={() => handleIconClick("กล้อง")}>
            <div className="image-box">
              <img src={cameraIcon} alt="กล้อง" />
            </div>
            <p className="category-text">กล้อง</p>
          </div>

          <div className="category" onClick={() => handleIconClick("เลนส์")}>
            <div className="image-box2">
              <img src={lensIcon} alt="เลนส์" />
            </div>
            <p className="category-text">เลนส์</p>
          </div>

          <div className="category" onClick={() => handleIconClick("ขาตั้งกล้อง")}>
            <div className="image-box3">
              <img src={tripodIcon} alt="ขาตั้งกล้อง" />
            </div>
            <p className="category-text">ขาตั้งกล้อง</p>
          </div>

          <div className="category" onClick={() => handleIconClick("ไฟสำหรับถ่ายทำ")}>
            <div className="image-box4">
              <img src={lightIcon} alt="ไฟสำหรับถ่ายทำ" />
            </div>
            <p className="category-text">ไฟสำหรับถ่ายทำ</p>
          </div>

          <div className="category" onClick={() => handleIconClick("อุปกรณ์ด้านเสียง")}>
            <div className="image-box5">
              <img src={audioIcon} alt="อุปกรณ์ด้านเสียง" />
            </div>
            <p className="category-text">อุปกรณ์ด้านเสียง</p>
          </div>

          <div className="category" onClick={() => handleIconClick("อุปกรณ์จัดแสง")}>
            <div className="image-box6">
              <img src={lightEquipmentIcon} alt="อุปกรณ์จัดแสง" />
            </div>
            <p className="category-text">อุปกรณ์จัดแสง</p>
          </div>

          <div className="category" onClick={() => handleIconClick("อุปกรณ์อื่นๆ")}>
            <div className="image-box7">
              <img src={otherIcon} alt="อุปกรณ์อื่นๆ" />
            </div>
            <p className="category-text">อุปกรณ์อื่นๆ</p>
          </div>

          
        </div>

        {/* แสดงข้อมูลที่กรองแล้ว */}
        {selectedCategory ? (
          <div className="equipment-container">
            {selectedCategoryItems.length > 0 ? (
              selectedCategoryItems.slice(0, 8).map((item, idx) => (
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
              <p>ไม่มีข้อมูลในหมวดหมู่ "{selectedCategory}"</p>
            )}
          </div>
        ) : (
          // แสดงหมวดหมู่ทั้งหมดเมื่อไม่มีหมวดหมู่ที่เลือก
          filteredEquipment.map((categoryData, index) => (
            <div key={index}>
              <h1 >{categoryData.category}</h1> {/* แสดงชื่อหมวดหมู่ */}

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
          ))
        )}
      </div>
    </div>
  );
};

export default DisplayEquipment;
