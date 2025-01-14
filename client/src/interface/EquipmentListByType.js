import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import Showborrow from './showborrow';

const EquipmentListByType = () => {
  const { typeId } = useParams(); // ดึง type_id จาก URL
  const [equipment, setEquipment] = useState([]);

  // ฟังก์ชันดึงข้อมูลอุปกรณ์ตาม type_id
  useEffect(() => {
    Axios.get(`http://localhost:3333/showequipment/type/${typeId}`)
      .then((response) => {
        setEquipment(response.data);
      })
      .catch((err) => console.error(err));
  }, [typeId]);

  return (
    <div className="equipment-list">
      <h2>อุปกรณ์ทั้งหมดในหมวดหมู่ {typeId}</h2>
      <div className="equipment-cards">
        {equipment.map((item) => (
          <div key={item.id} className="card">
            <div className="card-body">
              <h5 className="card-title">{item.name}</h5>
              <p className="card-text">{item.description}</p>
              <Showborrow></Showborrow>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentListByType;
