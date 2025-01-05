import React, { useState, useEffect } from 'react';
import logo from '../assets/LOGO.png';
import '../App.css';
import api from '../service/axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userFirstName, setUserFirstName] = useState(''); // Create a state to hold the first name
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate(); // Initialize the navigate function

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await api.get('/main', {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    // Log the response data to see what is returned
                    // console.log('API Response:', response.data);

                    // Use 'firstname' instead of 'firstName'
                    if (response.data && response.data.user) {
                        setIsLoggedIn(true);
                        setUserFirstName(response.data.user.firstname || ''); // Use 'firstname'
                        // console.log('User First Name:', response.data.user.firstname); // Log the firstName
                    } else {
                        setIsLoggedIn(false);
                        setUserFirstName('');
                    }
                } catch (err) {
                    console.error('Error fetching user data:', err);
                    setError(err.response?.data?.message || 'Error fetching user data');
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
        setUserFirstName(''); // Clear firstName on logout
        navigate('/'); // Use navigate to go to the home page
    };

    console.log(userFirstName); 

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
                        <a className="nav-link" href="#" style={{ fontSize: '20px' }}>หมวดหมู่อุปกรณ์</a>
                    </li>
                    <li className="nav-item mx-4">
                        <a className="nav-link" href="#" style={{ fontSize: '20px' }}>วิธีใช้งานอุปกรณ์</a>
                    </li>
                    <li className="nav-item mx-4">
                        <a className="nav-link" href="#" style={{ fontSize: '20px' }}>ศึกษาเพิ่มเติม</a>
                    </li>
                    <li className="nav-item mx-4">
                        <a className="nav-link" href="#" style={{ fontSize: '20px' }}>ติดต่อเรา</a>
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
                            }}
                        >
                            สวัสดี, {userFirstName} {/* Display first name here */}
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
                        onClick={() => navigate('/login')} // Use navigate to redirect to login
                    >
                        เข้าสู่ระบบ
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
