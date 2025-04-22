import React, { useState, useEffect, useMemo } from 'react';
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
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
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
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [attendingStudents, setAttendingStudents] = useState([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Get token from localStorage once
  const token = localStorage.getItem("token");
  // Define headers outside of render cycle
  const headers = useMemo(() => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }), [token]);

  const selectedEvent = useMemo(() => 
    [...upcomingEvents, ...pastEvents].find((event) => event.id === selectedEventId),
    [upcomingEvents, pastEvents, selectedEventId]
  );

  useEffect(() => {
    console.log("Current token:", token ? "exists" : "missing");
    
    if (!token) {
      console.log("No token found, redirecting to login");
      alert("Not authorized. Please log in.");
      window.location.href = '/';
      return;
    }
  
    const loadEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const today = new Date();
        const thisYearStart = new Date(today.getFullYear(), 0, 1);
        const startDateStr = thisYearStart.toISOString().split('T')[0];
        const endDateStr = today.toISOString().split('T')[0];
  
        console.log("Fetching events with headers:", headers);
        
        const [upcomingRes, pastRes] = await Promise.all([
          fetch('http://127.0.0.1:3841/events', { 
            method: 'GET',
            headers,
            mode: 'cors'
          }),
          fetch(`http://127.0.0.1:3841/events/daterange?start_date=${startDateStr}&end_date=${endDateStr}`, { 
            method: 'GET',
            headers,
            mode: 'cors'
          })
        ]);
  
        console.log("Upcoming response status:", upcomingRes.status);
        console.log("Past response status:", pastRes.status);
  
        if (upcomingRes.status === 401 || pastRes.status === 401) {
          console.log("Unauthorized response received");
          setError("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          window.location.href = '/';
          return;
        }
        
        if (!upcomingRes.ok || !pastRes.ok) {
          throw new Error(`API error: Upcoming status: ${upcomingRes.status}, Past status: ${pastRes.status}`);
        }
  
        const upcomingJson = await upcomingRes.json();
        const pastJson = await pastRes.json();
  
        console.log("Upcoming events data:", upcomingJson);
        console.log("Past events data:", pastJson);
  
        if (!upcomingJson || !pastJson) {
          console.error("Invalid response format:", { upcomingJson, pastJson });
          setError("Invalid response format from server");
          return;
        }
  
        setUpcomingEvents(Array.isArray(upcomingJson.events) ? upcomingJson.events : []);
        setPastEvents(Array.isArray(pastJson) ? pastJson : []);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError(`Failed to fetch events: ${err.message}`);
        setUpcomingEvents([]);
        setPastEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadEvents();
  }, [token]); // Only depend on token, remove headers dependency

  const eventsToDisplay = useMemo(() => 
    tabValue === 0 ? upcomingEvents : pastEvents,
    [tabValue, upcomingEvents, pastEvents]
  );

  const filteredEvents = useMemo(() => 
    eventsToDisplay.filter((event) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    }),
    [eventsToDisplay, searchQuery]
  );

  const formatDate = (dateString, timeString) => {
    if (!dateString || !timeString) return "N/A";
    const combined = new Date(`${dateString}T${timeString}`);

    return combined.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
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

  const handleAttendanceClick = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:3841/attendance/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setAttendingStudents(data);
        setAttendanceDialogOpen(true);
      } else {
        console.error('Failed to fetch attendance data');
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      handleMenuClose(); // Close the context menu
    }
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

  const formatDateOnly = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().slice(0, 10);
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().slice(0, 19).replace('T', ' ');
  };


  const downloadCSV = () => {
    if (!attendingStudents.length) return;
  
    const csvHeaders = ['First Name', 'Last Name', 'Email'];
    const rows = attendingStudents.map(student => [
      student.first_name,
      student.last_name,
      student.email
    ]);
  
    const csvContent = [
      csvHeaders.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "attendance_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  return (
    <div className="eventsPageContainer">
      <HorizontalNav searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="mainContent">
        {isLoading ? (
          <div className="loading-container">
            <p>Loading events...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = '/';
              }}
            >
              Go to Login
            </Button>
          </div>
        ) : (
          <>
            <div className="tabsContainer">
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="event tabs">
                <Tab label="Upcoming Events" />
                <Tab label="Past Events" />
              </Tabs>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="no-events-container">
                <p>No events found.</p>
              </div>
            ) : (
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
                      <React.Fragment key={event.id || index}>
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
                          <td>{formatDate(event.date, event.time)}</td>
                          <td>{event.time}</td>
                          <td>{event.credits}</td>
                          <td>{event.num_of_checkins}</td>
                          <td>{event.credit_expiry}</td>
                          <td>
                            <MoreHorizIcon 
                              onClick={(e) => handleMenuClick(e, event.id)}
                              style={{ cursor: 'pointer' }}
                            />
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
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="10">
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredEvents.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                          padding: '8px',
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
                </tfoot>
              </table>
            )}
          </>
        )}

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => {
            const allEvents = [...upcomingEvents, ...pastEvents];
            const eventToEdit = allEvents.find((e) => e.id === selectedEventId);
            setEditedEvent(eventToEdit || {});
            setEditDialogOpen(true);
            handleMenuClose();
          }}>
            Edit
          </MenuItem>

          <MenuItem onClick={() => {
  const allEvents = [...upcomingEvents, ...pastEvents];
  const toDelete = allEvents.find((e) => e.id === selectedEventId);
  setEventToDelete(toDelete);
  setDeleteConfirmOpen(true);
  handleMenuClose();
}}>
  Delete
