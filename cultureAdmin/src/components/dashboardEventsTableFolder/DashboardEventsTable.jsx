import { React, useEffect, useState } from 'react';
import './DashboardEventsTable.css';

const DashboardEventsTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      console.log('fetching data');

      try {
        const token = localStorage.getItem('token');

        const res = await fetch('http://127.0.0.1:3841/events', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const json = await res.json();

        if (json.events) {
          setData(json.events);
        } else {
          console.warn("Unexpected response:", json);
        }

        console.log(res);
        console.log(json.events);
        console.log('done fetching data');
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="table-container">
      <table className="event-table">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Host</th>
            <th>Location</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 5).map((events, index) => (
            <tr key={index}>
              <td>{events.title}</td>
              <td>{events.host}</td>
              <td>{events.location}</td>
              <td>{events.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardEventsTable;
