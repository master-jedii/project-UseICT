import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateTypeId = () => {
  const [typeIds, setTypeIds] = useState([]);
  const [newTypeId, setNewTypeId] = useState('');
  const [editingTypeId, setEditingTypeId] = useState(null); // ใช้เพื่อระบุว่าเรากำลังแก้ไข type_id ใด
  const [message, setMessage] = useState('');

  // ดึงข้อมูล type_id จาก API
  useEffect(() => {
    const fetchTypeIds = async () => {
      try {
        const response = await axios.get('http://localhost:3333/admin/showtypeid');
        setTypeIds(response.data); // เก็บข้อมูล type_id ใน state
      } catch (error) {
        setMessage('ไม่สามารถดึงข้อมูล type_id');
      }
    };

    fetchTypeIds();
  }, []);

  // ฟังก์ชันสำหรับเริ่มต้นการแก้ไข
  const handleEdit = (typeId) => {
    setEditingTypeId(typeId);
  };

  // ฟังก์ชันสำหรับยืนยันการอัปเดต type_id
  const handleUpdate = async (typeId) => {
    try {
      const response = await axios.put('http://localhost:3333/admin/updatetypeid', {
        oldTypeId: typeId, // type_id ที่ต้องการอัปเดต
        newTypeId,
      });

      if (response.status === 200) {
        setMessage('อัปเดต type_id สำเร็จ');
        setEditingTypeId(null); // ปิดโหมดแก้ไข
        setNewTypeId('');
        // รีเฟรชข้อมูลจากเซิร์ฟเวอร์
        const result = await axios.get('http://localhost:3333/admin/showtypeid');
        setTypeIds(result.data);
      } else {
        setMessage('เกิดข้อผิดพลาด');
      }
    } catch (error) {
      setMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์');
    }
  };

  return (
    <div>
      <h1>อัปเดต Type ID</h1>
      {message && <p>{message}</p>}
      <table border="1">
        <thead>
          <tr>
            <th>Type Serial</th>
            <th>Type ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {typeIds.map((item) => (
            <tr key={item.type_id}>
              <td>{item.type_serial}</td>
              <td>
                {editingTypeId === item.type_id ? (
                  <input
                    type="text"
                    value={newTypeId}
                    onChange={(e) => setNewTypeId(e.target.value)}
                  />
                ) : (
                  item.type_id
                )}
              </td>
              <td>
                {editingTypeId === item.type_id ? (
                  <button onClick={() => handleUpdate(item.type_id)}>อัปเดต</button>
                ) : (
                  <button onClick={() => handleEdit(item.type_id)}>แก้ไข</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpdateTypeId;
