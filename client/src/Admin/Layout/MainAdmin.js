import React, { useState, useEffect } from 'react';
import '../CSS/MainAdmin.css';
import '../CSS/NavbarAdmin.css';
import Axios from 'axios';
import ShowEquipment from './ShowEquipment';
import NavbarAdmin from './NavbarAdmin';

const MainAdmin = () => {
  const [showModal, setShowModal] = useState(false);
  const [equipments, setEquipments] = useState([
    { name: '', description: '', category: '', image: null, imagePreview: null, status: '', type_id: '' },
  ]);
  const [serialTypes, setSerialTypes] = useState([]); // สำหรับเก็บประเภทอุปกรณ์จากฐานข้อมูล

  // ฟังก์ชันเพื่อดึงข้อมูลจาก API ที่คุณได้สร้างไว้
  useEffect(() => {
    Axios.get('http://localhost:3333/api/serialtypes') // ปรับ URL ให้ตรงกับ API ของคุณ
      .then((response) => {
        setSerialTypes(response.data); // เก็บข้อมูลประเภทอุปกรณ์ใน state
      })
      .catch((error) => {
        console.error('Error fetching serial types:', error);
      });
  }, []);

  // เปิด/ปิด Modal
  const toggleModal = () => {
    setShowModal(!showModal);
    setEquipments([{ name: '', description: '', category: '', image: null, imagePreview: null, status: '', type_id: '' }]);
  };

  // ฟังก์ชันเพิ่มอุปกรณ์ในรายการ
  const addEquipmentField = () => {
    setEquipments([...equipments, { name: '', description: '', category: '', image: null, imagePreview: null, status: '', type_id: '' }]);
  };

  // ฟังก์ชันลบอุปกรณ์จากรายการ
  const removeEquipmentField = (index) => {
    const updatedEquipments = equipments.filter((_, i) => i !== index);
    setEquipments(updatedEquipments);
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลงของฟิลด์
  const handleFieldChange = (index, field, value) => {
    const updatedEquipments = [...equipments];
    updatedEquipments[index][field] = value;
    setEquipments(updatedEquipments);
  };

  // ฟังก์ชันสำหรับแสดงตัวอย่างรูปภาพ
  const handleImageChange = (index, file) => {
    const updatedEquipments = [...equipments];
    updatedEquipments[index].image = file;
    updatedEquipments[index].imagePreview = URL.createObjectURL(file); // แสดงตัวอย่างภาพ
    setEquipments(updatedEquipments);
  };

  // ฟังก์ชันส่งข้อมูลไปยังเซิร์ฟเวอร์
  const submitEquipments = (e) => {
    e.preventDefault();
    const promises = equipments.map((equipment) => {
      const formData = new FormData();
      formData.append('name', equipment.name);
      formData.append('description', equipment.description);
      formData.append('category', equipment.category);
      formData.append('status', equipment.status);
      formData.append('image', equipment.image);
      formData.append('type_id', equipment.type_id); // ส่งค่า type_id
      return Axios.post('http://localhost:3333/create', formData);
    });

    Promise.all(promises)
      .then(() => {
        alert('เพิ่มอุปกรณ์ทั้งหมดเรียบร้อย!');
        toggleModal();
      })
      .catch((err) => {
        console.error(err);
        alert('เกิดข้อผิดพลาดในการเพิ่มอุปกรณ์');
      });
  };

  return (
    <div className="admin-dashboard">
      <NavbarAdmin />

      <div className="main-content">
        <header className="admin-header">
          <div className="admin-header-info">
            <h1>รายการอุปกรณ์</h1>
          </div>
        </header>

        {/* ปุ่มสำหรับเปิด Modal */}
        <button className="btn btn-primary" onClick={toggleModal}>
          <i className="fas fa-tools" style={{ marginRight: '10px' }}></i>
          เพิ่มอุปกรณ์
        </button>

        <ShowEquipment />

        {/* Modal สำหรับกรอกข้อมูล */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={toggleModal}>
                &times;
              </span>
              <h2 className="text-headadd">เพิ่มอุปกรณ์</h2>
              <form onSubmit={submitEquipments}>
                {equipments.map((equipment, index) => (
                  <div key={index} className="equipment-group">
                    <label>ชื่ออุปกรณ์:</label>
                    <input
                      type="text"
                      value={equipment.name}
                      onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                      required
                    />
                    <label>รายละเอียด:</label>
                    <input
                      type="text"
                      value={equipment.description}
                      onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                      required
                    />
                    <label>หมวดหมู่:</label>
                    <select
                      value={equipment.category}
                      onChange={(e) => handleFieldChange(index, 'category', e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        เลือกหมวดหมู่
                      </option>
                      <option value="กล้อง">กล้อง</option>
                      <option value="เลนส์">เลนส์</option>
                      <option value="ขาตั้งกล้อง">ขาตั้งกล้อง</option>
                      <option value="ไฟสำหรับถ่ายทำ">ไฟสำหรับถ่ายทำ</option>
                      <option value="อุปกรณ์ด้านเสียง">อุปกรณ์ด้านเสียง</option>
                      <option value="อุปกรณ์จัดแสง">อุปกรณ์จัดแสง</option>
                      <option value="อุปกรณ์อื่นๆ">อุปกรณ์อื่นๆ</option>
                    </select>
                    <label>สถานะ:</label>
                    <select
                      value={equipment.status}
                      onChange={(e) => handleFieldChange(index, 'status', e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        เลือกสถานะ
                      </option>
                      <option value="พร้อมใช้งาน">พร้อมใช้งาน</option>
                      <option value="ไม่พร้อมใช้งาน">ไม่พร้อมใช้งาน</option>
                      <option value="อยู่ในระหว่างการใช้งาน">อยู่ในระหว่างการใช้งาน</option>
                      <option value="ซ่อมบำรุง">ซ่อมบำรุง</option>
                    </select>
                    <label>ประเภทอุปกรณ์ (type_id):</label>
                    <select
                      value={equipment.type_id}
                      onChange={(e) => handleFieldChange(index, 'type_id', e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        เลือกประเภทอุปกรณ์
                      </option>
                      {serialTypes.map((serialType) => (
                        <option key={serialType.type_id} value={serialType.type_id}>
                          {serialType.type_id}{serialType.type_serial}
                        </option>
                      ))}
                    </select>
                    <label>เลือกรูปภาพ:</label>
                    <input
                      type="file"
                      onChange={(e) => handleImageChange(index, e.target.files[0])}
                      required
                    />
                    {equipment.imagePreview && (
                      <div className="image-preview">
                        <img src={equipment.imagePreview} alt="Preview" width="200" height="200" />
                      </div>
                    )}
                    <button type="button" className="btn-danger" onClick={() => removeEquipmentField(index)}>
                      ลบ
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addEquipmentField}>
                  เพิ่มรายการใหม่
                </button>
                <button type="submit" className="btn btn-success">
                  เพิ่มอุปกรณ์ทั้งหมด
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainAdmin;
