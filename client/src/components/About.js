import React, { useState } from "react";
import "../View/About.css";
import Mapcity from "../assets/Mapcity.png";

const About = () => {
  const [selectedFaq, setSelectedFaq] = useState(null);
  const faqs = [
    {
      question: "หากลงทะเบียน SU - KITS Account ไม่ได้ต้องทำอย่างไร",
      answer: "คุณสามารถติดต่อฝ่าย IT ได้ที่อีเมล su-kits-support@example.com",
    },
    {
      question: "ลืม USERNAME, PASSWORD ของ SU - KITS Account",
      answer: "กรุณากด 'ลืมรหัสผ่าน' ในหน้าเข้าสู่ระบบเพื่อรีเซ็ตรหัสผ่าน",
    },
    {
      question:
        "กรณีเปลี่ยนแปลงข้อมูลส่วนตัวของตนเอง (เปลี่ยนชื่อ-สกุล หรือข้อมูลอื่นๆ)",
      answer: "คุณต้องยื่นคำร้องขอแก้ไขข้อมูลผ่านฝ่ายทะเบียน",
    },
    {
      question: "SU - KITS คืออะไร",
      answer: "SU-KITS เป็นระบบจัดการบัญชีและข้อมูลส่วนตัวสำหรับนักศึกษา",
    },
  ];

  const handleClick = (index) => {
    setSelectedFaq(selectedFaq === index ? null : index);
  };

  return (
    <div className="faq-section">
      {/* ส่วนคำถามที่พบบ่อย */}
      <div className="faq-block1">
      <h1>คำถามที่พบบ่อย</h1>   
        <ul className="faq-list">
          {faqs.map((faq, index) => (
            <li key={index} className="faq-item">
              <div className="faq-header" onClick={() => handleClick(index)}>
                <span>{faq.question}</span>
                <button className="faq-button">{selectedFaq === index ? "−" : "+"}</button>
              </div>
              <div
                className={`faq-answer-wrapper ${
                  selectedFaq === index ? "open" : ""
                }`}
              >
                <p className="faq-answer">{faq.answer}</p>
              </div>
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
