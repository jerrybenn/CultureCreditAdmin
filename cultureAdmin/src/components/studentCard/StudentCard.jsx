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
  const [events, setEvents] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [formData, setFormData] = useState({ ...student });

  useEffect(() => {
    const fetchAttendedEvents = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:3841/events/past/${student.id}`);
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
    try {
      const res = await fetch(`http://127.0.0.1:3841/students/${student.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
        <div className="attendanceButton" onClick={handleOpen}>
          attendance
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
