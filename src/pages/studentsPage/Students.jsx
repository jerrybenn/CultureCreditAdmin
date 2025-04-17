import React, { useEffect, useState } from 'react';
import HorizontalNav from '../../components/horizontalNavbar/HorizontalNav.jsx';
import './Students.css';
import { Grid, Container } from '@mui/material';
import StudentCard from '../../components/studentCard/StudentCard.jsx';
import TablePagination from '@mui/material/TablePagination';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText
} from '@mui/material';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [allStudents, setAllStudents] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [attendedEvents, setAttendedEvents] = useState([]);

  // Fetch all students who have attended events
  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const startDate = `${currentYear}-01-01`;
        const endDate = `${currentYear}-12-31`;
        
        const res = await fetch(`http://127.0.0.1:3841/student_attendance/${startDate}/${endDate}`);
        const json = await res.json();
        
        if (json.students) {
          setAllStudents(json.students);
        } else {
          console.warn("Students field missing in response", json);
        }
      } catch (error) {
        console.error("Error fetching student attendance:", error);
      }
    };

    fetchAllStudents();
  }, []);

  // Fetch students based on search query
  useEffect(() => {
    const loadData = async () => {
      if (!searchQuery.trim()) {
        setStudents([]);
        return;
      }

      try {
        const res = await fetch(`http://127.0.0.1:3841/students/q=${searchQuery}`);
        const json = await res.json();
        setStudents(json);
      } catch (err) {
        console.error('Failed to fetch students:', err);
      }
    };

    loadData();
  }, [searchQuery]);

  const handleMenuClick = (event, studentId) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudentId(studentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewAttendance = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:3841/events/past/${selectedStudentId}`);
      const data = await res.json();
      if (res.ok && data.events) {
        setAttendedEvents(data.events);
        setAttendanceDialogOpen(true);
      } else {
        setAttendedEvents([]);
      }
    } catch (error) {
      console.error("Failed to fetch past events:", error);
      setAttendedEvents([]);
    }
    handleMenuClose();
  };

  const filteredStudents = students.filter(student =>
    student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="studentsContainer">
      <HorizontalNav searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Show table when no search query, otherwise show cards */}
      {!searchQuery.trim() ? (
        <div className="mainContent">
          <table className="studentTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>More</th>
              </tr>
            </thead>
            <tbody>
              {allStudents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((student, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{student.first_name} {student.last_name}</td>
                      <td>{student.email}</td>
                      <td>
                        <MoreHorizIcon
                          className="moreIcon"
                          onClick={(e) => handleMenuClick(e, student.id)}
                        />
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
                
                <tr>
                  <td colSpan="3" style={{ padding: 0 }}>
                    <TablePagination
                      component="div"
                      count={allStudents.length}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      rowsPerPageOptions={[5, 10, 25]}
                    />
                  </td>
                </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <Container sx={{ marginTop: 4 }}>
          <Grid container spacing={3}>
            {filteredStudents.map((student, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <StudentCard student={student} />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleViewAttendance}>View Attendance</MenuItem>
      </Menu>

      {/* Attendance Dialog */}
      <Dialog open={attendanceDialogOpen} onClose={() => setAttendanceDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Attendance History</DialogTitle>
        <DialogContent>
          {attendedEvents.length > 0 ? (
            <ul>
              {attendedEvents.map((event, index) => (
                <li key={index}>
                  {event.title} - {event.date} (Credits: {event.credits})
                </li>
              ))}
            </ul>
          ) : (
            <DialogContentText>No events found for this student.</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAttendanceDialogOpen(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Students; 