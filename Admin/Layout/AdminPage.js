import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EquipmentModal from "./EquipmentModal";
import "./AdminPage.css";


const AdminPage = () => {
  const navigate = useNavigate(); // ใช้สำหรับเปลี่ยนหน้า
  const [equipmentList, setEquipmentList] = useState([
    { id: 1, name: "คอมพิวเตอร์", model: "ACER", quantity: 10, details: "...", status: "พร้อมใช้งาน" },
    { id: 2, name: "กล้อง", model: "CANON", quantity: 5, details: "พร้อมเลนส์", status: "กำลังใช้งาน" },
    { id: 3, name: "โปรเจคเตอร์", model: "EPSON", quantity: 2, details: "มีรีโมท", status: "ชำรุด" },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleOpenModal = (data = null) => {
    setEditData(data);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditData(null);
  };

  const handleSave = (newData) => {
    if (editData) {
      setEquipmentList((prevList) =>
        prevList.map((item) =>
          item.id === editData.id ? { ...item, ...newData } : item
        )
      );
    } else {
      setEquipmentList((prevList) => [
        ...prevList,
        { id: prevList.length + 1, ...newData },
      ]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("คุณต้องการลบอุปกรณ์นี้หรือไม่?");
    if (confirmDelete) {
      setEquipmentList((prevList) => prevList.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="admin-container">
      <div className="sidebar">
        <img src="/LOGO.png" alt="Logo" className="LOGO.png" />
        <h2 className="sidebar-title">SU Kits</h2>
        <ul className="sidebar-menu">
          <li><i className="fas fa-tools"></i> บันทึกและแก้ไขอุปกรณ์</li>
          <li><i className="fas fa-undo-alt"></i> อนุมัติการคืน</li>
          <li><i className="fas fa-hand-holding"></i> อนุมัติการยืม</li>
          <li onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
            <i className="fas fa-chart-bar"></i> สถิติการยืมคืน
          </li>
        </ul>
      </div>

      <div className="main-content">
        <div className="header">
          <h1>รายการอุปกรณ์</h1>
          <div className="actions">
            <button className="btn btn-blue" onClick={() => handleOpenModal()}>
              เพิ่มอุปกรณ์
            </button>
          </div>
        </div>

        <table className="equipment-table">
          <thead>
            <tr>
              <th>ลำดับที่</th>
              <th>ชื่ออุปกรณ์</th>
              <th>รุ่น</th>
              <th>จำนวน</th>
              <th>รายละเอียด</th>
              <th>สถานะ</th>
              <th>การกระทำ</th>
            </tr>
          </thead>
          <tbody>
            {equipmentList.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.model}</td>
                <td>{item.quantity}</td>
                <td>{item.details}</td>
                <td className={`status ${item.status === "ชำรุด" ? "danger" : item.status === "กำลังใช้งาน" ? "warning" : "success"}`}>
                  {item.status}
                </td>
                <td>
                  <button
                    className="btn btn-green"
                    onClick={() => handleOpenModal(item)}
                  >
                    แก้ไข
                  </button>
                  <button
                    className="btn btn-red"
                    onClick={() => handleDelete(item.id)}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <EquipmentModal
          onClose={handleCloseModal}
          onSave={handleSave}
          editData={editData}
        />
      )}
    </div>
  );
};

export default AdminPage;
