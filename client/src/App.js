import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import PrivateRoute from './Admin/Layout/Private.js';  // การนำเข้า PrivateRoute ที่สร้างขึ้น
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
  return (
    <Router>
      <Routes>
        {/* หน้าแรก */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Carousel />
              <div id="type">
                <Type />
              </div>
              <div id="Howtoborrow">
                <Howtoborrow />
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

        {/* หน้า Admin */}{/* หน้า Dashboard ที่ต้องการการเข้าถึงจาก admin เท่านั้น */}
        <Route path="/admin" element={<PrivateRoute element={<Admin />} />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/mainadmin" element={<PrivateRoute element={<MainAdmin />}/>} />
        <Route path="/offerborrow" element={<PrivateRoute element={<OfferBorrow />}/>} />
        <Route path="/admin/equipment/code" element={<PrivateRoute element={<UpdateTypeId />}/>} />
        <Route path="return-schedule" element={<PrivateRoute element={<ReturnSchedule />}/>} />
        <Route path="ManageUser" element={<PrivateRoute element={<ManageUser/>}/>} />
        <Route path="/allEquipment" element={<AllEquipment />} />
      </Routes>
    </Router>
  );
};

export default App;
