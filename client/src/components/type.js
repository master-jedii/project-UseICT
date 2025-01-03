import React from 'react';
import '../View/Type.css';

const Type = () => {
  return (
    <div id='container'>
      <h2>หมวดอุปกรณ์</h2>
      
      {/* แถวแรกที่มี 4 กล่อง */}
      <div className='row'>
        <div className='category'>
          <div className='image-box'></div>
          <p className='category-text'>กล้อง</p> {/* ข้อความใต้กล่อง */}
        </div>
        <div className='category'>
          <div className='image-box2'></div>
          <p className='category-text'>เลนส์</p> {/* ข้อความใต้กล่อง */}
        </div>
        <div className='category'>
          <div className='image-box3'></div>
          <p className='category-text'>ขาตั้งกล้อง</p> {/* ข้อความใต้กล่อง */}
        </div>
        <div className='category'>
          <div className='image-box4'></div>
          <p className='category-text'>ไฟสำหรับถ่ายทำ</p> {/* ข้อความใต้กล่อง */}
        </div>
      </div>

      {/* แถวที่ 2 ที่มี 3 กล่องแบบสลับฟันปลา */}
      <div className='row alternate'>
        <div className='category'>
          <div className='image-box5'></div>
          <p className='category-text'>อุปกรณ์ด้านเสียง</p> {/* ข้อความใต้กล่อง */}
        </div>
        <div className='category'>
          <div className='image-box6'></div>
          <p className='category-text'>อุปกรณ์จัดแสง</p> {/* ข้อความใต้กล่อง */}
        </div>
        <div className='category'>
          <div className='image-box7'></div>
          <p className='category-text'>อุปกรณ์อื่นๆ</p> {/* ข้อความใต้กล่อง */}
        </div>
      </div>
    </div>
  );
};

export default Type;
