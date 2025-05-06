import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';


import HorizontalNav from '../../components/horizontalNavbar/HorizontalNav.jsx';
import './Home.css';

import DashboardEventsTable from '../../components/dashboardEventsTableFolder/DashboardEventsTable.jsx';
import DashboardGraph from '../../components/dashboardGraphFolder/DashboardGraph.jsx';
import DashboardGraphLine from '../../components/dashboardGraphFolder/DashboardGraphLine.jsx';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import SchoolIcon from '@mui/icons-material/School';

const Home = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [instructorCount, setInstructorCount] = useState(0);
  const [completedEventsCount, setCompletedEventsCount] = useState(0);

  const [eventCount, setEventCount] = useState(0); // Total events for current month
  const [upcomingEventCount, setUpcomingEventCount] = useState(0); // Upcoming events for current month
  const [percentChangeEvent, setPercentChangeEvent] = useState(0); // Percent change from last month
  const [data, setData] = useState([]);
  useEffect(() => {
    const loadMonthlyEvents = async () => {
      const token = localStorage.getItem("token");
      const now = new Date();
  
      // === CURRENT MONTH ===
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const startStr = startOfThisMonth.toISOString().split('T')[0];
      const endStr = endOfThisMonth.toISOString().split('T')[0];
  
      // === LAST MONTH ===
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      const lastStartStr = startOfLastMonth.toISOString().split('T')[0];
      const lastEndStr = endOfLastMonth.toISOString().split('T')[0];
  
      const headers = {
        Authorization: `Bearer ${token}`
      };
  
      const resThisMonth = await fetch(
        `http://127.0.0.1:3841/events/daterange?start_date=${startStr}&end_date=${endStr}`,
        { headers }
      );
      const thisMonthEvents = await resThisMonth.json();
  
      const resLastMonth = await fetch(
        `http://127.0.0.1:3841/events/daterange?start_date=${lastStartStr}&end_date=${lastEndStr}`,
        { headers }
      );
      const lastMonthEvents = await resLastMonth.json();
  
      const upcoming = thisMonthEvents.filter(
        (event) => new Date(event.date) >= now
      );
  
      const completed = thisMonthEvents.filter(
        (event) => new Date(event.date) < now
      );
  
      const thisCount = thisMonthEvents.length;
      const lastCount = lastMonthEvents.length;
      let percentChange = 0;
  
      if (lastCount === 0 && thisCount > 0) {
        percentChange = 100;
      } else if (lastCount === 0 && thisCount === 0) {
        percentChange = 0;
      } else {
        percentChange = ((thisCount - lastCount) / lastCount) * 100;
      }
  
      setEventCount(thisCount);
      setUpcomingEventCount(upcoming.length);
      setCompletedEventsCount(completed.length);
      setPercentChangeEvent(Math.round(percentChange));
      setData(thisMonthEvents);
    };
  
    const fetchStudentAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`
        };
  
        const currentYear = new Date().getFullYear();
        const startDate = `${currentYear}-01-01`;
        const endDate = `${currentYear}-12-31`;
  
        const res = await fetch(
          `http://127.0.0.1:3841/student_attendance/${startDate}/${endDate}`,
          { headers }
        );
        const json = await res.json();
  
        if (json["student attendance"] !== undefined) {
          setStudentCount(json["student attendance"]);
        } else {
          console.warn("Student attendance field missing in response", json);
        }
      } catch (error) {
        console.error("Error fetching student attendance:", error);
      }
    };
  
    const fetchInstructorCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`
        };
  
        const res = await fetch('http://127.0.0.1:3841/instructors', { headers });
        const json = await res.json();
        const instructors = json.instructors || json;
        setInstructorCount(instructors.length);
      } catch (error) {
        console.error('Error fetching instructor count:', error);
      }
    };
  
    loadMonthlyEvents();
    fetchInstructorCount();
    fetchStudentAttendance();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="dashBoardContainer">
      <HorizontalNav />
      <div className="mainContent"></div>

      <div className="smalldashboardInfoCard">
        {/* Total Events Card */}
        <motion.div
          className="smallCard"
          onClick={() => navigate('/events')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>

          <div className="smallCardTop">
            <div className="cardImageAndCategory">
          
              <div className="category">Total Events</div>
            </div>
            <div className="arrowIcon">
              <EventSeatIcon sx={{ color: '#06ADE4', fontSize: '25px' }} />
            </div>
          </div>

          <div className="cardInfo">
            <div className="amount">{eventCount}</div>
            <div className="bottomCardDescription">
              {percentChangeEvent > 0 ? '+' : ''}
              {percentChangeEvent}% from last month
            </div>
          </div>
        </motion.div>

        {/* Upcoming Events Card */}
        <motion.div 
          className="smallCard" 
          onClick={() => navigate('/events')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="smallCardTop">
            <div className="cardImageAndCategory">
              <div className="category">Upcoming Events</div>
            </div>
            <div className="arrowIcon">
              <ConfirmationNumberIcon sx={{ color: '#06ADE4', fontSize: '25px' }} />
            </div>
          </div>
          <div className="cardInfo">
            <div className="amount">{upcomingEventCount}</div>
            <div className="bottomCardDescription">
              {completedEventsCount} events completed
            </div>
          </div>
        </motion.div>

        {/* Instructors Card */}
        <motion.div 
          className="smallCard" 
          onClick={() => navigate('/instructor')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="smallCardTop">
            <div className="cardImageAndCategory">
              <div className="category">Instructors</div>
            </div>
            <div className="arrowIcon">
              <SchoolIcon sx={{ color: '#06ADE4', fontSize: '25px' }} />
            </div>
          </div>
          <div className="cardInfo">
            <div className="amount">{instructorCount}</div>
            <div className="bottomCardDescription">
              total instructors
            </div>
          </div>
        </motion.div>

        {/* Students Card */}
        <motion.div 
          className="smallCard" 
          onClick={() => navigate('/students')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}>
          <div className="smallCardTop">
            <div className="cardImageAndCategory">
              <div className="category">Students</div>
            </div>
            <div className="arrowIcon">
              <GroupsIcon sx={{ color: '#06ADE4', fontSize: '25px' }} />
            </div>
          </div>
          <div className="cardInfo">
            <div className="amount">{studentCount}</div>
            <div className="bottomCardDescription">
              total students
            </div>
          </div>
        </motion.div>
      </div>

      <div className="largedashboardInfoCard">
       <div className="ContainerGraph">
          <DashboardGraph />
          <DashboardGraphLine/>
          </div>
        <DashboardEventsTable />
      </div>
    </div>
  );
};

export default Home;
