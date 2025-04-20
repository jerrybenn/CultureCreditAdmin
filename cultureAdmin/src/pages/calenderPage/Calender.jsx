import React, { useEffect, useState } from 'react';
import HorizontalNav from '../../components/horizontalNavbar/HorizontalNav.jsx';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';



import './Calender.css';
import axios from 'axios';

const Calender = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const startDate = `${currentYear}-01-01`;
        const endDate = `${currentYear}-12-31`;

        const res = await axios.get(`http://127.0.0.1:3841/events/daterange`, {
          params: {
            start_date: startDate,
            end_date: endDate
          }
        });

        const formattedEvents = res.data.map(event => ({
          title: event.title,
          date: event.date
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="calendarContainer">
      <HorizontalNav />
      <div className="mainContent">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
        />
      </div>
    </div>
  );
};

export default Calender;
