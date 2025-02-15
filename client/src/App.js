import React, { useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import Login from './components/login';
import Signup from './components/signup';
import Type from './components/type';
import Howtoborrow from './components/Howtoborrow';
import About from './components/About';
import Footer from './components/Footer';
import Main from './components/main';
import Showborrow from './interface/showborrow.js';
import Dashboard from './Admin/Layout/Dashboard.js';
import MainAdmin from './Admin/Layout/MainAdmin.js';
import Admin from './Admin/Admin.js';
import AllEquipment from './interface/AllEquipment.js';
import Status from './components/status.js';
import EquipmentListByType from './interface/EquipmentListByType';
import PrivateRoute from './Admin/Layout/Private.js';
import OfferBorrow from './Admin/Layout/offerBorrow.js';
import UpdateTypeId from './Admin/Layout/UpdataTypeid.js';
import ReturnSchedule from './Admin/Layout/ReturnSchedule.js';
import Return from './components/return.js';
import ManageUser from './Admin/Layout/ManageUser.js';

const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

const App = () => {
  const swiperRef = useRef(null);

  // ฟังการเปลี่ยนแปลงของ event 'changeSlide'
  useEffect(() => {
    const handleSlideChange = (event) => {
      if (swiperRef.current) {
        // ถ้า event ที่ได้รับเป็น 'Howtoborrow' ให้เลื่อนไปที่สไลด์ที่ 1 (สไลด์ที่ 2)
        if (event.detail === 'Howtoborrow') {
          swiperRef.current.swiper.slideTo(1);
        }
      }
    };

    // ฟังการเปลี่ยนแปลงของ event 'changeSlide'
    window.addEventListener('changeSlide', handleSlideChange);

    return () => {
      window.removeEventListener('changeSlide', handleSlideChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* หน้าแรก */}
        <Route
          path="/"
          element={
            <MainLayout>
              {/* Swiper ทำให้ Carousel และ Howtoborrow เลื่อนได้ */}
              <Swiper
                ref={swiperRef}
                modules={[Autoplay, Navigation, Pagination]}
                autoplay={{
                  delay: 5500, // เลื่อนอัตโนมัติทุก 5.5 วิ
                  disableOnInteraction: false, // เลื่อนต่อเนื่องหลังจากการโต้ตอบ
                }}
                navigation // แสดงปุ่มลูกศร
                pagination={{ clickable: true }} // จุดบอกตำแหน่ง
                spaceBetween={50}
                slidesPerView={1}
                style={{ width: '100%', height: 'auto' }}
              >
                <SwiperSlide>
                  <Carousel />
                </SwiperSlide>
                <SwiperSlide>
                  <Howtoborrow />
                </SwiperSlide>
              </Swiper>
              <div id="type">
                <Type />
              </div>
              <div id="About">
                <About />
              </div>
              <div id="Footer">
                <Footer />
              </div>
            </MainLayout>
          }
        />
        {/* หน้าล็อกอิน */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* content user */}
        <Route path="/main" element={<Main />} />
        <Route path="/status" element={<Status />} />
        <Route path="/return" element={<Return />} />
        <Route path="/equipment/:typeId" element={<EquipmentListByType />} />
        <Route path="/allEquipment" element={<AllEquipment />} />
        <Route path="/showborrow" element={<Showborrow />} />

        {/* หน้า Admin */}
        <Route path="/admin" element={<PrivateRoute element={<Admin />} />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/mainadmin" element={<PrivateRoute element={<MainAdmin />} />} />
        <Route path="/offerborrow" element={<PrivateRoute element={<OfferBorrow />} />} />
        <Route path="/admin/equipment/code" element={<PrivateRoute element={<UpdateTypeId />} />} />
        <Route path="/return-schedule" element={<PrivateRoute element={<ReturnSchedule />} />} />
        <Route path="/ManageUser" element={<PrivateRoute element={<ManageUser />} />} />
      </Routes>
    </Router>
  );
};

export default App;
