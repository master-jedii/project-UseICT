import React, { useState } from 'react';
import Axios from 'axios';

const DisplayEquipment = () => {
  const [equipment, setEquipment] = useState([]);

  // ฟังก์ชันดึงข้อมูลอุปกรณ์
  const getEquipment = () => {
    Axios.get("http://localhost:3333/admin")
      .then((response) => {
        setEquipment(response.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="equipment-list">
      <button className="btn btn-primary" onClick={getEquipment}>
        แสดงอุปกรณ์
      </button>
      <hr />
      {equipment.map((val, key) => (
        <div className="equipment card" key={key}>
          <div className="card-body">
            {val.image && (
              <img
                src={`http://localhost:3333/uploads/${val.image}`}
                alt={val.name}
                style={{ width: "100%", maxWidth: "500px", height: "auto", marginBottom: "15px" }}
              />
            )}
            <p>Equipment ID: {val.equipment_id}</p>
            <p>ชื่ออุปกรณ์: {val.name}</p>
            <p>รายละเอียด: {val.description}</p>
            <p>หมวดหมู่: {val.category}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisplayEquipment;
