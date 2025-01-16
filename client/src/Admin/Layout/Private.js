import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ element }) => {
  const token = sessionStorage.getItem('authToken'); // ดึง token จาก sessionStorage

  // ตรวจสอบว่า token มีหรือไม่
  if (!token) {
    return <Navigate to="/login" />; // ถ้าไม่มี token จะไปหน้า login
  }

  try {
    const decodedToken = jwtDecode(token); // ถอดรหัส token
    const role = decodedToken.role; // สมมติว่า role ถูกเก็บใน decodedToken

    // ถ้าไม่ใช่ admin จะ redirect ไปหน้า /main
    if (role !== 'admin') {
      return <Navigate to="/main" />; // ถ้าไม่ใช่ admin จะไปหน้า main
    }

    // ถ้า role เป็น admin จะ render หน้า component ที่ต้องการ
    return element;
  } catch (error) {
    console.error("Error decoding token:", error);
    return <Navigate to="/login" />; // ถ้ามีข้อผิดพลาดในการถอดรหัส token
  }
};

export default PrivateRoute;
