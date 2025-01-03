import React from 'react';
import logo from '../assets/LOGO.png'; // นำเข้าโลโก้ (แก้ path ตามโครงสร้างของคุณ)
import '../App.css'

const Navbar = () => {
    return (
        <nav className="navbar navbar-light bg-white px-5" >
            <div className="d-flex align-items-center">
                {/* โลโก้ด้านซ้าย */}
                <a className="navbar-brand" href="#">
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ height: '105px' }}
                    />
                </a>
            </div>
            {/* ลิงก์ตรงกลาง */}
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
            {/* ปุ่มเข้าสู่ระบบด้านขวา */}
            <div className="d-flex align-items-center">
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
                        fontFamily: "'Sarabun', sans-serif"  // ฟอนต์เดียวกันกับ Navbar
                    }}
                >
                    เข้าสู่ระบบ
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
