import './StudentCard.css';
import { useEffect, useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  DialogContentText,
  TextField,
  Switch,
  FormControlLabel
} from '@mui/material';

const StudentCard = ({ student }) => {
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [committedCredits, setCommittedCredits] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [formData, setFormData] = useState({ ...student });
  const [eventMap, setEventMap] = useState({});
  const [instructorMap, setInstructorMap] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Fetch all events
    fetch("http://127.0.0.1:3841/events", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const events = data.events || data;
        const map = {};
        events.forEach(ev => { map[ev.id] = ev.title; });
        setEventMap(map);
      });

    // Fetch all instructors
    fetch("http://127.0.0.1:3841/instructors", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const instructors = data.instructors || data;
        const map = {};
        instructors.forEach(inst => { map[inst.id] = `${inst.first_name} ${inst.last_name}`; });
        setInstructorMap(map);
      });
  }, []);

  useEffect(() => {
    const fetchAttendedEvents = async () => {
      const token = localStorage.getItem("token");
      if (!token) return alert("Not authorized. Please log in.");

      try {
        const res = await fetch(`http://127.0.0.1:3841/events/past/${student.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.events) {
          setEvents(data.events);
          const total = data.events.reduce((acc, curr) => acc + (curr.credits || 0), 0);
          setTotalCredits(total);
        } else {
          setEvents([]);
          setTotalCredits(0);
        }
      } catch (error) {
        console.error("Failed to fetch past events:", error);
        setEvents([]);
        setTotalCredits(0);
      }
    };

    fetchAttendedEvents();
  }, [student.id]);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const handleEditOpen = () => {
    setFormData({ ...student });
    setEditModalOpen(true);
  };

  const handleEditClose = () => setEditModalOpen(false);

  const handleEditSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Not authorized. Please log in.");

    try {
      const res = await fetch(`http://127.0.0.1:3841/students/${student.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert('Profile updated successfully!');
        setEditModalOpen(false);
      } else {
        alert('Failed to update profile.');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('An error occurred.');
    }
  };

  const handleOpenHistoryModal = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Not authorized.");
  
    setHistoryLoading(true);
    setHistoryModalOpen(true);
  
    try {
      const res = await fetch(`http://127.0.0.1:3841/committed_credits/${student.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Server returned ${res.status}: ${errorData.message || 'Unknown error'}`);
      }
  
      const data = await res.json();
      const credits = data.credits || [];
  
      // Enhance each credit with event title and instructor name
      const enhancedCredits = await Promise.all(
        credits.map(async (credit) => {
          try {
            const [eventRes, instructorRes] = await Promise.all([
              fetch(`http://127.0.0.1:3841/events/${credit.event_id}`, {
                headers: { Authorization: `Bearer ${token}` }
              }),
              fetch(`http://127.0.0.1:3841/instructors/${credit.instructor_id}`, {
                headers: { Authorization: `Bearer ${token}` }
              })
            ]);
  
            const eventData = await eventRes.json();
            const instructorData = await instructorRes.json();
  
            return {
              ...credit,
              eventTitle: eventData.title || `Event ${credit.event_id}`,
              instructorName: instructorData.first_name && instructorData.last_name
                ? `${instructorData.first_name} ${instructorData.last_name}`
                : `Instructor ${credit.instructor_id}`
            };
          } catch (innerErr) {
            console.warn("Failed to fetch event or instructor info", innerErr);
            return {
              ...credit,
              eventTitle: `Event ${credit.event_id}`,
              instructorName: `Instructor ${credit.instructor_id}`
            };
          }
        })
      );
  
      setCommittedCredits(enhancedCredits);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to load credit history. Please try again later.");
      setCommittedCredits([]);
    } finally {
      setHistoryLoading(false);
    }
  };
  
  const handleCloseHistoryModal = () => {
    setHistoryModalOpen(false);
  };

  return (
    <div className="studentCard">
      <div className="studentCardHeader">
        <div className="arrowIcon">
          <ArrowBackIcon />
        </div>
        <div className="editProfileButton" onClick={handleEditOpen}>
          Edit Profile
        </div>
      </div>

      <div className="studentCardBody">
        <div className="profileContainer">
          <PersonIcon sx={{ fontSize: '40px' }} />
        </div>
        <div className="profileInfo">
          <div className="profileName">
            {student.first_name} {student.last_name}
          </div>
          <div className="profileEmail">{student.email}</div>
        </div>
      </div>

      <div className="studentCardFooter">
        <div className="infoContainer">
          <div className="infoHeader">Attended</div>
          <div className="infoNumber">{events.length}</div>
        </div>
        <div className="attendanceButton" onClick={handleOpenHistoryModal}>
          History
        </div>
        <div className="attendanceButton" onClick={handleOpen}>
          Attended
        </div>
      </div>

      {/* Attendance Modal */}
      <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Attendance</DialogTitle>
        <DialogContent>
          {events.length > 0 ? (
            <>
              <List>
                {events.map((event, idx) => (
                  <ListItem key={idx}>
                    <ListItemText
                      primary={event.title}
                      secondary={`Date: ${event.date} | Credits: ${event.credits}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Typography variant="h6" align="right" sx={{ mt: 2 }}>
                Total Credits: {totalCredits}
              </Typography>
            </>
          ) : (
            <DialogContentText>No events found for this student.</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* History Modal */}
      <Dialog open={historyModalOpen} onClose={handleCloseHistoryModal} fullWidth maxWidth="md">
        <DialogTitle>Credit History</DialogTitle>
        <DialogContent>
          {historyLoading ? (
            <DialogContentText>Loading...</DialogContentText>
          ) : committedCredits.length > 0 ? (
            <table className="credit-history-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Credits</th>
                  <th>Instructor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {committedCredits.map((credit, idx) => {
                  const isApproved = credit.cc_applied > 0;
                  const status = isApproved ? "Approved" : "Sent";
                  const displayCredits = isApproved ? credit.cc_applied : credit.cc_requested;
                  const eventName = eventMap[credit.event_id] || credit.event_id;
                  const instructorName = instructorMap[credit.instructor_id] || credit.instructor_id;
                  return (
                    <tr key={idx}>
                      <td>{eventName}</td>
                      <td>{displayCredits}</td>
                      <td>{instructorName}</td>
                      <td>
                        <span className={`status-badge ${status.toLowerCase()}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <DialogContentText>No history found.</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHistoryModal}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog open={editModalOpen} onClose={handleEditClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Student Profile</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            fullWidth
            margin="dense"
            value={formData.first_name || ''}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="dense"
            value={formData.last_name || ''}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.verified || false}
                onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
              />
            }
            label="Verified"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.update_device || false}
                onChange={(e) => setFormData({ ...formData, update_device: e.target.checked })}
              />
            }
            label="Allow Device Update"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StudentCard;
