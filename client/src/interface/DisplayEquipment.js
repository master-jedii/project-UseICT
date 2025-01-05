import React, { useState } from 'react';
import Axios from 'axios';
import '../View/DisplayEquipment.css'
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

      <div className='header-category'>
        <h1>กล้อง</h1>

        

      </div>

    </div>
  );
};

export default DisplayEquipment;
