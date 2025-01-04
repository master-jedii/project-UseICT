import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../View/Login.css'; // นำเข้าไฟล์ CSS สำหรับ UI
import login from '../assets/login.png';
import logo from '../assets/LOGO.png';
import api from '../service/axios'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
    
        // ตรวจสอบว่า email และ password ถูกกรอกครบหรือไม่
        if (!email || !password) {
            Swal.fire({
                title: 'Invalid Input',
                text: 'กรุณากรอกอีเมลและรหัสผ่าน',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }
    
        try {
            // เรียก API เพื่อล็อกอิน โดยใช้ axiosInstance ที่ตั้งค่าไว้
            const response = await api.post('/login', { email, password });
    
            const { token } = response.data;
    
            // เก็บ token ใน localStorage
            if (token) {
                localStorage.setItem('authToken', token);  // เก็บ token ใน localStorage

            } else {
                // ถ้าไม่มี token
                Swal.fire({
                    title: 'Login Failed',
                    text: 'ไม่พบ Token ในการตอบกลับจากเซิร์ฟเวอร์',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                return;
            }
    
            // แจ้งผู้ใช้ว่าเข้าสู่ระบบสำเร็จ
            Swal.fire({
                title: 'Login Success',
                text: 'เข้าสู่ระบบสำเร็จ!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate('/dashboard'); // พาไปหน้า Dashboard
            });
        } catch (error) {
            console.error('โปรดตรวจสอบข้อมูลให้ถูกต้อง:', error);
            // แสดงข้อความข้อผิดพลาดตามเงื่อนไข
            Swal.fire({
                title: 'Login Failed',
                text: error.response?.data?.error || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์',
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
        }
    };
    
    
    const handleSignupRedirect = () => {
        navigate('/signup');
    };

    return (
        <div className="login-container">
            <div className="image-section">
            </div>
            <div className="form-section">
                <div className="logo">
                    <img src={logo} alt="SU KITS Logo" className="logo-image" />
                </div>
                <div className="login-box">
                    <h1 className="login-title">LOGIN</h1>
                    <p className="login-description">
                        Welcome to SU KITS<br />
                        จัดการยืมคืนอุปกรณ์การศึกษาพร้อมสนับสนุนการเรียนรู้<br />
                        กรุณาเข้าสู่ระบบเพื่อเริ่มใช้งาน
                    </p>
                    <form onSubmit={handleLogin} className="login-form">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="login-input"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="login-input"
                        />
                        <button type="submit" className="login-button">Login</button>
                    </form>
                    <div className="links">
                        <p>New Users? <button onClick={handleSignupRedirect} className="signup-link">Signup</button></p>
                        <p><a href="#" className="forgot-password">Forgot your password?</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;