import React, { useEffect, useState } from 'react';
import HorizontalNav from '../../components/horizontalNavbar/HorizontalNav.jsx';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { motion } from 'framer-motion';
import './Calender.css';
import axios from 'axios';

const Calender = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Not authorized. Please log in.");
          window.location.href = '/';
          return;
        }

        const currentYear = new Date().getFullYear();
        const startDate = `${currentYear}-01-01`;
        const endDate = `${currentYear}-12-31`;

        const res = await axios.get(`http://127.0.0.1:3841/events/daterange`, {
          params: {
            start_date: startDate,
            end_date: endDate
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const formattedEvents = res.data.map(event => ({
          title: event.title,
          date: event.date,
          backgroundColor: '#06ADE4',
          borderColor: '#06ADE4',
          textColor: '#ffffff',
          classNames: ['event-animation']
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        if (error.response?.status === 401) {
          alert("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          window.location.href = '/';
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <motion.div 
      className="calendarContainer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HorizontalNav />
      <motion.div 
        className="mainContent"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {isLoading ? (
          <motion.div
            className="loading-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Loading calendar...
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              height="auto"
              eventDidMount={(info) => {
                // Add animation to each event when it mounts
                info.el.style.animation = 'eventPopIn 0.3s ease-out forwards';
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Calender;
