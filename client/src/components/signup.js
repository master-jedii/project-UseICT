import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import '../View/Signup.css'




const Signup = () => {
  const [formData, setFormData] = useState({
    UserID: "",
    firstname: "",
    lastname: "",
    grade: "",
    branch: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
  });
  const navigate = useNavigate(); // สำหรับใช้ redirect

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
  
    // ตรวจสอบรหัสผ่านกับการยืนยันรหัสผ่าน
    if (formData.password !== formData.confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }
  
    try {
      // ส่งข้อมูล signup ไปยัง backend
      const response = await axios.post("http://localhost:3333/signup", formData);
  
      if (response.status === 200) {
        Swal.fire("Success", "Account created successfully", "success").then(() => {
          // Redirect ไปที่หน้าล็อกอิน
          navigate('/login');
        });
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.error || "Signup failed", "error");
    }
  };
  

  return (
    <div className="signup-container">
        <div className="signup-left">
          <img
            src="/logo.png"
            alt="SU Kits Logo"
            className="logo-signup"
          />
        </div>
        <div className="signup-right">
            <div className="signup-form">
            <h1>REGISTER</h1>
            <form onSubmit={handleSignup}>
                <div className="form-row">
                <input
                    type="text"
                    name="firstname"
                    placeholder="ชื่อ"
                    value={formData.firstname}
                    onChange={handleChange}
                    maxLength="50"
                    required
                />
                <input
                    type="text"
                    name="lastname"
                    placeholder="นามสกุล"
                    value={formData.lastname}
                    onChange={handleChange}
                    maxLength="50"
                    required
                />
                </div>
                <div className="form-row">
                <input
                    type="number"
                    name="UserID"
                    placeholder="รหัสนักศึกษา"
                    value={formData.UserID}
                    onChange={(e) => {
                    if (e.target.value.length <= 9) handleChange(e); // รับเลขไม่เกิน 9 หลัก
                    }}
                    required
                />
                <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    required
                >
                    <option value="">ชั้นปี</option>
                    <option value="1">ปี 1</option>
                    <option value="2">ปี 2</option>
                    <option value="3">ปี 3</option>
                    <option value="4">ปี 4</option>
                </select>
                </div>
                <div className="form-row">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength="50"
                    required
                />
                <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                >
                    <option value="">สาขา</option>
                    <option value="การจัดการ">การจัดการ</option>
                    <option value="ICT">ICT</option>
                    <option value="นิเทศ">นิเทศ</option>
                </select>
                </div>
                <div className="form-row">
                <input
                    type="number"
                    name="phone_number"
                    placeholder="เบอร์โทรศัพท์"
                    value={formData.phone_number}
                    onChange={(e) => {
                    if (e.target.value.length <= 10) handleChange(e); // รับเลขไม่เกิน 10 หลัก
                    }}
                    required
                />
                </div>
                <div className="form-row">
                <input
                    type="password"
                    name="password"
                    placeholder="รหัสผ่าน"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="ยืนยันรหัสผ่าน"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                </div>
                <button type="submit" className="signup-button">SIGN UP</button>
            </form>
            </div>
        </div>
        </div>

  );
};

export default Signup;
