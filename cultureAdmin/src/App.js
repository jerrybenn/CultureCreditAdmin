import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Home from './pages/homepage/Home';
import Navbar from './components/navbarFolder/Navbar';
import Login from './pages/loginFolder/Login';
import Events from './pages/eventsPage/Events';
import Calender from './pages/calenderPage/Calender';
import Students from './pages/studentsPage/Students';

function App() {
  return (
    <BrowserRouter>
      <MainContent />
    </BrowserRouter>
  );
}

function MainContent() {
  const location = useLocation(); 
  const showNavbar = location.pathname !== "/";
  return (
    <div className="appContainer">
      {showNavbar && <Navbar />}
      <div className="mainContent" style={{ marginLeft: showNavbar ? "220px" : "0px" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path= "/events" element={<Events />} />
          <Route path= "/calender" element={<Calender/>} />
          <Route path= "/students" element={<Students/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
