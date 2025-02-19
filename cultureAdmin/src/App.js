import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/homepage/Home';
import Login from './pages/loginFolder/Login';



function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>

  )
}

export default App;
