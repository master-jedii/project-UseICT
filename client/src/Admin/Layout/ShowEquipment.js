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
  const [historyData, setHistoryData] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
  const [newDefect, setNewDefect] = useState({
    defect_details: '',
    image: null,
    imagePreview: null,
  });
  useEffect(() => {
    console.log("🔄 selectedEquipmentId updated:", selectedEquipmentId);
  }, [selectedEquipmentId]);
  

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    status: '',
    type_id: '',
    image: null,
    imagePreview: null,
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  
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
  
    if (formData.image) {
      updateData.append('image', formData.image); // ต้องเพิ่มตรงนี้
    }
  
    console.log("📤 ส่งข้อมูลไปอัปเดต:", [...updateData.entries()]); // ตรวจสอบข้อมูลที่ถูกส่ง
  
    axios.put(`http://localhost:3333/api/equipments/${editingEquipment.equipment_id}`, updateData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        console.log('✅ Update success:', response.data);
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error('❌ Error updating equipment:', error);
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
  
  const fetchDefectReports = (equipmentId) => {
    console.log(`📢 Fetching defect reports for equipment ID: ${equipmentId}`);
  
    setSelectedEquipmentId(equipmentId); // ✅ กำหนดค่า ID อุปกรณ์ก่อน
    console.log(`✅ Set selectedEquipmentId: ${equipmentId}`);
  
    setTimeout(() => { // ✅ ใช้ setTimeout เพื่อให้ state อัปเดตก่อนเรียก API
      axios.get(`http://localhost:3333/api/defect-reports/${equipmentId}`)
        .then((response) => {
          console.log('✅ Defect Reports Data:', response.data);
          setHistoryData(response.data);
          setIsHistoryModalOpen(true);
        })
        .catch((error) => {
          console.error('❌ Error fetching defect reports:', error);
          setHistoryData([]);
          setIsHistoryModalOpen(true);
        });
    }, 50);
  };
  
  
  
  
  const handleDefectFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setNewDefect((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    } else {
      setNewDefect((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDefectSubmit = (e) => {
    e.preventDefault();
  
    if (!selectedEquipmentId) {
      alert("❌ กรุณาเลือกอุปกรณ์ก่อนเพิ่มตำหนิ!");
      return;
    }
  
    const defectData = new FormData();
    defectData.append("equipment_id", selectedEquipmentId);
    defectData.append("defect_details", newDefect.defect_details);
    if (newDefect.image) {
      defectData.append("image", newDefect.image); // ✅ ส่งไปยัง defect_images
    }
  
    axios
      .post("http://localhost:3333/api/defect-reports", defectData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        setHistoryData([...historyData, response.data]);
        setNewDefect({ defect_details: "", image: null, imagePreview: null });
      })
      .catch((error) => {
        console.error("❌ Error inserting defect report:", error);
      });
  };
  
  
  
  
  

  const handleDeleteDefect = (reportId) => {
    console.log(`🗑️ ลบตำหนิที่ report_id: ${reportId}`); // Debugging
  
    if (!window.confirm("⚠️ คุณแน่ใจหรือไม่ว่าต้องการลบตำหนินี้?")) return;
  
    axios.delete(`http://localhost:3333/api/defect-reports/${reportId}`)
      .then((response) => {
        console.log(`✅ ลบสำเร็จ: ${response.data.message}`);
  
        // อัปเดต state โดยการกรองเอาตำหนิที่ลบออก
        setHistoryData(prevHistory => prevHistory.filter((report) => report.report_id !== reportId));
      })
      .catch((error) => {
        console.error('❌ Error deleting defect report:', error);
        alert('❌ ไม่สามารถลบตำหนิได้');
      });
  };
  
  

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEquipments = filteredEquipments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEquipments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
        {currentEquipments.map((item) => (
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
              <p><span>รหัสรุ่นอุปกรณ์:</span> {getSerialTypeName(item.type_id)}</p>
            </div>
            <div className="equipment-actions">
              <button onClick={() => handleUpdateClick(item)} className="update-btn">Update</button>
              <button onClick={() => handleDeleteClick(item.equipment_id)} className="delete-btn">Delete</button>
              <button onClick={() => fetchDefectReports(item.equipment_id)} className="history-btn">เช็คตำหนิ</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination buttons */}
      <div className="pagination-showeq">
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number + 1}
            onClick={() => handlePageChange(number + 1)}
            className={currentPage === number + 1 ? 'active' : ''}
          >
            {number + 1}
          </button>
        ))}
      </div>

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

  {/* เพิ่มช่องอัปโหลดภาพ */}
  <label>อัปโหลดภาพ:</label>
  <input type="file" name="image" accept="image/*" onChange={handleFormChange} />

  {/* แสดงตัวอย่างรูปภาพที่อัปโหลด หรือรูปภาพเดิม */}
  {formData.imagePreview ? (
    <img src={formData.imagePreview} alt="Preview" className="image-preview" />
  ) : (
    editingEquipment?.image && (
      <img src={`http://localhost:3333/uploads/${editingEquipment.image}`} alt="Existing" className="image-preview" />
    )
  )}

  <button type="submit" className="save-btn">บันทึก</button>
  <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn">ยกเลิก</button>
</form>
          </div>
        </div>
      )}

{isHistoryModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>ประวัติตำหนิอุปกรณ์</h2>

            {/* ฟอร์มเพิ่มตำหนิ */}
            <form onSubmit={handleDefectSubmit}>
              <label>รายละเอียดตำหนิ:</label>
              <input type="text" name="defect_details" value={newDefect.defect_details} onChange={handleDefectFormChange} required />

              <label>อัปโหลดรูปภาพ:</label>
              <input type="file" name="image" accept="image/*" onChange={handleDefectFormChange} />
              {newDefect.imagePreview && <img src={newDefect.imagePreview} alt="Preview" className="image-preview" />}

              <button type="submit" className="save-btn">เพิ่มตำหนิ</button>
            </form>

            {/* ตารางแสดงข้อมูลตำหนิ */}
            {historyData.length > 0 ? (
              <table className="defect-table">
                <thead>
                  <tr>
                    <th>วันที่บันทึก</th>
                    <th>รายละเอียดตำหนิ</th>
                    <th>รูปภาพ</th>
                    <th>ลบ</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((report) => (
                    <tr key={report.report_id}>
                      <td>{new Date(report.created_at).toLocaleDateString('th-TH')}</td>
                      <td>{report.defect_details}</td>
                      <td>
                        {report.image_paths && report.image_paths.length > 0 ? (
                          <img src={`http://localhost:3333/uploads/${report.image_paths[0]}`} alt="ตำหนิอุปกรณ์" className="defect-img" />
                        ) : "ไม่มีภาพ"}
                      </td>
                      <td>
                        <button onClick={() => handleDeleteDefect(report.report_id)} className="delete-btn">ลบ</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>❌ ไม่มีข้อมูลตำหนิอุปกรณ์</p>
            )}

            <button onClick={() => setIsHistoryModalOpen(false)} className="close-btn">ปิด</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowEquipment;