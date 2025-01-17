import React, { useState, useEffect } from 'react';
import NavbarAdmin from './NavbarAdmin';
import '../CSS/Dashboard.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import axios from 'axios';

const data = [
  { month: 'ม.ค.', borrowed: 40, returned: 30 },
  { month: 'ก.พ.', borrowed: 30, returned: 20 },
  { month: 'มี.ค.', borrowed: 20, returned: 10 },
  { month: 'เม.ย.', borrowed: 27, returned: 25 },
  { month: 'พ.ค.', borrowed: 50, returned: 45 },
  { month: 'มิ.ย.', borrowed: 60, returned: 55 },
];

const Dashboard = () => {
  const [equipmentStats, setEquipmentStats] = useState(null); // ข้อมูลสถิติอุปกรณ์
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false); // สำหรับควบคุมการแสดง/ซ่อนรายละเอียด
  const [users, setUsers] = useState([]); // เก็บข้อมูลผู้ใช้งาน
  const [showUserDetails, setShowUserDetails] = useState(false); // แสดง/ซ่อนข้อมูลผู้ใช้งาน

  // ดึงข้อมูลจำนวนอุปกรณ์ตามหมวดหมู่
  useEffect(() => {
    const fetchEquipmentStats = async () => {
      try {
        const response = await axios.get('http://localhost:3333/equipment-stats'); // API ดึงข้อมูล
        if (response.data) {
          setEquipmentStats(response.data); // เก็บข้อมูลใน State
        } else {
          setEquipmentStats({});
          setError('ไม่มีข้อมูลอุปกรณ์');
        }
      } catch (error) {
        console.error('Error fetching equipment stats:', error);
        setError('ไม่สามารถดึงข้อมูลสถิติอุปกรณ์ได้');
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3333/users'); // API ดึงข้อมูลผู้ใช้งาน
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('ไม่สามารถดึงข้อมูลผู้ใช้งานได้');
      }
    };

    fetchEquipmentStats();
    fetchUsers();
  }, []);

  // คำนวณจำนวนอุปกรณ์ทั้งหมด
  const totalEquipment = equipmentStats
    ? Object.values(equipmentStats).reduce((total, count) => total + count, 0)
    : 0;

  return (
    <div className="admin-dashboard">
      {/* Navbar */}
      <NavbarAdmin />

      {/* Main Content */}
      <div className="main-content">
        <div className="dashboard-container">
          <header className="admin-header">
            <div className="admin-header-info">
              <h1>Dashboard</h1>
            </div>
          </header>

          {/* Card Section */}
          <div className="dashboard-content cards-grid">
            <div className="dashboard-card">
              <h2>อุปกรณ์ทั้งหมด</h2>
              <p>จำนวนอุปกรณ์ทั้งหมด: {totalEquipment} ชิ้น</p>
              <button
                className="dashboard-button"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียด'}
              </button>
              {showDetails && equipmentStats && (
                <ul className="equipment-list-dashboard-admin ">
                  {Object.entries(equipmentStats).map(([category, count]) => (
                    <li key={category} className="equipment-item-dashboard">
                      <strong>{category}:</strong> {count} ชิ้น
                    </li>
                  ))}
                </ul>
              )}
              {showDetails && !equipmentStats && (
                <p>{error || 'กำลังโหลดข้อมูล...'}</p>
              )}
            </div>
            <div className="dashboard-card">
              <h2>สถานะการยืม</h2>
              <p>ตรวจสอบและติดตามสถานะการยืมและการคืนอุปกรณ์</p>
              <button className="dashboard-button">ตรวจสอบสถานะ</button>
            </div>
            <div className="dashboard-card">
              <h2>ผู้ใช้งานทั้งหมด</h2>
              <p>จำนวนผู้ใช้งานทั้งหมด: {users.length}</p>
              <button
                className="dashboard-button"
                onClick={() => setShowUserDetails(!showUserDetails)}
              >
                {showUserDetails ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียดผู้ใช้งาน'}
              </button>
              {showUserDetails && (
                <ul className="equipment-list-dashboard-admin ">
                  {users.map((user) => (
                    <li key={user.UserID} className="equipment-item-dashboard">
                      <strong>{user.firstname} {user.lastname}</strong> ({user.email})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Graph Section */}
          <div className="dashboard-graphs">
            <h2>สถิติการยืมอุปกรณ์รายเดือน</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="borrowed"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="returned" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>

            <h2>การเปรียบเทียบการยืมและคืนอุปกรณ์</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="borrowed" fill="#8884d8" />
                <Bar dataKey="returned" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
