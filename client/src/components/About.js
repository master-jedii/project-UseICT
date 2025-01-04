import React, { useState } from 'react';
import '../View/About.css';
import Mapcity from '../assets/Mapcity.png';

const About = () => {
  const [selectedFaq, setSelectedFaq] = useState(null); // กำหนด state สำหรับเก็บคำถามที่ถูกเลือก
  const faqs = [
    "หากลงทะเบียน SU - KITS Account ไม่ได้ต้องทำอย่างไร",
    "ลืม USERNAME, PASSWORD ของ SU - KITS Account",
    "กรณีเปลี่ยนแปลงข้อมูลส่วนตัวของตนเอง (เปลี่ยนชื่อ-สกุล หรือข้อมูลอื่นๆ)",
    "SU - KITS คืออะไร",
  ];

  const handleClick = (index) => {
    // เช็คว่าเลือกคำถามเดียวกันไหม ถ้าเลือกก็ซ่อนข้อความ
    if (selectedFaq === index) {
      setSelectedFaq(null); // ซ่อนข้อความเมื่อคลิกซ้ำ
    } else {
      setSelectedFaq(index); // แสดงข้อความเมื่อคลิก
    }
  };

  return (
    <div className="faq-section">
      {/* ส่วนคำถามที่พบบ่อย */}
      <div className="faq-block1">
        <p>คำถามที่พบบ่อย</p>
        <ul className="faq-list">
          {faqs.map((faq, index) => (
            <li key={index} className="faq-item">
              <span>{faq}</span>
              <button 
                className="faq-button" 
                onClick={() => handleClick(index)} // เมื่อคลิกปุ่มจะเรียก handleClick
              >
                +
              </button>
              {selectedFaq === index && <p className="faq-answer">hi</p>}
            </li>
          ))}
          
          
        </ul>
        

      </div>

      

      {/* ส่วนแผนที่ */}
      <div className="faq-block2">
        <img src={Mapcity} alt="แผนที่เส้นทางเข้า-ออก เมืองทองธานี" />
      </div>
      
    </div>
    
  );
};

export default About;
