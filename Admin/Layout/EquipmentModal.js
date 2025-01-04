import React, { useState, useEffect } from "react";
import "./EquipmentModal.css";

const EquipmentModal = ({ onClose, onSave, editData }) => {
  const [equipmentData, setEquipmentData] = useState({
    name: "",
    model: "",
    quantity: 0,
    details: "",
    status: "พร้อมใช้งาน", // Default status
  });

  useEffect(() => {
    if (editData) {
      setEquipmentData(editData); // Load data when editing
    }
  }, [editData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEquipmentData({
      ...equipmentData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(equipmentData);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{editData ? "แก้ไขอุปกรณ์" : "เพิ่มอุปกรณ์"}</h2>
        <form onSubmit={handleSubmit}>
          <label>ชื่ออุปกรณ์:</label>
          <input
            type="text"
            name="name"
            placeholder="กรอกชื่ออุปกรณ์"
            value={equipmentData.name}
            onChange={handleInputChange}
          />

          <label>รุ่น:</label>
          <input
            type="text"
            name="model"
            placeholder="กรอกรุ่นอุปกรณ์"
            value={equipmentData.model}
            onChange={handleInputChange}
          />

          <label>จำนวน:</label>
          <input
            type="number"
            name="quantity"
            placeholder="กรอกจำนวน"
            value={equipmentData.quantity}
            onChange={handleInputChange}
          />

          <label>รายละเอียดเพิ่มเติม:</label>
          <textarea
            name="details"
            placeholder="กรอกรายละเอียด"
            value={equipmentData.details}
            onChange={handleInputChange}
          />

          <label>สถานะ:</label>
          <select
            name="status"
            value={equipmentData.status}
            onChange={handleInputChange}
          >
            <option value="พร้อมใช้งาน">พร้อมใช้งาน</option>
            <option value="กำลังใช้งาน">กำลังใช้งาน</option>
            <option value="ชำรุด">ชำรุด</option>
          </select>

          <button type="submit" className="btn btn-blue">
            บันทึก
          </button>
          <button type="button" className="btn btn-red" onClick={onClose}>
            ยกเลิก
          </button>
        </form>
      </div>
    </div>
  );
};

export default EquipmentModal;
