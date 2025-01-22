import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarAdmin from './NavbarAdmin';
import '../CSS/UpdataTypeid.css';

const UpdateTypeId = () => {
    const [typeIds, setTypeIds] = useState([]);
    const [equipment, setEquipment] = useState([]); // เพิ่ม state สำหรับอุปกรณ์
    const [editingData, setEditingData] = useState(null);
    const [showSerialModal, setShowSerialModal] = useState(false);
    const [newSerial, setNewSerial] = useState({ type_serial: '', type_id: '' });

    // ดึงข้อมูล Type IDs
    useEffect(() => {
        const fetchTypeIds = async () => {
            try {
                const response = await axios.get('http://localhost:3333/admin/showtypeid');
                setTypeIds(response.data);
            } catch (error) {
                console.error('Error fetching type IDs:', error);
            }
        };

        fetchTypeIds();
    }, []);

    // ดึงข้อมูลอุปกรณ์ทั้งหมดสำหรับทุกๆ typeId ทันที
    useEffect(() => {
        const fetchAllEquipment = async () => {
            try {
                const response = await axios.get('http://localhost:3333/showequipment');
                setEquipment(response.data); // ตั้งค่าข้อมูลอุปกรณ์
            } catch (error) {
                console.error('Error fetching equipment:', error);
            }
        };

        fetchAllEquipment();
    }, []);

    const handleEdit = (item) => {
        setEditingData({ ...item });
    };

    const toggleSerialModal = () => {
        setShowSerialModal((prev) => !prev);
        setNewSerial({ type_serial: '', type_id: '' });
    };

    const handleUpdate = async () => {
        if (!editingData.new_type_id || !editingData.type_serial) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }
    
        try {
            const response = await axios.put('http://localhost:3333/admin/updatetypeid', {
                oldTypeId: editingData.type_id,
                newTypeId: editingData.new_type_id,
                typeSerial: editingData.type_serial,  // ส่ง type_serial ด้วย
            });
    
            if (response.status === 200) {
                alert('บันทึกสำเร็จ');
                setEditingData(null);
    
                // ดึงข้อมูลใหม่
                const result = await axios.get('http://localhost:3333/admin/showtypeid');
                setTypeIds(result.data);
            }
        } catch (error) {
            console.error('Error updating type ID:', error);
            alert('ไม่สามารถอัปเดตข้อมูลได้');
        }
    };
    

    const submitSerial = async () => {
        if (!newSerial.type_serial || !newSerial.type_id) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        try {
            await axios.post('http://localhost:3333/api/addserial', newSerial);
            alert('เพิ่มรหัสอุปกรณ์เรียบร้อย!');
            toggleSerialModal();

            // ดึงข้อมูลใหม่
            const result = await axios.get('http://localhost:3333/admin/showtypeid');
            setTypeIds(result.data);
        } catch (error) {
            console.error('Error adding new serial:', error);
            alert('ไม่สามารถเพิ่มรหัสอุปกรณ์ได้');
        }
    };

    const handleDelete = async (typeId) => {
        if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรหัสอุปกรณ์นี้?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:3333/admin/deletetypeid/${typeId}`);
            alert('ลบรหัสอุปกรณ์สำเร็จ');

            // ดึงข้อมูลใหม่
            const result = await axios.get('http://localhost:3333/admin/showtypeid');
            setTypeIds(result.data);
        } catch (error) {
            console.error('Error deleting type ID:', error);
            alert('ไม่สามารถลบรหัสประจำอุปกรณ์ได้ เนื่องจากมีอุปกรณ์ที่ใช้งานรหัสนี้อยู่แล้ว');
        }
    };

    return (
        <div className="admin-dashboard">
            <NavbarAdmin />

            <div className="admin-dashboard-typeid">
                <header className="admin-header-info-typeid" style={{display:'flex' , alignItems : 'center' , gap :'10px'}}>
                    <i className="fas fa-tools" style={{fontSize : '20px'}}></i>
                    <h1 style={{ textAlign: 'left' }}>รหัสอุปกรณ์</h1>
                </header>

                <button className=" admin-save-type-id" onClick={toggleSerialModal}>
                    เพิ่มรหัสประจำอุปกรณ์
                </button>

                <div className="container-admin-typeid">
                    <table className="table-typeid">
                        <thead>
                            <tr>
                                <th>รหัสอุปกรณ์</th>
                                <th>ชื่ออุปกรณ์</th>
                                <th>เลขครุภัณฑ์</th> {/* เพิ่มคอลัมน์ใหม่ */}
                                <th>การกระทำ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {typeIds.map((item) => (
                                <tr key={item.type_id}>
                                    <td>{item.type_id}</td>
                                    <td>{item.type_serial}</td>
                                    <td className='equipment-type-id'>
                                        {/* แสดงอุปกรณ์ตาม type_id ที่ตรงกัน */}
                                        {equipment
                                
                                            .filter((equip) => equip.type_id === item.type_id)
                                            .map((equip) => (
                                                <p key={equip.equipment_id}>
                                                    {equip.equipment_id} 
                                                </p>
                                            ))}
                                    </td>
                                    <td>
                                        <button
                                            className="button-typeid-update"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="button-typeid button-delete-typeid"
                                            onClick={() => handleDelete(item.type_id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {editingData && (
                    <div className="modal-typeid">
                        <div className="modal-content-typeid">
                            <h2>แก้ไขรหัสประจำอุปกรณ์</h2>
                            
                            <label>
                                รหัสประจำอุปกรณ์ (ใหม่):
                                <input
                                    type="text"
                                    value={editingData.new_type_id || ''}
                                    onChange={(e) =>
                                        setEditingData({ ...editingData, new_type_id: e.target.value })
                                    }
                                />
                            </label>
                            <label>
                                ชื่อรหัสประจำอุปกรณ์ (ใหม่):
                                <input
                                    type="text"
                                    value={editingData.type_serial|| ''}
                                    onChange={(e) =>
                                        setEditingData({ ...editingData, type_serial: e.target.value })
                                    }
                                />
                            </label>
                            <div className="modal-actions-typeid">
                                <button className="button-typeid" onClick={handleUpdate}>
                                    อัปเดต
                                </button>
                                <button
                                    className=" button-cancel-typeid "
                                    onClick={() => setEditingData(null)}
                                >
                                    ยกเลิก
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showSerialModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={toggleSerialModal}>
                            &times;
                        </span>
                        <h2>เพิ่มรหัสประจำอุปกรณ์</h2>
                        <label>รหัสอุปกรณ์</label>
                        <input
                            type="text"
                            value={newSerial.type_id}
                            onChange={(e) =>
                                setNewSerial({ ...newSerial, type_id: e.target.value })
                            }
                        />
                        <label>ชื่อรหัสประจำอุปกรณ์</label>
                        <input
                            type="text"
                            value={newSerial.type_serial}
                            onChange={(e) =>
                                setNewSerial({ ...newSerial, type_serial: e.target.value })
                            }
                        />
                       
                        <button onClick={submitSerial}>บันทึก</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateTypeId;