</MenuItem>

          <MenuItem onClick={() => handleOpenDialog(selectedEventId)}>
            Send URL
          </MenuItem>
          <MenuItem onClick={() => handleAttendanceClick(selectedEventId)}>
          Attendance
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

        <Dialog open={attendanceDialogOpen} onClose={() => setAttendanceDialogOpen(false)} fullWidth maxWidth="sm">
  <DialogTitle>Attending Students</DialogTitle>
  <DialogContent>
    {attendingStudents.length > 0 ? (
      <ul>
        {attendingStudents.map((student, index) => (
          <li key={index}>
            {student.first_name} {student.last_name} - {student.email}
          </li>
        ))}
      </ul>
    ) : (
      <DialogContentText>No students attended this event yet.</DialogContentText>
    )}
  </DialogContent>
  <DialogActions>
  <Button onClick={downloadCSV} variant="outlined" color="secondary">
    Export CSV
  </Button>
  <Button onClick={() => setAttendanceDialogOpen(false)} color="primary">
    Close
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
              required
              value={editedEvent.title || ''} 
              onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })} 
            />
            <TextField 
              margin="dense" 
              label="Host" 
              fullWidth 
              required
              value={editedEvent.host || ''} 
              onChange={(e) => setEditedEvent({ ...editedEvent, host: e.target.value })} 
            />
            <TextField 
              margin="dense" 
              label="Location" 
              fullWidth 
              required
              value={editedEvent.location || ''} 
              onChange={(e) => setEditedEvent({ ...editedEvent, location: e.target.value })} 
            />
            <TextField 
              margin="dense" 
              label="Date" 
              type="date" 
              fullWidth 
              required
              InputLabelProps={{ shrink: true }} 
              value={editedEvent.date || ''} 
              onChange={(e) => setEditedEvent({ ...editedEvent, date: e.target.value })} 
            />
            <TextField 
              margin="dense" 
              label="Time" 
              type="time" 
              fullWidth 
              required
              InputLabelProps={{ shrink: true }} 
              value={editedEvent.time || ''} 
              onChange={(e) => setEditedEvent({ ...editedEvent, time: e.target.value })} 
            />
            <TextField 
              margin="dense" 
              label="Credits" 
              type="number"
              fullWidth 
              required
              value={editedEvent.credits || ''} 
              onChange={(e) => setEditedEvent({ ...editedEvent, credits: e.target.value })} 
            />
            <TextField 
              margin="dense" 
              label="Checkins" 
              type="number"
              fullWidth 
              value={editedEvent.num_of_checkins || ''} 
              onChange={(e) => setEditedEvent({ ...editedEvent, num_of_checkins: e.target.value })} 
            />
            <TextField 
              margin="dense" 
              label="Expiration" 
              type="datetime-local" 
              fullWidth 
              required
              InputLabelProps={{ shrink: true }} 
              value={editedEvent.credit_expiry ? new Date(editedEvent.credit_expiry).toISOString().slice(0, 16) : ''} 
              onChange={(e) => setEditedEvent({ ...editedEvent, credit_expiry: e.target.value })} 
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
            
            <div style={{ marginTop: '16px', marginBottom: '16px' }}>
              <TextField
                margin="dense"
                type="file"
                fullWidth
                InputLabelProps={{ shrink: true }}
                label="Event Image"
                inputProps={{ accept: 'image/*' }}
                onChange={handleImageChange}
              />
              
              {imagePreview && (
                <div style={{ marginTop: '16px' }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} 
                  />
                </div>
              )}
              {editedEvent.image_url && !imagePreview && (
                <div style={{ marginTop: '16px' }}>
                  <p>Current image:</p>
                  <img 
                    src={editedEvent.image_url} 
                    alt="Current" 
                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} 
                  />
                </div>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={async () => {
                try {
                  // Validate required fields
                  if (!editedEvent.title || !editedEvent.host || !editedEvent.location || 
                      !editedEvent.date || !editedEvent.time || !editedEvent.credits || 
                      !editedEvent.credit_expiry) {
                    alert('Please fill in all required fields');
                    return;
                  }

                  let base64Image = null;
                  if (imageFile) {
                    try {
                      base64Image = await toBase64(imageFile);
                    } catch (error) {
                      console.error('Error converting image to base64:', error);
                      alert('Failed to process image');
                      return;
                    }
                  }

                  const payload = {
                    ...editedEvent,
                    date: formatDateOnly(editedEvent.date),
                    credit_expiry: formatDateTime(editedEvent.credit_expiry),
                    image: base64Image || editedEvent.image_url
                  };

                  const res = await fetch(`http://127.0.0.1:3841/events/${editedEvent.id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload),
                  });

                  if (res.ok) {
                    const updatedUpcoming = upcomingEvents.map(ev => ev.id === editedEvent.id ? payload : ev);
                    setUpcomingEvents(updatedUpcoming);
                    setEditDialogOpen(false);
                    setImageFile(null);
                    setImagePreview(null);
                    alert('Event updated successfully!');
                  } else {
                    throw new Error('Failed to update event');
                  }
                } catch (err) {
                  console.error(err);
                  alert('Error updating event. Please try again.');
                }
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the event: 
              <strong> {eventToDelete?.title}</strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button 
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");
const res = await fetch(`http://127.0.0.1:3841/events/${eventToDelete.id}`, {
  method: 'DELETE',
  headers: {
    Authorization: `Bearer ${token}`
  }
});


                  if (res.ok) {
                    // Remove from state
                    setUpcomingEvents(prev => prev.filter(e => e.id !== eventToDelete.id));
                    setPastEvents(prev => prev.filter(e => e.id !== eventToDelete.id));
                    setDeleteConfirmOpen(false);
                    alert('Event deleted successfully.');
                  } else {
                    alert('Failed to delete event.');
                  }
                } catch (err) {
                  console.error('Delete error:', err);
                  alert('Error deleting event.');
                }
              }}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    </div>
  );
};

export default Events;
