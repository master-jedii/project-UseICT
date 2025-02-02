import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./CSS/DisplayReturn.css"; // นำเข้าไฟล์ CSS

const DisplayReturn = () => {
  const [borrowedItems, setBorrowedItems] = useState([]);

  // ฟังก์ชันเพื่อคำนวณสถานะของอุปกรณ์
  const getStatusLabel = (daysLeft) => {
    if (daysLeft <= 0) {
      return "ครบกำหนด"; // ครบกำหนด
    } else if (daysLeft <= 3) {
      return "ใกล้ครบกำหนด"; // ใกล้ครบกำหนด (1-3 วัน)
    } else {
      return "ปกติ"; // ปกติ (4-7 วัน)
    }
  };

  // ฟังก์ชันคำนวณความแตกต่างระหว่างวันที่
  const calculateDaysLeft = (returnDate) => {
    const currentDate = new Date();
    const diffTime = new Date(returnDate) - currentDate; // ความแตกต่างระหว่างวันที่
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)); // เปลี่ยนเป็นจำนวนวัน
    return diffDays;
  };

  // ฟังก์ชันแปลงเวลาเป็นรูปแบบไทย
  const formatDateToThai = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ดึงข้อมูลสถานะการยืมจาก API และกรองเฉพาะอุปกรณ์ที่ยังไม่ได้คืน
  const fetchBorrowStatus = () => {
    const token = localStorage.getItem("token");
    if (token) {
      Axios.get("http://localhost:3333/api/borrow-status", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          // กรองข้อมูลเฉพาะที่สถานะเป็น 'approved' และยังไม่ได้คืน
          const approvedItems = response.data.filter(item => item.status === "อนุมัติ" && item.status !== "คืนแล้ว");

          // คำนวณ days_left และอัพเดตใน state
          approvedItems.forEach((item) => {
            item.days_left = calculateDaysLeft(item.return_date);
          });

          setBorrowedItems(approvedItems); // เก็บข้อมูลที่ยังไม่ได้คืนและได้รับการอนุมัติ
        })
        .catch((err) => {
          console.error("Error fetching borrow status:", err);
        });
    }
  };

  useEffect(() => {
    fetchBorrowStatus();
  }, []); // เรียกใช้ฟังก์ชันเมื่อ component ถูกโหลด

  return (
    <div className="container-return">
      <h2 className="section-title">อุปกรณ์ที่ยืมอยู่</h2>
      {borrowedItems.length > 0 ? (
        borrowedItems.map((item) => {
          const status = getStatusLabel(item.days_left); // ดึงสถานะตามจำนวนวันที่เหลือ
          const statusStyle =
            item.days_left <= 0
              ? { backgroundColor: "red" } // สีแดง ถ้าครบกำหนด
              : item.days_left <= 3
              ? { backgroundColor: "orange" } // สีส้ม ถ้าเหลือ 1-3 วัน
              : { backgroundColor: "#28a745" }; // สีเขียว ถ้าเหลือ 4-7 วัน

          return (
            <div key={item.borrow_id} className="borrowed-item-return">
              <div className="borrowed-header-return">
                <h3 className="item-name-return">{item.equipment_name}</h3>
                <span
                  className="status-label"
                  style={statusStyle} // ใช้ style ที่เปลี่ยนสี
                >
                  {status}
                </span>
              </div>
              <div className="borrowed-details-return">
                <div>
                  <p>วันที่ยืม : {formatDateToThai(item.borrow_date)}</p>
                  <p className="progress-text">
                    <strong>เหลือเวลา:</strong>{" "}
                    {item.days_left > 0
                      ? `${item.days_left} วัน`
                      : item.days_left === 0
                        ? "ครบกำหนดวันนี้"
                        : `เกินกำหนด ${Math.abs(item.days_left)} วัน`}
                  </p>
                </div>
                <div>
                  <p>กำหนดคืนอุปกรณ์ : </p>
                  <p>{formatDateToThai(item.return_date)}</p>
                </div>
              </div>

              {/* Progress Bar แสดงสถานะ */}
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width:
                      item.days_left >= 7
                        ? "100%"  // มากกว่า 7 วัน
                        : item.days_left === 6
                        ? "80%" // เหลือ 6 วัน
                        : item.days_left === 5
                        ? "55%" // เหลือ 5 วัน
                        : item.days_left === 4
                        ? "45%" // เหลือ 4 วัน
                        : item.days_left === 3
                        ? "35%" // เหลือ 3 วัน
                        : item.days_left === 2
                        ? "25%" // เหลือ 2 วัน
                        : item.days_left === 1
                        ? "15%" // เหลือ 1 วัน
                        : "100%", // เกินกำหนด
                    backgroundColor:
                      item.days_left <= 0
                        ? "red" // สีแดง
                        : item.days_left <= 3
                        ? "orange" // สีส้ม
                        : "#28a745", // สีเขียว
                  }}
                />
              </div>

              

            </div>
          );
        })
      ) : (
        <p>ไม่มีข้อมูลอุปกรณ์ที่ยืมอยู่</p>
      )}
    </div>
  );
};

export default DisplayReturn;
