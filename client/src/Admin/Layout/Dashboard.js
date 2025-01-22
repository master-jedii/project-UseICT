import React, { useState, useEffect } from 'react';
import NavbarAdmin from './NavbarAdmin';
import '../CSS/Dashboard.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [equipmentStats, setEquipmentStats] = useState(null);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [users, setUsers] = useState([]);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [showBorrowDetails, setShowBorrowDetails] = useState(false);
  const [borrowStats, setBorrowStats] = useState([]);
  const [equipmentStatusStats, setEquipmentStatusStats] = useState([]);
  const [topBorrowedEquipment, setTopBorrowedEquipment] = useState([]);
  const [dailyBorrowStats, setDailyBorrowStats] = useState([]);
  const [topBorrowers, setTopBorrowers] = useState([]);
  const [userBorrowHistory, setUserBorrowHistory] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEquipmentStats = async () => {
      try {
        const response = await axios.get('http://localhost:3333/equipment-stats');
        setEquipmentStats(response.data || {});
      } catch (error) {
        console.error('Error fetching equipment stats:', error);
        setError('ไม่สามารถดึงข้อมูลสถิติอุปกรณ์ได้');
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3333/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('ไม่สามารถดึงข้อมูลผู้ใช้งานได้');
      }
    };

    const fetchBorrowRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3333/api/borrow/all');
        const filteredRequests = response.data.filter(
          (request) => request.status === 'รอดำเนินการ'
        );
        setBorrowRequests(filteredRequests);
      } catch (error) {
        console.error('Error fetching borrow requests:', error);
      }
    };

    const fetchBorrowStats = async () => {
      try {
        const response = await axios.get('http://localhost:3333/api/borrow/stats');
        const formattedData = response.data.map((item) => ({
          month: new Date(2025, item.month - 1).toLocaleString('th-TH', { month: 'short' }),
          total: item.total,
        }));
        setBorrowStats(formattedData);
      } catch (error) {
        console.error('Error fetching borrow stats:', error);
      }
    };

    const fetchEquipmentStatusStats = async () => {
      try {
        const response = await axios.get('http://localhost:3333/api/equipment/status');
        const formattedData = response.data.map((item) => ({
          status: item.status,
          value: item.count,
          equipmentDetails: item.equipment_details ? item.equipment_details.split(',') : [],
        }));
        setEquipmentStatusStats(formattedData);
      } catch (error) {
        console.error('Error fetching equipment status stats:', error);
      }
    };

    const fetchTopBorrowedEquipment = async () => {
      try {
        const response = await axios.get('http://localhost:3333/api/top-borrowed-equipment');
        const formattedData = response.data.map((item) => ({
          name: item.equipment_name,
          borrowCount: item.borrow_count,
        }));
        setTopBorrowedEquipment(formattedData);
      } catch (error) {
        console.error('Error fetching top borrowed equipment:', error);
      }
    };

    const fetchDailyBorrowStats = async () => {
      try {
        const response = await axios.get('http://localhost:3333/api/borrow/daily-stats');
        const formattedData = response.data.map((item) => ({
          date: new Date(item.date).toLocaleDateString('th-TH'),
          total: item.total,
        }));
        setDailyBorrowStats(formattedData);
      } catch (error) {
        console.error('Error fetching daily borrow stats:', error);
      }
    };

    const fetchTopBorrowers = async () => {
      try {
        const response = await axios.get('http://localhost:3333/api/top-borrowers');
        setTopBorrowers(response.data);
      } catch (error) {
        console.error('Error fetching top borrowers:', error);
      }
    };

    fetchEquipmentStats();
    fetchUsers();
    fetchBorrowRequests();
    fetchBorrowStats();
    fetchEquipmentStatusStats();
    fetchTopBorrowedEquipment();
    fetchDailyBorrowStats();
    fetchTopBorrowers();
  }, []);

  const handleUserClick = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3333/api/user-borrow-history/${userId}`);
      setUserBorrowHistory(response.data);
      setSelectedUserId(userId);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching user borrow history:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
    setUserBorrowHistory([]);
  };

  const totalEquipment = equipmentStats
    ? Object.values(equipmentStats).reduce((total, count) => total + count, 0)
    : 0;

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="admin-dashboard">
      <NavbarAdmin />
      <div className="main-content">
        <div className="dashboard-container">
          <header className="admin-header">
            <div className="admin-header-info">
              <h1>Dashboard</h1>
            </div>
          </header>

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
                <ul className="equipment-list-dashboard-admin">
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
              <h2>คำร้องขอยืมอุปกรณ์ทั้งหมด</h2>
              <p>คำร้องขอที่รอดำเนินการ: {borrowRequests.length}</p>
              <button
                className="dashboard-button"
                onClick={() => setShowBorrowDetails(!showBorrowDetails)}
              >
                {showBorrowDetails ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียด'}
              </button>
              {showBorrowDetails && borrowRequests.length > 0 && (
                <ul className="equipment-list-dashboard-admin">
                  {borrowRequests.map((request) => (
                    <li key={request.borrow_id} className="equipment-item-dashboard">
                      <strong>{request.subject}</strong>: {request.equipment_name}
                      <br />
                      <span>วันที่ยืม: {new Date(request.borrow_date).toLocaleDateString('th-TH')}</span>
                      <br />
                      <span>วันที่คืน: {new Date(request.return_date).toLocaleDateString('th-TH')}</span>
                      <br />
                      <span>สถานะ: {request.status}</span>
                    </li>
                  ))}
                </ul>
              )}
              {showBorrowDetails && borrowRequests.length === 0 && (
                <p>ไม่มีคำร้องขอการยืมในขณะนี้</p>
              )}
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
                <ul className="equipment-list-dashboard-admin">
                  {users.map((user) => (
                    <li key={user.UserID} className="equipment-item-dashboard">
                      <strong>{user.firstname} {user.lastname}</strong> ({user.email})
                      <button
                        className="dashboard-button"
                        onClick={() => handleUserClick(user.UserID)}
                      >
                        ดูประวัติการยืม
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>ประวัติการยืมของผู้ใช้</h2>
                  <button className="close-modal" onClick={closeModal}>&times;</button>
                </div>
                <div className="modal-body">
                  {userBorrowHistory.length > 0 ? (
                    <table className="borrow-history-table">
                      <thead>
                        <tr>
                          <th style={{ padding: '10px', textAlign: 'left' }}>ชื่ออุปกรณ์</th>
                          <th style={{ padding: '10px', textAlign: 'left' }}>วันที่ยืม</th>
                          <th style={{ padding: '10px', textAlign: 'left' }}>วันที่คืน</th>
                          <th style={{ padding: '10px', textAlign: 'left' }}>สถานะ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userBorrowHistory.map((history) => (
                          <tr key={history.borrow_id}>
                            <td style={{ padding: '10px' }}>{history.equipment_name}</td>
                            <td style={{ padding: '10px' }}>{new Date(history.borrow_date).toLocaleDateString('th-TH')}</td>
                            <td style={{ padding: '10px' }}>{new Date(history.return_date).toLocaleDateString('th-TH')}</td>
                            <td style={{ padding: '10px' }}>{history.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>ไม่มีประวัติการยืม</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="dashboard-graphs-wrapper">
            <div className="graphs-header">
              <h2>การวิเคราะห์ข้อมูลการยืมและอุปกรณ์</h2>
            </div>
            <div className="graph-item">
              <h3>สถิติการยืมอุปกรณ์รายเดือน</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={borrowStats}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="graph-item">
              <h3>สถิติการยืมอุปกรณ์รายวัน</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={dailyBorrowStats}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="graph-pair-wrapper">
              <div className="graph-pair">
                <div className="graph-item">
                  <h3>สถานะอุปกรณ์</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Tooltip
                        formatter={(value, name, props) => {
                          const equipmentDetails = props.payload.equipmentDetails || [];
                          return [
                            `${value} ชิ้น (${equipmentDetails.join(', ')})`,
                            name,
                          ];
                        }}
                      />
                      <Legend />
                      <Pie
                        data={equipmentStatusStats}
                        dataKey="value"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        labelLine = {false}
                      >
                        {equipmentStatusStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="graph-item">
                  <h3>Top 5 อุปกรณ์ที่ถูกยืมมากที่สุด</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={topBorrowedEquipment}
                      layout="vertical"
                      margin={{ top: 10, right: 30, left: 50, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="borrowCount" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;