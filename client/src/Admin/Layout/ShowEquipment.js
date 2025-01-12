import React, { useEffect, useState } from 'react';
import '../CSS/ShowEquipment.css';
import axios from 'axios';

const ShowEquipment = () => {
  const [equipments, setEquipments] = useState([]); // เก็บข้อมูลทั้งหมดของอุปกรณ์
  const [filteredEquipments, setFilteredEquipments] = useState([]); // เก็บข้อมูลที่กรองตามหมวดหมู่
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด'); // หมวดหมู่ที่เลือก
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image: null,
    imagePreview: null,  // สำหรับเก็บตัวอย่างภาพ
  });

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

  const handleUpdateClick = (equipment) => {
    setEditingEquipment(equipment);
    setFormData({
      name: equipment.name,
      description: equipment.description,
      category: equipment.category,
      image: null,
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const updateData = new FormData();
    updateData.append('name', formData.name);
    updateData.append('description', formData.description);
    updateData.append('category', formData.category);
    if (formData.image) updateData.append('image', formData.image);

    axios.put(`http://localhost:3333/api/equipments/${editingEquipment.equipment_id}`, updateData)
      .then((response) => {
        const updatedEquipments = equipments.map((item) =>
          item.equipment_id === editingEquipment.equipment_id ? response.data : item
        );
        setEquipments(updatedEquipments);
        setFilteredEquipments(updatedEquipments);
        setIsModalOpen(false);
      })
      .catch((error) => console.error('Error updating equipment:', error));
  };

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



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        image: file,
        imagePreview: URL.createObjectURL(file), // สร้าง URL สำหรับตัวอย่างรูปภาพ
      }));
    }
  };


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
                <button onClick={() => handleUpdateClick(item)} className="update-btn">
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

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2 className='showModal'>Update Equipment</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>
                  ชื่ออุปกรณ์:
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </label>
              </div>

              <div className="form-group">
                <label>
                  รายละเอียด:
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    required
                  />
                </label>
              </div>

              <div className="form-group">
                <label>
                  หมวดหมู่:
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    <option value="กล้อง">กล้อง</option>
                    <option value="เลนส์">เลนส์</option>
                    <option value="ขาตั้งกล้อง">ขาตั้งกล้อง</option>
                    <option value="ไฟสำหรับถ่ายทำ">ไฟสำหรับถ่ายทำ</option>
                    <option value="อุปกรณ์ด้านเสียง">อุปกรณ์ด้านเสียง</option>
                    <option value="อุปกรณ์จัดแสง">อุปกรณ์จัดแสง</option>
                    <option value="อุปกรณ์อื่นๆ">อุปกรณ์อื่นๆ</option>
                  </select>
                </label>
              </div>

              <div className="form-group">
                <label>
                  เลือกรูปภาพ:
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                  />
                </label>
                {formData.imagePreview && (
                  <div className="image-preview">
                    <img src={formData.imagePreview} alt="Image preview" />
                  </div>
                )}
              </div>

              

              <div className="button-group">
                <button type="submit" className="save-btn">บันทึก</button>
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default ShowEquipment;
