import React, { useState, useEffect } from 'react';
import HorizontalNav from '../../components/horizontalNavbar/HorizontalNav.jsx';
import './Events.css';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
import { Tabs, Tab } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';

const Events = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEventId, setOpenEventId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedEvent, setEditedEvent] = useState({});



  useEffect(() => {
    const loadData = async () => {
      const response = await fetch('http://127.0.0.1:3841/events');
      const json = await response.json();
      setData(json.events);
    };
    loadData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleMenuClick = (event, eventId) => {
    setAnchorEl(event.currentTarget);
    setSelectedEventId(eventId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleDescription = (eventId) => {
    setOpenEventId(openEventId === eventId ? null : eventId);
  };

  const handleOpenDialog = (eventId) => {
    setDialogOpen(true);
    setSelectedEventId(eventId);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSendEmail = () => {
    const selectedEvent = data.find((event) => event.id === selectedEventId);
    const qrCodeUrl = `http://127.0.0.1:3841/qrcode/${selectedEvent?.nonce}`;
    console.log(`QR Code URL: ${qrCodeUrl}`);
    setDialogOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  

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

  const today = new Date();

  const filteredEvents = data.filter((event) => {
    const eventDate = new Date(event.date);
    const matchesTab = tabValue === 0 ? eventDate >= today : eventDate < today;
    const matchesSearch =
      searchQuery.trim() === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="eventsPageContainer">
      <HorizontalNav searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="tabsContainer">
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="event tabs">
          <Tab label="Upcoming Events" />
          <Tab label="Past Events" />
        </Tabs>
      </div>

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
            {filteredEvents
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((event, index) => (
                <React.Fragment key={index}>
                  <tr className="eventRow">
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleDescription(event.id);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {openEventId === event.id ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
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

            <tr>
              <td colSpan="10" style={{ padding: 0 }}>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredEvents.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    padding: '8px px',
                    '& .MuiTablePagination-toolbar': {
                      minHeight: '55px',
                      padding: 0,
                      marginRight: '20px',
                    },
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                      margin: 0,
                      marginRight: '30px',
                    },
                    '& .MuiInputBase-root': {
                      marginRight: '30px',
                    }
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => {
  const eventToEdit = data.find((e) => e.id === selectedEventId);
  setEditedEvent(eventToEdit || {});
  setEditDialogOpen(true);
  handleMenuClose();
}}>
  Edit
</MenuItem>

          <MenuItem onClick={() => { console.log(`Delete event ${selectedEventId}`); handleMenuClose(); }}>
            Delete
          </MenuItem>
          <MenuItem onClick={() => handleOpenDialog(selectedEventId)}>
            Send URL
          </MenuItem>
        </Menu>

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

        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
  <DialogTitle>Edit Event</DialogTitle>
  <DialogContent>
    <TextField
      margin="dense"
      label="Event Name"
      fullWidth
      value={editedEvent.title || ''}
      onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })}
    />
    <TextField
      margin="dense"
      label="Host"
      fullWidth
      value={editedEvent.host || ''}
      onChange={(e) => setEditedEvent({ ...editedEvent, host: e.target.value })}
    />
    <TextField
      margin="dense"
      label="Location"
      fullWidth
      value={editedEvent.location || ''}
      onChange={(e) => setEditedEvent({ ...editedEvent, location: e.target.value })}
    />
    <TextField
      margin="dense"
      label="Date"
      type="date"
      fullWidth
      InputLabelProps={{ shrink: true }}
      value={editedEvent.date || ''}
      onChange={(e) => setEditedEvent({ ...editedEvent, date: e.target.value })}
    />
    <TextField
      margin="dense"
      label="Time"
      type="time"
      fullWidth
      InputLabelProps={{ shrink: true }}
      value={editedEvent.time || ''}
      onChange={(e) => setEditedEvent({ ...editedEvent, time: e.target.value })}
    />
    <TextField
      margin="dense"
      label="Credits"
      fullWidth
      value={editedEvent.credits || ''}
      onChange={(e) => setEditedEvent({ ...editedEvent, credits: e.target.value })}
    />
    <TextField
      margin="dense"
      label="Checkins"
      fullWidth
      value={editedEvent.num_of_checkins || ''}
      onChange={(e) => setEditedEvent({ ...editedEvent, num_of_checkins: e.target.value })}
    />
    <TextField
  margin="dense"
  label="Expiration"
  type="datetime-local"
  fullWidth
  InputLabelProps={{ shrink: true }}
  value={
    editedEvent.credit_expiry
      ? new Date(editedEvent.credit_expiry).toISOString().slice(0, 16)
      : ''
  }
  onChange={(e) =>
    setEditedEvent({ ...editedEvent, credit_expiry: e.target.value })
  }
/>
    <TextField
      margin="dense"
      label="Description"
      fullWidth
      multiline
      rows={4}
      value={editedEvent.description || ''}
      onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setEditDialogOpen(false)} color="secondary">
      Cancel
    </Button>
    <Button
  variant="contained"
  onClick={async () => {
    try {
      // Format credit_expiry to match what Flask expects: "YYYY-MM-DD HH:MM:SS"
      const payload = {
        ...editedEvent,
        credit_expiry: new Date(editedEvent.credit_expiry)
          .toISOString()
          .slice(0, 19)
          .replace('T', ' '),
      };

      const res = await fetch(`http://127.0.0.1:3841/events/${editedEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updated = data.map(ev => ev.id === editedEvent.id ? payload : ev);
        setData(updated);
        setEditDialogOpen(false);
        alert('Event updated successfully!');
      } else {
        alert('Failed to update event.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating event.');
    }
  }}
>
  Save Changes
</Button>

  </DialogActions>
</Dialog>

      </div>
    </div>
  );
};

export default Events;
