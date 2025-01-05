import React, { useState, useEffect } from "react";
import Axios from "axios";
import cameraIcon from '../assets/Camera.png';
import lensIcon from '../assets/Aperture.png';
import tripodIcon from '../assets/Camera on Tripod.png';
import lightIcon from '../assets/Searchlight.png';
import audioIcon from '../assets/music.png';
import lightEquipmentIcon from '../assets/Source Four Par.png';
import otherIcon from '../assets/Camera Addon Identification.png';

import "../View/DisplayEquipment.css";

const DisplayEquipment = () => {
  const [equipment, setEquipment] = useState([]); // เก็บข้อมูลทั้งหมด
  const [selectedCategory, setSelectedCategory] = useState(""); // เก็บหมวดหมู่ที่เลือก

  // ดึงข้อมูลทั้งหมดจาก API
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

  // กรองข้อมูลตามหมวดหมู่ที่เลือก
  const filteredEquipment = selectedCategory
    ? equipment.filter((item) => item.category === selectedCategory)
    : equipment; // หากยังไม่ได้เลือกหมวดหมู่ จะแสดงข้อมูลทั้งหมด

  return (
    <div className="equipment-list">
        <div className="header-category">
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
        <div className="equipment-container">
          {filteredEquipment.length > 0 ? (
            filteredEquipment.map((item, index) => (
              <div className="card" style={{ width: "18rem", margin: "10px" }} key={index}>
                <img
                  src={`http://localhost:3333/uploads/${item.image}`}
                  className="card-img-top"
                  alt={item.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.description}</p>
                  <p className="card-text">หมวดหมู่: {item.category}</p>
                </div>
              </div>
            ))
          ) : (
            <p>ไม่มีข้อมูลในหมวดหมู่ "{selectedCategory}"</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayEquipment;
