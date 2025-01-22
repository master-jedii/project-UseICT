import React, { useState, useEffect } from 'react';
import NavbarAdmin from './NavbarAdmin';
import axios from 'axios';
import '../CSS/ReturnSchedule.css';

const ReturnSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchStudentID, setSearchStudentID] = useState('');
  const [searchEquipment, setSearchEquipment] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:3333/api/borrow/schedule')
      .then((response) => {
        const today = new Date();
        const updatedSchedule = response.data.map((item) => {
          const returnDate = new Date(item.return_date);
          const daysLeft = Math.ceil((returnDate - today) / (1000 * 60 * 60 * 24));
          return { ...item, days_left: daysLeft };
        });
        setSchedule(updatedSchedule);
        setFilteredSchedule(updatedSchedule);
        setLoading(false);
      })
      .catch((err) => {
        setError('ไม่สามารถโหลดข้อมูลได้');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    filterSchedule();
  }, [searchDate, searchStudentID, searchEquipment]);

  const filterSchedule = () => {
    let filtered = schedule;

    if (searchDate) {
      filtered = filtered.filter(
        (item) => new Date(item.return_date).toISOString().split('T')[0] === searchDate
      );
    }

    if (searchStudentID) {
      filtered = filtered.filter((item) =>
        String(item.user_id).toLowerCase().includes(searchStudentID.toLowerCase())
      );
    }

    if (searchEquipment) {
      filtered = filtered.filter((item) =>
        item.equipment_name.toLowerCase().includes(searchEquipment.toLowerCase())
      );
    }

    setFilteredSchedule(filtered);
  };

  const resetFilters = () => {
    setSearchDate('');
    setSearchStudentID('');
    setSearchEquipment('');
    setFilteredSchedule(schedule);
  };

  const markAsReturned = (borrowId) => {
    if (window.confirm('คุณต้องการลบข้อมูลนี้ใช่หรือไม่?')) {
      axios
        .delete(`http://localhost:3333/api/borrow/${borrowId}`)
        .then(() => {
          // ลบข้อมูลใน state
          setSchedule((prevSchedule) =>
            prevSchedule.filter((item) => item.borrow_id !== borrowId)
          );

          setFilteredSchedule((prevFiltered) =>
            prevFiltered.filter((item) => item.borrow_id !== borrowId)
          );

          alert('ข้อมูลถูกลบสำเร็จ!');
        })
        .catch((error) => {
          console.error('Error deleting record:', error);
          alert('ไม่สามารถลบข้อมูลได้');
        });
    }
  };

  return (
    <div className="admin-dashboard">
      <NavbarAdmin />
      <div className="main-content">
        <header className="admin-header">
          <div className="admin-header-info" style={{display:'flex' , alignItems : 'center' , gap :'10px'}}>
            <i className="fas fa-history" style={{fontSize : '20px'}}></i>
            <h1>กำหนดการคืนอุปกรณ์</h1>
          </div>
        </header>
        <div className="content">
          <button
            className="toggle-filter-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'ซ่อนตัวกรอง' : 'แสดงตัวกรอง'}
          </button>
          {showFilters && (
            <div className="filter-container">
              <input
                className="filter-input"
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                placeholder="ค้นหาตามวันที่คืน"
              />
              <input
                className="filter-input"
                type="text"
                value={searchStudentID}
                onChange={(e) => setSearchStudentID(e.target.value)}
                placeholder="ค้นหาตามรหัสนักศึกษา"
              />
              <input
                className="filter-input"
                type="text"
                value={searchEquipment}
                onChange={(e) => setSearchEquipment(e.target.value)}
                placeholder="ค้นหาตามชื่ออุปกรณ์"
              />
              <button className="filter-button reset" onClick={resetFilters}>
                เคลียร์การกรอง
              </button>
              <button
                className="filter-button reload"
                onClick={() => window.location.reload()}
              >
                โหลดข้อมูลใหม่
              </button>
            </div>
          )}

          {loading && <p>กำลังโหลดข้อมูล...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && filteredSchedule.length === 0 && <p>ไม่มีข้อมูลกำหนดการคืน</p>}
          <ul className="return-schedule-list">
            {filteredSchedule.map((item) => {
              const formattedDate = new Date(item.return_date).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
              return (
                <li key={item.borrow_id} className="schedule-item">
                  <p><strong>รหัสผู้ยืม:</strong> {item.user_id}</p>
                  <p><strong>เบอร์โทร:</strong> {item.phone_number}</p>
                  <p><strong>อุปกรณ์:</strong> {item.equipment_name}</p>
                  <p><strong>กำหนดคืน:</strong> {formattedDate}</p>
                  <p>
                    <strong>เหลือเวลาอีก:</strong>{' '}
                    {item.days_left > 0
                      ? `${item.days_left} วัน`
                      : item.days_left === 0
                      ? 'ครบกำหนดวันนี้'
                      : `เกินกำหนด ${Math.abs(item.days_left)} วัน`}
                  </p>
                  
                  <p>
                    <strong>สถานะ:</strong> {item.status === 'คืนแล้ว' ? 'คืนแล้ว' : 'ยังไม่คืน'}
                  </p>
                  <button onClick={() => markAsReturned(item.borrow_id)}>
                    ทำเครื่องหมายว่าคืนแล้ว
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReturnSchedule;
