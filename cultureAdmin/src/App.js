import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/homepage/Home";
import Navbar from "./components/navbarFolder/Navbar";
import Login from "./pages/loginFolder/Login";
import Events from "./pages/eventsPage/Events";
import Calender from "./pages/calenderPage/Calender";
import Students from "./pages/studentsPage/Students";
import Instructor from "./pages/instructorPage/Instructor";
import AddAdmin from "./pages/addAdminPage/AddAdmin";
import AdminResetPassword from "./pages/adminResetPasswordPage/AdminResetPassword";
import ForgotPassword from "./pages/forgotPasswordPage/forgotPassword";

function App() {
  return (
    <BrowserRouter>
      <MainContent />
    </BrowserRouter>
  );
}

function MainContent() {
  const location = useLocation();
  const showNavbar =
    location.pathname !== "/" && location.pathname !== "/addAdmin" && location.pathname !== "/adminResetPassword" && location.pathname !== "/forgotpassword";
  return (
    <div className="appContainer">
      {showNavbar && <Navbar />}
      <div
        className="mainContent"
        style={{
          marginLeft:
            location.pathname === "/addAdmin" || location.pathname === "/adminResetPassword"
              ? "0px"
              : showNavbar
              ? "220px"
              : "0px",
        }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/calender" element={<Calender />} />
          <Route path="/students" element={<Students />} />
          <Route path="/instructor" element={<Instructor />} />
          <Route path="/addAdmin" element={<AddAdmin />} />
          <Route path="/adminResetPassword" element={<AdminResetPassword />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
