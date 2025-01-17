import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarAdmin from './NavbarAdmin';
import '../CSS/UpdataTypeid.css'


const UpdateTypeId = () => {
  const [typeIds, setTypeIds] = useState([]);
  const [editingData, setEditingData] = useState(null);

  useEffect(() => {
    const fetchTypeIds = async () => {
      try {
        const response = await axios.get('http://localhost:3333/admin/showtypeid');
        setTypeIds(response.data);
      } catch (error) {
        console.error('ไม่สามารถดึงข้อมูล type_id:', error);
      }
    };

    fetchTypeIds();
  }, []);

  const handleEdit = (item) => {
    setEditingData(item);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put('http://localhost:3333/admin/updatetypeid', {
        oldTypeId: editingData.type_id,
        newTypeId: editingData.new_type_id,
        typeSerial: editingData.type_serial,
      });

      if (response.status === 200) {
        alert('บันทึกสำเร็จ');
        setEditingData(null);
        const result = await axios.get('http://localhost:3333/admin/showtypeid');
        setTypeIds(result.data);
      } else {
        alert('เกิดข้อผิดพลาด');
      }
    } catch (error) {
      alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์');
    }
  };

  return (
    <div className="admin-dashboard">
      <NavbarAdmin 
        
      />

      
      
    
     
      
      <div className='admin-dashboard-typeid'>

      <header className="admin-header">
             <div className="admin-header-info">
                    <h1>รายการอุปกรณ์</h1>
            </div>
        </header>
      
      <h1>อัปเดต Type ID</h1>
      <table className="table-typeid">
        <thead>
          <tr>
            
            <th>รหัสอุปกรณ์</th>
            <th>ชื่อรหัสอุปกรณ์</th>
            <th>การกระทำ</th>
          </tr>
        </thead>
        <tbody>
          {typeIds.map((item) => (
            <tr key={item.type_id}>
            <td>{item.type_id}</td>
              <td>{item.type_serial}</td>
              
              <td>
                <button
                  className="button-typeid"
                  onClick={() => handleEdit(item)}
                >
                  update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingData && (
        <div className="modal-typeid">
          <div className="modal-content-typeid">
            <h2>แก้ไข Type ID</h2>
            <label>
              Type Serial:
              <input
                type="text"
                value={editingData.type_serial}
                onChange={(e) =>
                  setEditingData({ ...editingData, type_serial: e.target.value })
                }
              />
            </label>
            <label>
              Type ID:
              <input
                type="text"
                value={editingData.new_type_id || editingData.type_id}
                onChange={(e) =>
                  setEditingData({ ...editingData, new_type_id: e.target.value })
                }
              />
            </label>
            <div className="modal-actions-typeid">
              <button className="button-typeid" onClick={handleUpdate}>
                อัปเดต
              </button>
              <button
                className="button-typeid button-cancel-typeid"
                onClick={() => setEditingData(null)}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
      
    </div>
  );
};

export default UpdateTypeId;
