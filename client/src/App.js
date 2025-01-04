import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import Login from './components/login';
import Signup from './components/signup';
import Type from './components/type'
import Howtoborrow from './components/Howtoborrow';
import Admin from './Admin/Admin'


import Main from './components/main';
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
              <Type/>
              <Howtoborrow/>
              
            </MainLayout>

          }
        />
        {/* เส้นทางที่ไม่มี Navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/main" element={<Main />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;
