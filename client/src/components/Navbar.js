import React, { useState, useEffect } from 'react';
import logo from '../assets/LOGO.png';
import '../App.css';
import api from '../service/axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userFirstName, setUserFirstName] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation(); // ใช้ตรวจสอบตำแหน่งของเส้นทางปัจจุบัน

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await api.get('/main', {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (response.data && response.data.user) {
                        setIsLoggedIn(true);
                        setUserFirstName(response.data.user.firstname || '');
                    } else {
                        setIsLoggedIn(false);
                        setUserFirstName('');
                    }
                } catch (err) {
                    console.error('Error fetching user data:', err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('authToken');
        setIsLoggedIn(false);
        setUserFirstName('');
        navigate('/');
    };

    const scrollToSection = (id) => {
        if (location.pathname === '/') {
          const section = document.getElementById(id);
          if (section) {
            const topPosition = section.offsetTop;
            window.scrollTo({
              top: topPosition,
              behavior: 'smooth',
            });
          }
        } else {
          navigate('/'); // กลับไปหน้าแรก
          setTimeout(() => {
            const section = document.getElementById(id);
            if (section) {
              const topPosition = section.offsetTop;
              window.scrollTo({
                top: topPosition,
                behavior: 'smooth',
              });
            }
          }, 500); // รอให้หน้าโหลดก่อน
        }
      };
      
      
    return (
        <nav className="navbar navbar-light bg-white px-5">
            <div className="d-flex align-items-center">
                <a className="navbar-brand" href="/">
                    <img src={logo} alt="Logo" style={{ height: '105px' }} />
                </a>
            </div>
            <div className="d-flex justify-content-center">
                <ul className="navbar-nav flex-row">
                    <li className="nav-item mx-4">
                        <button
                            className="nav-link btn btn-link"
                            style={{ fontSize: '20px', textDecoration: 'none' }}
                            onClick={() => scrollToSection('type')}
                        >
                            หมวดหมู่อุปกรณ์
                        </button>
                    </li>
                    <li className="nav-item mx-4">
                        <button
                            className="nav-link btn btn-link"
                            style={{ fontSize: '20px', textDecoration: 'none' }}
                            onClick={() => scrollToSection('Howtoborrow')}
                        >
                            วิธียืมอุปกรณ์
                        </button>
                    </li>
                    <li className="nav-item mx-4">
                        <button
                            className="nav-link btn btn-link"
                            style={{ fontSize: '20px', textDecoration: 'none' }}
                            onClick={() => scrollToSection('About')}
                        >
                            คำถามที่พบบ่อย
                        </button>
                    </li>
                    <li className="nav-item mx-4">
                        <button
                            className="nav-link btn btn-link"
                            style={{ fontSize: '20px', textDecoration: 'none' }}
                            onClick={() => scrollToSection('Footer')}
                        >
                            ติดต่อเรา
                        </button>
                    </li>
                </ul>
            </div>
            <div className="d-flex align-items-center">
                {loading ? (
                    <span style={{ fontSize: '20px' }}>กำลังโหลด...</span>
                ) : isLoggedIn ? (
                    <>
                        <span
                            style={{
                                fontSize: '20px',
                                marginRight: '20px',
                                fontFamily: "'Sarabun', sans-serif",
                                marginTop: '20px',
                            }}
                        >
                            สวัสดี, {userFirstName}
                        </span>
                        <button
                            className="btn"
                            style={{
                                backgroundColor: '#e74c3c',
                                color: '#fff',
                                border: 'none',
                                height: '51px',
                                width: '144px',
                                borderRadius: '5px',
                                fontSize: '20px',
                                fontFamily: "'Sarabun', sans-serif",
                            }}
                            onClick={handleLogout}
                        >
                            ออกจากระบบ
                        </button>
                    </>
                ) : (
                    <button
                        className="btn"
                        style={{
                            backgroundColor: '#009498',
                            color: '#fff',
                            border: 'none',
                            height: '51px',
                            width: '144px',
                            borderRadius: '5px',
                            fontSize: '20px',
                            fontFamily: "'Sarabun', sans-serif",
                        }}
                        onClick={() => navigate('/login')}
                    >
                        เข้าสู่ระบบ
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
