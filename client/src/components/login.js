import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // ใช้ useNavigate เพื่อทำการ redirect
import '../View/Login.css'

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate(); // สร้างตัวแปรสำหรับใช้ navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // ส่งข้อมูล login ไปยัง backend
      const response = await axios.post("http://localhost:3333/login", formData);

      // ตรวจสอบว่า login สำเร็จ
      if (response.status === 200) {
        // เก็บ token และข้อมูลผู้ใช้ลงใน localStorage และ sessionStorage
        localStorage.setItem('token', response.data.token);
        sessionStorage.setItem('authToken', response.data.token);

        // เรียกใช้งาน Swal เพื่อแสดงผลการ login
        Swal.fire("Success", response.data.message, "success").then(() => {
          // Redirect ไปหน้า /main
          navigate('/main');
        });
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.error || "Login failed", "error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        {/* พื้นที่ด้านซ้ายใช้สำหรับรูปพื้นหลัง */}
      </div>
      <div className="login-right">
        <form className="login-form" onSubmit={handleLogin}>
          <h1>LOGIN</h1>
          <p>
            Welcome to SU KITS<br />
            จัดการยืมคืนอุปกรณ์การศึกษาพร้อมสนับสนุนการเรียนรู้<br />
            กรุณาเข้าสู่ระบบเพื่อเริ่มใช้งาน
          </p>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">LOGIN</button>
          <div className="login-footer">
            <a href="/signup">New Users? Signup</a>
            <a href="#">Forgot your password?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
