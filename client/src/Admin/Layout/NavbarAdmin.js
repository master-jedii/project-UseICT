import React from "react";
import { Link } from "react-router-dom";
import "./NavbarAdmin.css";

const NavbarAdmin = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <div className="hero-section">
        <img src="/LOGO.png" alt="Logo" className="logo" />
        <h1>ยินดีต้อนรับสู่ระบบจัดการอุปกรณ์</h1>
        <p>ระบบบริหารจัดการอุปกรณ์เพื่อความสะดวกและรวดเร็ว</p>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <Link to="/adminpage" className="btn btn-primary">
          <i className="fas fa-tools"></i> บันทึกและแก้ไขอุปกรณ์
        </Link>
        <Link to="/approve-return" className="btn btn-secondary">
          <i className="fas fa-undo-alt"></i> อนุมัติการคืน
        </Link>
        <Link to="/approve-borrow" className="btn btn-secondary">
          <i className="fas fa-hand-holding"></i> อนุมัติการยืม
        </Link>
        <Link to="/statistics" className="btn btn-secondary">
          <i className="fas fa-chart-bar"></i> สถิติการยืมคืน
        </Link>
      </div>

      {/* Footer */}
      <footer>
        <p>© 2025 ระบบจัดการอุปกรณ์ | มหาวิทยาลัยศิลปากร</p>
      </footer>
    </div>
  );
};

export default NavbarAdmin;
