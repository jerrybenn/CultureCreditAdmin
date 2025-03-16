import React, { useState, useEffect } from 'react';
import HorizontalNav from '../../components/horizontalNavbar/HorizontalNav.jsx';
import './Events.css';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TablePagination from '@mui/material/TablePagination';

const Events = () => {
  const [data, setData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      console.log('fetching data');
      const d = await fetch('http://127.0.0.1:5000/events');
      const json = await d.json();
      setData(json.events);
      console.log('done fetching data');
    };
    loadData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleClick = (event, eventId) => {
    setAnchorEl(event.currentTarget);
    setSelectedEvent(eventId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  const [page, setPage] = React.useState(2);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="eventsPageContainer">
      <HorizontalNav />
      <div className="mainContent">
        <table className="eventsTable">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Host</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
              <th>#CC</th>
              <th>Checkins</th>
              <th>Expiration</th>
              <th>More</th>
            </tr>
          </thead>
          <tbody>
            {data.map((event, index) => (
              <tr key={index}>
                <td>{event.title}</td>
                <td>{event.host}</td>
                <td>{event.location}</td>
                <td>{formatDate(event.date)}</td>
                <td>{event.time}</td>
                <td>{event.credits}</td>
                <td>{event.num_of_checkins}</td>
                <td>{event.credit_expiry}</td>
                <td>
                    <MoreHorizIcon onClick={(e) => handleClick(e, event.id)}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => { console.log(`Edit event ${selectedEvent}`); handleClose(); }}>
            Edit
          </MenuItem>
          <MenuItem onClick={() => { console.log(`Attendance for event ${selectedEvent}`); handleClose(); }}>
            Attendance
          </MenuItem>
          <MenuItem onClick={() => { console.log(`Delete event ${selectedEvent}`); handleClose(); }}>
            Delete
          </MenuItem>
          <MenuItem onClick={() => { console.log(`Send url for event ${selectedEvent}`); handleClose(); }}>
            Send Url
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Events;
