import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import Login from './components/login';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Carousel />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

const login = () => {
  return (
      <div className="App">
        <Button variant="contained">Hello world</Button>
      </div>
  );
}




export default App;
