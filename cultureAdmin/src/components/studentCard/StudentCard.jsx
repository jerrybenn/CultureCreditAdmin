import './StudentCard.css';
import { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';

const StudentCard = ({ student }) => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  return (
    <div className="studentCard">
      <div className="studentCardHeader">
        <div className="arrowIcon">
          <ArrowBackIcon />
        </div>
        <div className="editProfileButton">Edit Profile</div>
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
          <div className="infoHeader">ID #</div>
          <div className="infoNumber">{student.id}</div>
        </div>
        <div className="infoContainer">
          <div className="infoHeader">Attended</div>
          <div className="infoNumber">10</div>
        </div>
        <div className="attendanceButton" onClick={handleOpen}>
          attendance
        </div>
      </div>

      {/* Attendance Modal */}
      <Dialog open={openModal} onClose={handleClose}>
        <DialogTitle>Attendance</DialogTitle>
        <DialogContent>
          <p>Attendance</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StudentCard;
