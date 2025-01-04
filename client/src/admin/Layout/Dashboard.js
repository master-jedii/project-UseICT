import React from "react";
import { Bar } from "react-chartjs-2";
import "./Dashboard.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  

const Dashboard = () => {
  // ข้อมูลสำหรับการ์ดสถิติ
  const stats = [
    { id: 1, label: "รายการยืม/คืน", value: 7, color: "blue" },
    { id: 2, label: "รายการแจ้งคืน", value: 6, color: "red" },
    { id: 3, label: "รายการสมาชิก", value: 5, color: "orange" },
    { id: 4, label: "รายการสินค้า", value: 9, color: "green" },
  ];

  // ข้อมูลสำหรับกราฟ
  const data = {
    labels: ["พร้อมใช้งาน", "กำลังใช้งาน", "ชำรุด"],
    datasets: [
      {
        label: "จำนวนอุปกรณ์",
        data: [10, 5, 2],
        backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">หน้าหลัก</h1>

      {/* การ์ดสถิติ */}
      <div className="stats-cards">
        {stats.map((stat) => (
          <div key={stat.id} className={`stat-card ${stat.color}`}>
            <h2>{stat.value}</h2>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* กราฟแสดงผล */}
      <div className="chart-container">
        <h2>สถิติการใช้งานอุปกรณ์</h2>
        <Bar data={data} options={options} />
      </div>

      {/* ตารางข้อมูล */}
      <div className="recent-activity">
        <div className="recent-users">
          <h2>ผู้ใช้งานล่าสุด</h2>
          <ul>
            <li>user1 ยืมคอมพิวเตอร์เมื่อ 12/12/67</li>
            <li>user2 คืนกล้องเมื่อ 13/12/67</li>
            <li>user3 แจ้งซ่อมโปรเจคเตอร์เมื่อ 14/12/67</li>
          </ul>
        </div>
        <div className="recent-returns">
          <h2>สินค้าอุปกรณ์คืนล่าสุด</h2>
          <table>
            <thead>
              <tr>
                <th>รหัสสินค้า</th>
                <th>ชื่ออุปกรณ์</th>
                <th>จำนวนคืน</th>
                <th>สถานะ</th>
                <th>วันที่</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ACO01</td>
                <td>คอมพิวเตอร์</td>
                <td>5</td>
                <td className="status success">คืนแล้ว</td>
                <td>12/12/67</td>
              </tr>
              <tr>
                <td>CA002</td>
                <td>กล้อง</td>
                <td>2</td>
                <td className="status warning">รอคืน</td>
                <td>13/12/67</td>
              </tr>
              <tr>
                <td>EP003</td>
                <td>โปรเจคเตอร์</td>
                <td>1</td>
                <td className="status danger">ชำรุด</td>
                <td>14/12/67</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
