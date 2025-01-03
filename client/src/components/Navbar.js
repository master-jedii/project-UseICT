import React from 'react';
import logo from '../assets/LOGO.png'; // นำเข้าโลโก้ (แก้ path ตามโครงสร้างของคุณ)

const Navbar = () => {
    return (
        <nav className="navbar navbar-light bg-white px-4">
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
                        <a className="nav-link" href="#">หมวดหมู่อุปกรณ์</a>
                    </li>
                    <li className="nav-item mx-4">
                        <a className="nav-link" href="#">วิธีใช้งานอุปกรณ์</a>
                    </li>
                    <li className="nav-item mx-4">
                        <a className="nav-link" href="#">ศึกษาเพิ่มเติม</a>
                    </li>
                    <li className="nav-item mx-4">
                        <a className="nav-link" href="#">ติดต่อเรา</a>
                    </li>
                </ul>
            </div>
            {/* ปุ่มเข้าสู่ระบบด้านขวา */}
            <div className="d-flex align-items-center">
                <button className="btn btn-primary">เข้าสู่ระบบ</button>
            </div>
        </nav>
    );
};

export default Navbar;
