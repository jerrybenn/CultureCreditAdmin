import React, { useState, useEffect } from 'react';
import './Instructor.css';
import HorizontalNav from '../../components/horizontalNavbar/HorizontalNav';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TablePagination from '@mui/material/TablePagination';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  DialogContentText
} from '@mui/material';

const Instructor = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedInstructorId, setSelectedInstructorId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch('http://127.0.0.1:3841/instructors', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const json = await res.json();
      const instructors = json.instructors || json;
      console.log("Fetched instructors:", instructors);
      setData(instructors);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const handleMenuClick = (event, instructorId) => {
    setAnchorEl(event.currentTarget);
    setSelectedInstructorId(instructorId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditOpen = () => {
    const instructor = data.find(i => i.id === selectedInstructorId);
    if (instructor) {
      setEditForm({ ...instructor });
      setEditModalOpen(true);
    }
    handleMenuClose();
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:3841/instructors`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        setEditModalOpen(false);
        fetchInstructors();
        alert("Instructor updated successfully!");
      } else {
        alert("Failed to update instructor.");
      }
    } catch (err) {
      console.error("Error saving instructor:", err);
    }
  };

  const handleDeleteOpen = () => {
    setDeleteModalOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:3841/instructors/${selectedInstructorId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        setDeleteModalOpen(false);
        fetchInstructors();
        alert("Instructor deleted.");
      } else {
        alert("Failed to delete instructor.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleEmailOpen = () => {
    setEmailModalOpen(true);
    handleMenuClose();
  };

  const handleEmailSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:3841/instructors`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        setEmailModalOpen(false);
        fetchInstructors();
        alert("Instructor email updated successfully!");
      } else {
        alert("Failed to update instructor email.");
      }
    } catch (err) {
      console.error("Error saving instructor email:", err);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredInstructors = data.filter((instructor) =>
    (`${instructor.first_name} ${instructor.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
     instructor.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedInstructor = data.find(i => i.id === selectedInstructorId);

  return (
    <motion.div 
      className="instructorContainer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HorizontalNav searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="mainContent">
        <table className="instructorTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>More</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredInstructors
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((instructor, index) => (
                  <motion.tr
                    key={instructor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <td>{instructor.first_name} {instructor.last_name}</td>
                    <td>{instructor.email}</td>
                    <td>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MoreHorizIcon
                          className="moreIcon"
                          onClick={(e) => handleMenuClick(e, instructor.id)}
                        />
                      </motion.div>
                    </td>
                  </motion.tr>
                ))}
            </AnimatePresence>
              
            <tr>
              <td colSpan="3" style={{ padding: 0 }}>
                <TablePagination
                  component="div"
                  count={filteredInstructors.length}
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

        <Menu 
          anchorEl={anchorEl} 
          open={Boolean(anchorEl)} 
          onClose={handleMenuClose}
          TransitionComponent={motion.div}
          TransitionProps={{
            initial: { opacity: 0, y: -10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -10 },
            transition: { duration: 0.2 }
          }}
        >
          <MenuItem onClick={handleEditOpen}>Edit</MenuItem>
          <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem>
          <MenuItem onClick={handleEmailOpen}>Email</MenuItem>
        </Menu>

        <AnimatePresence>
          {emailModalOpen && (
            <Dialog 
              open={emailModalOpen} 
              onClose={() => setEmailModalOpen(false)} 
              fullWidth 
              maxWidth="sm"
              TransitionComponent={motion.div}
              TransitionProps={{
                initial: { opacity: 0, y: -20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -20 },
                transition: { duration: 0.3 }
              }}
            >
              <DialogTitle>Update Instructor Email</DialogTitle>
              <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                  Current email: {selectedInstructor?.email}
                </DialogContentText>
                <TextField
                  margin="dense"
                  label="New Email"
                  name="email"
                  fullWidth
                  value={editForm.email || ''}
                  onChange={handleEditChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEmailModalOpen(false)} color="secondary">Cancel</Button>
                <Button variant="contained" onClick={handleEmailSave}>Save</Button>
              </DialogActions>
            </Dialog>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {editModalOpen && (
            <Dialog 
              open={editModalOpen} 
              onClose={() => setEditModalOpen(false)} 
              fullWidth 
              maxWidth="sm"
              TransitionComponent={motion.div}
              TransitionProps={{
                initial: { opacity: 0, y: -20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -20 },
                transition: { duration: 0.3 }
              }}
            >
              <DialogTitle>Edit Instructor</DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  label="First Name"
                  name="first_name"
                  fullWidth
                  value={editForm.first_name || ''}
                  onChange={handleEditChange}
                />
                <TextField
                  margin="dense"
                  label="Last Name"
                  name="last_name"
                  fullWidth
                  value={editForm.last_name || ''}
                  onChange={handleEditChange}
                />
                <TextField
                  margin="dense"
                  label="Email"
                  name="email"
                  fullWidth
                  value={editForm.email || ''}
                  onChange={handleEditChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEditModalOpen(false)} color="secondary">Cancel</Button>
                <Button variant="contained" onClick={handleEditSave}>Save</Button>
              </DialogActions>
            </Dialog>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {deleteModalOpen && (
            <Dialog 
              open={deleteModalOpen} 
              onClose={() => setDeleteModalOpen(false)}
              TransitionComponent={motion.div}
              TransitionProps={{
                initial: { opacity: 0, y: -20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -20 },
                transition: { duration: 0.3 }
              }}
            >
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete{' '}
                  <strong>{selectedInstructor?.first_name} {selectedInstructor?.last_name}</strong>?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDeleteModalOpen(false)} color="secondary">Cancel</Button>
                <Button onClick={handleDeleteConfirm} variant="contained" color="error">
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Instructor;
