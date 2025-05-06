import React, { useEffect, useState } from 'react';
import HorizontalNav from '../../components/horizontalNavbar/HorizontalNav.jsx';
import './Students.css';
import { Grid, Container } from '@mui/material';
import StudentCard from '../../components/studentCard/StudentCard.jsx';
import TablePagination from '@mui/material/TablePagination';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { motion, AnimatePresence } from 'framer-motion';
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
        console.log('Student attendance API response:', json);
        
        if (json.students) {
          // Create a Map to store unique students by their ID
          const uniqueStudentsMap = new Map();
          json.students.forEach(student => {
            if (!uniqueStudentsMap.has(student.id)) {
              uniqueStudentsMap.set(student.id, student);
            }
          });
          
          // Convert Map back to array
          const uniqueStudents = Array.from(uniqueStudentsMap.values());
          setAllStudents(uniqueStudents);
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

      {/* Always show cards, remove table */}
      <Container sx={{ marginTop: 4 }}>
        <Grid container spacing={3}>
          <AnimatePresence mode="wait">
            {filteredStudents.map((student, index) => (
              <Grid item xs={12} sm={6} md={4} key={student.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.02,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <StudentCard student={student} />
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </Container>

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