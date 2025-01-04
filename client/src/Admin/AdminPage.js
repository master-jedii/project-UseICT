import React from 'react';
import logo from '../assets/LOGO.png';
import '../App.css';


const AdminNavbar = () => {
    return (
        <div>
            {/* กล่องสีเขียว */}
            <nav style={{
                backgroundColor: '#009498',
                width: '100%', // ปรับให้เต็มความกว้าง
                height: '148px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px',
            }}>
                <div className="d-flex align-items-center">
                    {/* โลโก้ในวงกลม */}
                    <a className="navbar-brand" href="/">
                        <div style={{
                            width: '108.08px',
                            height: '108.08px',
                            borderRadius: '50%',
                            backgroundColor: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <img
                                src={logo}
                                alt="Logo"
                                style={{ height: '103.99px', width: '103.99px' }}
                            />
                        </div>
                    </a>
                    {/* เมนู */}
                    
                </div>
            </nav>

            {/* กล่องสีขาว */}
            <div style={{
                width: '300px',
                height: '500px',
                backgroundColor: '#fff',
                marginTop: '0', // เพิ่มระยะห่างจากกล่องสีเขียว
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                marginLeft: '0', // ชิดซ้าย
            }}>
                 <ul className="navbar-nav" style={{ listStyleType: 'none', marginLeft: '20px', padding: '0' }}>
                    <li className="nav-item mx-4">
                        <a className="nav-link" href="#" style={{ fontSize: '20px', color: '#000', display: 'flex', alignItems: 'center' }}>
                            <i className="bi bi-gear-fill" style={{ marginRight: '33px' }}></i>
                            รายการอุปกรณ์
                        </a>
                    </li>
                    <li className="nav-item mx-4">
                        <a className="nav-link" href="#" style={{ fontSize: '20px', color: '#000', display: 'flex', alignItems: 'center' }}>
                            <i className="bi bi-handbag-fill" style={{ marginRight: '33px' }}></i>
                            สถานะการยืม
                        </a>
                    </li>
                    <li className="nav-item mx-4">
                        <a className="nav-link" href="#" style={{ fontSize: '20px', color: '#000', display: 'flex', alignItems: 'center' }}>
                            <i className="bi bi-clock-history" style={{ marginRight: '33px' }}></i>
                            กำหนดการคืน
                        </a>
                    </li>
                </ul>

            </div>
        </div>
    );
};

export default AdminNavbar;
