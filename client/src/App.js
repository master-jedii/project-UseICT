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
                <Route path="/main" element={<Main />} />
                
                {/* หน้า Admin */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/showborrow" element={<Showborrow />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/mainadmin" element={<MainAdmin />} />
            </Routes>
        </Router>
    );
};

export default App;

