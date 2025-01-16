import NavbarMain from './NavbarMain';
import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import '../View/status.css';

const Status = () => {
  const [transactions, setTransactions] = useState([]); // เก็บข้อมูลรายการในตาราง
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // ดึงข้อมูลผู้ใช้
  const fetchUser = () => {
    const token = localStorage.getItem("token");
    if (token) {
      Axios.get("http://localhost:3333/main", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          setUser(response.data.user);
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
          navigate("/login");
        });
    }
  };

  // ดึงข้อมูลรายการจาก API
  const fetchTransactions = () => {
    Axios.get("http://localhost:3333/transactions")
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((err) => console.error("Error fetching transactions:", err));
  };

  useEffect(() => {
    fetchUser();
    fetchTransactions();
  }, []); // โหลดครั้งเดียวเมื่อ Component เริ่มทำงาน

  // ฟังก์ชัน Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div>
      <NavbarMain userData={user} onLogout={handleLogout} />
      <div className="status-container-1">
        <h2 className="status-title-1">สถานะการยืม</h2>
        <table className="status-table-1">
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>อุปกรณ์</th>
              <th>วันที่ยืม</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td className={`status-${transaction.status.toLowerCase()}`}>
                  {transaction.status}
                </td>
                <td>{transaction.no}</td>
                <td>{transaction.eq}</td>
                <td>{transaction.dbr}</td>
                <td>{transaction.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Status;
