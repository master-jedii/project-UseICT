import React, { useState } from 'react';
import '../interface/CSS/DisplayReturn.css';

const DisplayReturn = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // Default sorting by name
  const [filterStatus, setFilterStatus] = useState('');

  const equipmentList = [
    { id: 1, name: 'กล้องถ่ายรูป', status: 'กำลังใช้งาน', dueDate: '2025-01-25' },
    { id: 2, name: 'โปรเจคเตอร์', status: 'ใกล้ครบกำหนด', dueDate: '2025-01-23' },
    { id: 3, name: 'ไมโครโฟน', status: 'ครบกำหนดแล้ว', dueDate: '2025-01-20' },
    { id: 4, name: 'ไฟส่องสว่าง', status: 'กำลังใช้งาน', dueDate: '2025-01-30' },
  ];

  // Filter and Sort Logic
  const filteredList = equipmentList
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterStatus === '' || item.status === filterStatus)
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
      return 0;
    });

  return (
    <div className="DisplayReturn-container">
      <h1 className="DisplayReturn-title">กำหนดการคืนอุปกรณ์</h1>

      {/* Summary Section */}
      <div className="DisplayReturn-summary">
        <div>กำลังใช้งาน: {equipmentList.filter(item => item.status === 'กำลังใช้งาน').length} ชิ้น</div>
        <div>ใกล้ครบกำหนด: {equipmentList.filter(item => item.status === 'ใกล้ครบกำหนด').length} ชิ้น</div>
        <div>ครบกำหนดแล้ว: {equipmentList.filter(item => item.status === 'ครบกำหนดแล้ว').length} ชิ้น</div>
      </div>

      {/* Legend Section */}
      <div className="DisplayReturn-legend">
        <span className="legend-item green">กำลังใช้งาน</span>
        <span className="legend-item yellow">ใกล้ครบกำหนด</span>
        <span className="legend-item red">ครบกำหนดแล้ว</span>
      </div>

      {/* Controls: Search, Filter, and Sort */}
      <div className="DisplayReturn-controls">
        <input
          type="text"
          placeholder="ค้นหาอุปกรณ์..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="name">เรียงตามชื่อ</option>
          <option value="dueDate">เรียงตามวันที่ครบกำหนด</option>
        </select>
        <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
          <option value="">สถานะทั้งหมด</option>
          <option value="กำลังใช้งาน">กำลังใช้งาน</option>
          <option value="ใกล้ครบกำหนด">ใกล้ครบกำหนด</option>
          <option value="ครบกำหนดแล้ว">ครบกำหนดแล้ว</option>
        </select>
      </div>

      {/* Equipment Grid */}
      <div className="DisplayReturn-grid">
        {filteredList.map((item) => (
          <div key={item.id} className={`DisplayReturn-card ${item.status}`}>
            <h2 className="DisplayReturn-name">{item.name}</h2>
            <p className="DisplayReturn-due-date">ครบกำหนด: {item.dueDate}</p>
            <p className="DisplayReturn-status">{item.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayReturn;
