import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../View/Login.css'; // นำเข้าไฟล์ CSS สำหรับ UI

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3333/login', { email, password });
            if (response.status === 200) {
                Swal.fire({
                    title: 'Login Success',
                    text: 'เข้าสู่ระบบสำเร็จ!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/dashboard');
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Login Failed',
                text: error.response?.data?.error || 'เกิดข้อผิดพลาด',
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
                    <img src="/path/to/your/logo.png" alt="SU KITS Logo" className="logo-image" />
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