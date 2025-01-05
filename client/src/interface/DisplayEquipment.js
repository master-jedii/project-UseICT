import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../View/DisplayEquipment.css';
import logo from '../assets/BGhowto.png';

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

  // กรองข้อมูลเฉพาะหมวดหมู่ "กล้อง"
  const filteredEquipment = equipment.filter(
    (item) => item.category === "กล้อง"
  );

  return (
    <div className="equipment-list">
      <div className="header-category">
        <h1>กล้อง</h1>

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
            <p>ไม่มีข้อมูลในหมวดหมู่ "กล้อง"</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayEquipment;
