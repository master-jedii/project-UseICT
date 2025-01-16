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
import All from '../assets/Vector.png';
import '../View/DisplayEquipment.css';
import ShowBorrow from '../interface/showborrow';

const DisplayEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // เพิ่ม state สำหรับคำค้นหา
  const navigate = useNavigate();

  // ฟังก์ชันดึงข้อมูลอุปกรณ์
  const getEquipment = () => {
    Axios.get("http://localhost:3333/showequipment")
      .then((response) => {
        // กรองอุปกรณ์ที่มี status "พร้อมใช้งาน" เท่านั้น
        const availableEquipment = response.data.filter(item => item.status === "พร้อมใช้งาน");
        setEquipment(availableEquipment); // เก็บเฉพาะอุปกรณ์ที่พร้อมใช้งาน
      })
      .catch((err) => console.error(err));
  };

  // ดึงข้อมูลเมื่อ component โหลด
  useEffect(() => {
    getEquipment();
  }, []);

  // ฟังก์ชันจัดการการคลิกไอคอนหมวดหมู่
  const handleIconClick = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    if (!searchTerm) {
      getEquipment(); // ดึงข้อมูลทั้งหมดหากไม่มีคำค้นหา
    } else {
      const filteredEquipment = filterBySearch(equipment);
      setEquipment(filteredEquipment);
    }
  }, [searchTerm]); // อัปเดตข้อมูลเมื่อคำค้นหาเปลี่ยนแปลง

  // ฟังก์ชันกรองอุปกรณ์ตามคำค้นหา
  const filterBySearch = (items) => {
    if (!searchTerm) return items; // ถ้าไม่มีคำค้นหาให้คืนค่าทั้งหมด
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // กรองข้อมูลที่มีชื่อไม่ซ้ำจากหมวดหมู่ต่างๆ
  const categories = ["กล้อง", "เลนส์", "ขาตั้งกล้อง", "ไฟสำหรับถ่ายทำ", "อุปกรณ์ด้านเสียง", "อุปกรณ์จัดแสง", "อุปกรณ์อื่นๆ"];

  const filteredEquipment = categories.map((category) => {
    return {
      category,
      items: filterBySearch(equipment.filter((item) => item.category === category)),
    };
  });

  // กรองเฉพาะหมวดหมู่ที่เลือก
  const selectedCategoryItems = selectedCategory
    ? filterBySearch(
      filteredEquipment.find((categoryData) => categoryData.category === selectedCategory)?.items || []
    )
    : [];

  const handleViewAllClick = (typeId) => {
    // ใช้ navigate เพื่อไปยังหน้าที่กรองข้อมูลโดยใช้ type_id
    navigate(`/equipment/${typeId}`);
  };

  return (
    <div className="equipment-list">
      <div className="header-category">
        {/* เพิ่ม input ค้นหา */}
        <div className='search-cata-bar'>
          <div className="input-container">
            <i className="fa fa-search search-icon" aria-hidden="true"></i>
            <input
              placeholder={selectedCategory ? selectedCategory : "ค้นหา...."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

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
          <div className="category" onClick={() => window.location.reload()}>
            <div className="image-box8">
              <img src={All} alt="อุปกรณ์อื่นๆ" />
            </div>
            <p className="category-text">ทั้งหมด</p>
          </div>
        </div>

        {/* แสดงข้อมูลที่กรองแล้ว */}
        {selectedCategory ? (
          <div>
            <h1 style={{ textAlign: "center", margin: "110px 0 0 0" }}>{selectedCategory}</h1>
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
                      {/* <ShowBorrow></ShowBorrow> */}
                      <button onClick={()=>handleViewAllClick(item.type_id)}>ยืมอุปกรณ์</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>ไม่มีข้อมูลในหมวดหมู่ "{selectedCategory}"</p>
              )}
            </div>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <button
                className="btn btn-secondary"
                onClick={() => navigate(`/allEquipment?category=${selectedCategory}`)}
              >
                ดูทั้งหมด
              </button>
            </div>
          </div>
        ) : (
          filteredEquipment.map((categoryData, index) => (
            <div key={index}>
              <h1>{categoryData.category}</h1>
              <div className="equipment-container">
                {categoryData.items.length > 0 ? (
                  categoryData.items.slice(0, 8).map((item, idx) => (
                    <div className="card" style={{ width: "290px", margin: "10px" }} key={idx}>
                      <img
                        src={`http://localhost:3333/uploads/${item.image}`}
                        className="card-img-top"
                        alt={item.name}
                      />
                      <div className="card-body">
                        <h4 className="card-title">{item.name}</h4>
                        <p className="card-text">{item.description}</p>
                        <button onClick={() => handleViewAllClick(item.type_id)}>ยืมอุปกรณ์</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>ไม่มีข้อมูลในหมวดหมู่ "{categoryData.category}"</p>
                )}
              </div>
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/allEquipment?category=${categoryData.category}`)}
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
