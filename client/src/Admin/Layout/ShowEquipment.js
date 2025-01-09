import React, { useEffect, useState } from 'react';
import '../CSS/ShowEquipment.css';
import axios from 'axios';

const ShowEquipment = () => {
  const [equipments, setEquipments] = useState([]); // เก็บข้อมูลทั้งหมดของอุปกรณ์
  const [filteredEquipments, setFilteredEquipments] = useState([]); // เก็บข้อมูลที่กรองตามหมวดหมู่
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด'); // หมวดหมู่ที่เลือก

  useEffect(() => {
    // ดึงข้อมูลทั้งหมดจาก API และกรองตามหมวดหมู่
    axios.get(`http://localhost:3333/showequipment?category=${selectedCategory}`)
      .then((response) => {
        setEquipments(response.data); // เก็บข้อมูลทั้งหมดใน state
        setFilteredEquipments(response.data); // ตั้งค่าเริ่มต้นให้ข้อมูลที่กรองแล้วเป็นข้อมูลทั้งหมด
      })
      .catch((error) => {
        console.log(error); // แสดงข้อผิดพลาดหากเกิดขึ้น
      });
  }, [selectedCategory]); // เมื่อหมวดหมู่เปลี่ยนให้ดึงข้อมูลใหม่

  const DeleteEquipment = (id) => {
    axios.delete(`http://localhost:3333/api/equipments/${id}`)
      .then((response) => {
        console.log(response.data);
        // กรองข้อมูลหลังจากลบ
        setEquipments(equipments.filter((item) => item.equipment_id !== id));
        setFilteredEquipments(filteredEquipments.filter((item) => item.equipment_id !== id));
      })
      .catch((error) => {
        console.error('Error deleting equipment:', error);
      });
  }

  // ฟังก์ชันเลือกหมวดหมู่
  const handleCategoryChange = (category) => {
    setSelectedCategory(category); // ตั้งค่าหมวดหมู่ที่เลือก
  }

  return (
    <div className="equipment-containerAdmin">
      <h1>Equipment List</h1>

      {/* หมวดหมู่ */}
      <div className="category-buttons">
        <button onClick={() => handleCategoryChange('ทั้งหมด')} className="category-btn">ทั้งหมด</button>
        <button onClick={() => handleCategoryChange('กล้อง')} className="category-btn">กล้อง</button>
        <button onClick={() => handleCategoryChange('เลนส์')} className="category-btn">เลนส์</button>
        <button onClick={() => handleCategoryChange('ขาตั้งกล้อง')} className="category-btn">ขาตั้งกล้อง</button>
        <button onClick={() => handleCategoryChange('ไฟสำหรับถ่ายทำ')} className="category-btn">ไฟสำหรับถ่ายทำ</button>
        <button onClick={() => handleCategoryChange('อุปกรณ์ด้านเสียง')} className="category-btn">อุปกรณ์ด้านเสียง</button>
        <button onClick={() => handleCategoryChange('อุปกรณ์จัดแสง')} className="category-btn">อุปกรณ์จัดแสง</button>
        <button onClick={() => handleCategoryChange('อุปกรณ์อื่นๆ')} className="category-btn">อุปกรณ์อื่นๆ</button>
      </div>

      <ul className="equipment-listAdmin">
        {filteredEquipments.length > 0 ? (
          filteredEquipments.map((item) => (
            <li key={item.equipment_id} className="equipment-item">
              <div className="equipment-info">
                <h2>{item.name}</h2>
                <p>{item.description}</p>
              </div>
              <div className="equipment-actions">
                <button onClick={""} className="update-btn">
                  Update
                </button>
                <button onClick={() => DeleteEquipment(item.equipment_id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className='Notfound-eq'>ไม่พบข้อมูล {filteredEquipments.category}</p>
        )}
      </ul>

    </div>
  );
};

export default ShowEquipment;
