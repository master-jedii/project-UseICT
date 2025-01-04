import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import Login from './components/login';
import Admin from './Admin/Admin';

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
        {/* เส้นทางที่มี Navbar */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Carousel />
            </MainLayout>
          }
        />
        {/* เส้นทางที่ไม่มี Navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/Admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;
