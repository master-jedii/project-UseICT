import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../View/Carousel.css';

const Carousel = () => {
  const navigate = useNavigate();

  const handleBorrowClick = () => {
    const isLoggedIn = localStorage.getItem('token') || sessionStorage.getItem('authToken');

    if (isLoggedIn) {
      navigate('/main'); // เปลี่ยนเส้นทางไปยังหน้า main.js
    } else {
      navigate('/login'); // เปลี่ยนเส้นทางไปยังหน้า login.js
    }
  };

  return (
    <div id='imgpromote'>
      <p>
        การให้บริการยืม-คืนอุปกรณ์ กำหนดเปิด/ปิด วันจันทร์-วันศุกร หยุดเสาร์-อาทิตย์และวันหยุดนักขัตฤกษ์เวลา <br />
        09.00-16.30 น.
      </p>
      <button className='btn-borrow' onClick={handleBorrowClick}>
        ยืมคืนอุปกรณ์
      </button>
    </div>
  );
};

export default Carousel;
