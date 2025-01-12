import React from 'react';
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

const data = [
  { month: 'ม.ค.', borrowed: 40, returned: 30 },
  { month: 'ก.พ.', borrowed: 30, returned: 20 },
  { month: 'มี.ค.', borrowed: 20, returned: 10 },
  { month: 'เม.ย.', borrowed: 27, returned: 25 },
  { month: 'พ.ค.', borrowed: 50, returned: 45 },
  { month: 'มิ.ย.', borrowed: 60, returned: 55 },
];

const Dashboard = () => {
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
              <p>ดูและจัดการอุปกรณ์ทั้งหมดที่มีอยู่ในระบบ</p>
              <button className="dashboard-button">ดูรายละเอียด</button>
            </div>
            <div className="dashboard-card">
              <h2>สถานะการยืม</h2>
              <p>ตรวจสอบและติดตามสถานะการยืมและการคืนอุปกรณ์</p>
              <button className="dashboard-button">ตรวจสอบสถานะ</button>
            </div>
            <div className="dashboard-card">
              <h2>ผู้ใช้งานทั้งหมด</h2>
              <p>จัดการข้อมูลผู้ใช้งานในระบบทั้งหมด</p>
              <button className="dashboard-button">จัดการผู้ใช้งาน</button>
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
