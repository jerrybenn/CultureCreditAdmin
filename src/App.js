import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Home from "./pages/homepage/Home";
import Navbar from "./components/navbarFolder/Navbar";
import Login from "./pages/loginFolder/Login";
import Events from "./pages/eventsPage/Events";
import Calender from "./pages/calenderPage/Calender";
import Students from "./pages/studentsPage/Students";
import Instructor from "./pages/instructorPage/Instructor";
import PageTransition from "./components/PageTransition";

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
      <div
        className="mainContent"
        style={{ marginLeft: showNavbar ? "220px" : "0px" }}
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Login />
                </PageTransition>
              }
            />
            <Route
              path="/home"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
            <Route
              path="/events"
              element={
                <PageTransition>
                  <Events />
                </PageTransition>
              }
            />
            <Route
              path="/calender"
              element={
                <PageTransition>
                  <Calender />
                </PageTransition>
              }
            />
            <Route
              path="/students"
              element={
                <PageTransition>
                  <Students />
                </PageTransition>
              }
            />
            <Route
              path="/instructor"
              element={
                <PageTransition>
                  <Instructor />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
