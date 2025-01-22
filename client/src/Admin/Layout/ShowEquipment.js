import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/ShowEquipment.css';

const ShowEquipment = () => {
  const [equipments, setEquipments] = useState([]);
  const [filteredEquipments, setFilteredEquipments] = useState([]);
  const [serialTypes, setSerialTypes] = useState([]); // Store serial types
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [searchTerm, setSearchTerm] = useState(''); // State for the search bar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    status: '',
    type_id: '',
    image: null,
    imagePreview: null,
  });

  useEffect(() => {
    axios.get(`http://localhost:3333/showequipment?category=${selectedCategory}`)
      .then((response) => {
        setEquipments(response.data);
        setFilteredEquipments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Fetch serial types from the API
    axios.get('http://localhost:3333/api/serialtypes')
      .then((response) => {
        setSerialTypes(response.data);
      })
      .catch((error) => {
        console.error('Error fetching serial types:', error);
      });
  }, [selectedCategory]);

  const getSerialTypeName = (typeId) => {
    const type = serialTypes.find((serialType) => serialType.type_id === typeId);
    return type ? type.type_serial : 'Unknown';
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = equipments.filter(
      (equipment) =>
        equipment.name.toLowerCase().includes(value) ||
        equipment.description.toLowerCase().includes(value)
    );
    setFilteredEquipments(filtered);
  };

  const handleUpdateClick = (equipment) => {
    setEditingEquipment(equipment);
    setFormData({
      name: equipment.name,
      description: equipment.description,
      category: equipment.category,
      status: equipment.status,
      type_id: equipment.type_id,
      image: null,
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
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
    updateData.append('status', formData.status);
    updateData.append('type_id', formData.type_id);
    if (formData.image) updateData.append('image', formData.image);

    axios.put(`http://localhost:3333/api/equipments/${editingEquipment.equipment_id}`, updateData)
      .then(() => {
        const updatedEquipments = equipments.map((item) =>
          item.equipment_id === editingEquipment.equipment_id
            ? { ...item, ...formData }
            : item
        );
        setEquipments(updatedEquipments);
        setFilteredEquipments(updatedEquipments);
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error('Error updating equipment:', error);
        alert('เกิดข้อผิดพลาดในการอัปเดต');
      });
  };

  const handleDeleteClick = (id) => {
    axios.delete(`http://localhost:3333/api/equipments/${id}`)
      .then(() => {
        setEquipments(equipments.filter((item) => item.equipment_id !== id));
        setFilteredEquipments(filteredEquipments.filter((item) => item.equipment_id !== id));
      })
      .catch((error) => {
        console.error('Error deleting equipment:', error);
        alert('เกิดข้อผิดพลาดในการลบ');
      });
  };

  return (
    <div className="equipment-containerAdmin">
      <h1>รายการอุปกรณ์ทั้งหมด</h1>
      

      {/* Search bar */}
      <div className="search-bar-custom">
        <div className="search-input-container-custom">
          <i className="fas fa-search search-icon-custom"></i>
          <input
            type="text"
            placeholder="ค้นหา..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input-custom-admin "
          />
        </div>
      </div>


      <div className="category-buttons">
        {['ทั้งหมด', 'กล้อง', 'เลนส์', 'ขาตั้งกล้อง', 'ไฟสำหรับถ่ายทำ', 'อุปกรณ์ด้านเสียง', 'อุปกรณ์จัดแสง', 'อุปกรณ์อื่นๆ'].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className="category-btn"
          >
            {category}
          </button>
        ))}
      </div>

      <ul className="equipment-listAdmin">
        {filteredEquipments.map((item) => (
          <li key={item.equipment_id} className="equipment-item">
            <img
              src={`http://localhost:3333/uploads/${item.image}`}
              alt={item.name}
              className="equipment-info-img-1"
            />
            <div className="equipment-info-Showtext">
              <h2>{item.name}</h2>
              <p><span>รายละเอียด:</span> {item.description}</p>
              <p><span>สถานะ:</span> {item.status}</p>
              <p><span>รหัสประจำอุปกรณ์:</span> {getSerialTypeName(item.type_id)}</p>
            </div>
            <div className="equipment-actions">
              <button onClick={() => handleUpdateClick(item)} className="update-btn">Update</button>
              <button onClick={() => handleDeleteClick(item.equipment_id)} className="delete-btn">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>ปรับปรุงข้อมูลอุปกรณ์</h2>
            <form onSubmit={handleFormSubmit}>
              <label>ชื่ออุปกรณ์:</label>
              <input type="text" name="name" value={formData.name} onChange={handleFormChange} required />

              <label>รายละเอียด:</label>
              <textarea name="description" value={formData.description} onChange={handleFormChange} required />
              
              <label>หมวดหมู่:</label>
              <select name="category" value={formData.category} onChange={handleFormChange} required>
                <option value="">เลือกหมวดหมู่</option>
                <option value="กล้อง">กล้อง</option>
                <option value="เลนส์">เลนส์</option>
                <option value="ขาตั้งกล้อง">ขาตั้งกล้อง</option>
                <option value="ไฟสำหรับถ่ายทำ">ไฟสำหรับถ่ายทำ</option>
                <option value="อุปกรณ์ด้านเสียง">อุปกรณ์ด้านเสียง</option>
                <option value="อุปกรณ์จัดแสง">อุปกรณ์จัดแสง</option>
                <option value="อุปกรณ์อื่นๆ">อุปกรณ์อื่นๆ</option>
              </select>

              <label>สถานะ:</label>
              <select name="status" value={formData.status} onChange={handleFormChange} required>
                <option value="">เลือกสถานะ</option>
                <option value="พร้อมใช้งาน">พร้อมใช้งาน</option>
                <option value="ไม่พร้อมใช้งาน">ไม่พร้อมใช้งาน</option>
              </select>

              <label>Type:</label>
              <select name="type_id" value={formData.type_id} onChange={handleFormChange} required>
                <option value="">เลือกรหัสประจำอุปกรณ์</option>
                {serialTypes.map((serialType) => (
                  <option key={serialType.type_id} value={serialType.type_id}>
                    {serialType.type_serial}
                  </option>
                ))}
              </select>

              <label>เลือกภาพ:</label>
              <input type="file" name="image" onChange={handleFormChange} />
              {formData.imagePreview && <img src={formData.imagePreview} alt="Preview" className="image-preview" />}

              <button type="submit" className="save-btn">บันทึก</button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn">ยกเลิก</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowEquipment;
