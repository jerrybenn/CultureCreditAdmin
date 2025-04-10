import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HorizontalNav from '../../components/horizontalNavbar/HorizontalNav.jsx';
import './Home.css';

import DashboardEventsTable from '../../components/dashboardEventsTableFolder/DashboardEventsTable.jsx';
import DashboardGraph from '../../components/dashboardGraphFolder/DashboardGraph.jsx';

import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import SchoolIcon from '@mui/icons-material/School';

const Home = () => {
  const studentCount = 0;
  const [instructorCount, setInstructorCount] = useState(0);
  const [completedEventsCount, setCompletedEventsCount] = useState(0);

  const [eventCount, setEventCount] = useState(0); // Total events for current month
  const [upcomingEventCount, setUpcomingEventCount] = useState(0); // Upcoming events for current month
  const [percentChangeEvent, setPercentChangeEvent] = useState(0); // Percent change from last month
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadMonthlyEvents = async () => {
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

      // === Fetch Current Month Events ===
      const resThisMonth = await fetch(
        `http://127.0.0.1:3841/events/daterange?start_date=${startStr}&end_date=${endStr}`
      );
      const thisMonthEvents = await resThisMonth.json();

      // === Fetch Last Month Events ===
      const resLastMonth = await fetch(
        `http://127.0.0.1:3841/events/daterange?start_date=${lastStartStr}&end_date=${lastEndStr}`
      );
      const lastMonthEvents = await resLastMonth.json();

      // === Separate Upcoming from Current Month ===
      const upcoming = thisMonthEvents.filter(
        (event) => new Date(event.date) >= now
      );
      
      // === Calculate Completed Events ===
      const completed = thisMonthEvents.filter(
        (event) => new Date(event.date) < now
      );

      // === Calculate % Change ===
      const thisCount = thisMonthEvents.length;
      const lastCount = lastMonthEvents.length;
      let percentChange = 0;

      if (lastCount === 0 && thisCount > 0) {
        percentChange = 100; // full jump
      } else if (lastCount === 0 && thisCount === 0) {
        percentChange = 0;
      } else {
        percentChange = ((thisCount - lastCount) / lastCount) * 100;
      }

      setEventCount(thisCount);
      setUpcomingEventCount(upcoming.length);
      setCompletedEventsCount(completed.length);
      setPercentChangeEvent(Math.round(percentChange)); // round it
      setData(thisMonthEvents);

      console.log('All events this month:', thisMonthEvents);
      console.log('Upcoming events this month:', upcoming);
      console.log('Completed events this month:', completed);
      console.log('All events last month:', lastMonthEvents);
    };

    const fetchInstructorCount = async () => {
      try {
        const res = await fetch('http://127.0.0.1:3841/instructors');
        const json = await res.json();
        const instructors = json.instructors || json;
        setInstructorCount(instructors.length);
      } catch (error) {
        console.error('Error fetching instructor count:', error);
      }
    };

    loadMonthlyEvents();
    fetchInstructorCount();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="dashBoardContainer">
      <HorizontalNav />
      <div className="mainContent"></div>

      <div className="smalldashboardInfoCard">
        {/* Total Events Card */}
        <div className="smallCard" onClick={() => navigate('/events')}>
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
        </div>

        {/* Upcoming Events Card */}
        <div className="smallCard" onClick={() => navigate('/events')}>
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
        </div>

        {/* Instructors Card */}
        <div className="smallCard" onClick={() => navigate('/instructor')}>
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
        </div>

        {/* Students Card */}
        <div className="smallCard" onClick={() => navigate('/students')}>
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
        </div>
      </div>

      <div className="largedashboardInfoCard">
        <DashboardGraph />
        <DashboardEventsTable />
      </div>
    </div>
  );
};

export default Home;
