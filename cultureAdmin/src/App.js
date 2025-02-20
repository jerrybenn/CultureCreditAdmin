import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Home from './pages/homePage/Home';
import Navbar from './components/navbarFolder/Navbar';
import Login from './pages/loginFolder/Login';

function App() {
  return (
    <BrowserRouter>
      <MainContent />
    </BrowserRouter>
  );
}

function MainContent() {
  const location = useLocation(); // Get current route
  const showNavbar = location.pathname !== "/"; // Determine if Navbar should be shown

  return (
    <div className="appContainer">
      {showNavbar && <Navbar />}

      {/* ✅ Dynamically adjust margin based on Navbar visibility */}
      <div className="mainContent" style={{ marginLeft: showNavbar ? "220px" : "0px" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
