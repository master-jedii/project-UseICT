import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faClock, faMapMarkerAlt, faFacebook, faInstagram } from '@fortawesome/free-solid-svg-icons';
import '../View/Footer.css'; // อย่าลืมสร้างไฟล์ CSS เพื่อจัดการกับการออกแบบ
import logo from '../assets/LOGO.png'

const Footer = () => {
  return (
    <footer className="footer">
      {/* ส่วนติดต่อเรา */}
      <div className="footer-section contact">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="footer-icon" />
        <span>ติดต่อเรา</span>
        <p className='textfooter'>เลขที่ 80 ถนนป๊อปปูล่า ต.บ้านใหม่ อำเภอปากเกร็ด จังหวัดนนทบุรี 11120</p>
        <p className='textfooter'><FontAwesomeIcon icon={faPhone} /> โทรศัพท์: 09-1765-9890</p>
      </div>
      <div className="divider"></div>
      {/* ส่วนเวลาเปิด-ปิด */}
      <div className="footer-section hours">
        <FontAwesomeIcon icon={faClock} className="footer-icon" />
        <span>เวลาเปิดปิด</span>
        <p className='textfooter'>เปิด/ปิด วันจันทร์-วันศุกร์ เวลา 09.00-16.30 น.</p>
        <p className='textfooter'>หยุดเสาร์-อาทิตย์และวันหยุดนักขัตฤกษ์ เมืองทองธานี</p>
      </div>
      <div className="divider"></div>
      {/* ส่วนโลโก้ */}
      <div className="footer-section logo">
        <img src={logo} alt="Logo" className="logo-image" />
      </div>
    </footer>
  );
};

export default Footer;
