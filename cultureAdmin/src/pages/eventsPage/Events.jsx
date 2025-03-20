import React, { useState, useEffect } from 'react';
import HorizontalNav from '../../components/horizontalNavbar/HorizontalNav.jsx';
import './Events.css';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TablePagination from '@mui/material/TablePagination';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const Events = () => {
  const [data, setData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEventId, setOpenEventId] = useState(null); // Track open event for collapse
  const [dialogOpen, setDialogOpen] = useState(false); // Track dialog state
  const [selectedEventId, setSelectedEventId] = useState(null); // Store selected event ID

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

  const handleMenuClick = (event, eventId) => {
    setAnchorEl(event.currentTarget);
    setSelectedEventId(eventId); // Set the clicked event ID
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleDescription = (eventId) => {
    setOpenEventId(openEventId === eventId ? null : eventId); // Toggle collapse state
  };

  // Open dialog when "Send URL" is clicked
  const handleOpenDialog = (eventId) => {
    setDialogOpen(true);
    setSelectedEventId(eventId); // Ensure correct event ID is passed
    handleMenuClose(); // Close the menu when opening the dialog
  };

  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Log the event ID when sending an email
  const handleSendEmail = () => {
    console.log(`An email was just sent for event ID: ${selectedEventId}`);
    setDialogOpen(false); // Close the dialog after sending
  };

  // Close collapse when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".eventRow")) {
        setOpenEventId(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="eventsPageContainer">
      <HorizontalNav />
      <div className="mainContent">
        <table className="eventsTable">
          <thead>
            <tr>
              <th></th>
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
              <React.Fragment key={index}>
                {/* Main Row */}
                <tr className="eventRow">
                  <td onClick={(e) => { e.stopPropagation(); handleToggleDescription(event.id); }} style={{ cursor: "pointer" }}>
                    {openEventId === event.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </td>
                  <td>{event.title}</td>
                  <td>{event.host}</td>
                  <td>{event.location}</td>
                  <td>{formatDate(event.date)}</td>
                  <td>{event.time}</td>
                  <td>{event.credits}</td>
                  <td>{event.num_of_checkins}</td>
                  <td>{event.credit_expiry}</td>
                  <td>
                    <MoreHorizIcon onClick={(e) => handleMenuClick(e, event.id)} />
                  </td>
                </tr>

                {/* Collapsible Row */}
                <tr>
                  <td colSpan="10" style={{ padding: 0 }}>
                    <Collapse in={openEventId === event.id} timeout="auto" unmountOnExit>
                      <div className="eventDescription">
                        <div className="descriptionTitle">Event Description:</div>
                        {event.description}
                      </div>
                    </Collapse>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Dropdown Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => { console.log(`Edit event ${selectedEventId}`); handleMenuClose(); }}>
            Edit
          </MenuItem>
          <MenuItem onClick={() => { console.log(`Attendance for event ${selectedEventId}`); handleMenuClose(); }}>
            Attendance
          </MenuItem>
          <MenuItem onClick={() => { console.log(`Delete event ${selectedEventId}`); handleMenuClose(); }}>
            Delete
          </MenuItem>
          <MenuItem onClick={() => handleOpenDialog(selectedEventId)}>
            Send URL
          </MenuItem>
        </Menu>

        {/* Send URL Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Send Event URL</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the recipient's email to send the event URL.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="Recipient Email"
              type="email"
              fullWidth
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSendEmail} variant="contained" color="primary">
              Send Email
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Events;
