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

const DisplayEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // ฟังก์ชันดึงข้อมูลอุปกรณ์
  const getEquipment = () => {
    Axios.get("http://localhost:3333/showequipment")
      .then((response) => {
        const availableEquipment = response.data.filter(item => item.status === "พร้อมใช้งาน");
        setEquipment(availableEquipment);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getEquipment();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      getEquipment();
    } else {
      const filteredEquipment = filterBySearch(equipment);
      setEquipment(filteredEquipment);
    }
  }, [searchTerm]);

  // ฟังก์ชันกรองอุปกรณ์ตามคำค้นหา
  const filterBySearch = (items) => {
    if (!searchTerm) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // หมวดหมู่ต่าง ๆ
  const categories = ["กล้อง", "เลนส์", "ขาตั้งกล้อง", "ไฟสำหรับถ่ายทำ", "อุปกรณ์ด้านเสียง", "อุปกรณ์จัดแสง", "อุปกรณ์อื่นๆ"];

  // กรองอุปกรณ์ตามหมวดหมู่และคำค้นหา
  const filteredEquipment = categories.map((category) => {
    return {
      category,
      items: filterBySearch(equipment.filter((item) => item.category === category)),
    };
  });

  // กรองข้อมูลที่เลือก
  const selectedCategoryItems = selectedCategory
    ? filterBySearch(
      filteredEquipment.find((categoryData) => categoryData.category === selectedCategory)?.items || []
    )
    : [];

  // กรองรายการที่มีชื่อไม่ซ้ำกัน
  const getUniqueItems = (items) => {
    const seen = new Set();
    return items.filter((item) => {
      const duplicate = seen.has(item.name);
      seen.add(item.name);
      return !duplicate;
    });
  };

  const handleViewAllClick = (typeId) => {
    navigate(`/equipment/${typeId}`);
  };

  return (
    <div className="equipment-list">
      <div className="header-category">
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
          {categories.map((category, index) => (
            <div className="category" key={index} onClick={() => setSelectedCategory(category)}>
              <div className={`image-box${index + 1}`}>
                <img src={category === "กล้อง" ? cameraIcon :
                          category === "เลนส์" ? lensIcon :
                          category === "ขาตั้งกล้อง" ? tripodIcon :
                          category === "ไฟสำหรับถ่ายทำ" ? lightIcon :
                          category === "อุปกรณ์ด้านเสียง" ? audioIcon :
                          category === "อุปกรณ์จัดแสง" ? lightEquipmentIcon :
                          otherIcon} alt={category} />
              </div>
              <p className="category-text">{category}</p>
            </div>
          ))}
          <div className="category" onClick={() => window.location.reload()}>
            <div className="image-box8">
              <img src={All} alt="อุปกรณ์อื่นๆ" />
            </div>
            <p className="category-text">ทั้งหมด</p>
          </div>
        </div>

        {/* แสดงข้อมูลเฉพาะหมวดหมู่ที่มีอุปกรณ์ */}
        {selectedCategory ? (
          <div >
            <h1 style={{ textAlign: "center", margin: "110px 0 0 0" }}>{selectedCategory}</h1>
            <div className="equipment-container">
              {getUniqueItems(selectedCategoryItems).length > 0 ? (
                getUniqueItems(selectedCategoryItems).slice(0, 8).map((item, idx) => (
                  <div className="card" style={{ width: "18rem", margin: "10px" }} key={idx}>
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
            // แสดงเฉพาะหมวดหมู่ที่มีอุปกรณ์
            categoryData.items.length > 0 && (
              <div key={index}>
                <h1>{categoryData.category}</h1>
                <div className="equipment-container">
                  {getUniqueItems(categoryData.items).length > 0 ? (
                    getUniqueItems(categoryData.items).slice(0, 8).map((item, idx) => (
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
            )
          ))
        )}
      </div>
    </div>
  );
};

export default DisplayEquipment;
