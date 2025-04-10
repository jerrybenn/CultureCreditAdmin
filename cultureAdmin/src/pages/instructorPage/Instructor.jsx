import React, { useState, useEffect } from 'react';
import './Instructor.css';
import HorizontalNav from '../../components/horizontalNavbar/HorizontalNav';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TablePagination from '@mui/material/TablePagination';
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
  const [editForm, setEditForm] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const res = await fetch('http://127.0.0.1:3841/instructors');
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
      const res = await fetch(`http://127.0.0.1:3841/instructors`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`http://127.0.0.1:3841/instructors/${selectedInstructorId}`, {
        method: 'DELETE'
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
    <div className="instructorContainer">
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
            {filteredInstructors
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((instructor, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td>{instructor.first_name} {instructor.last_name}</td>
                    <td>{instructor.email}</td>
                    <td>
                      <MoreHorizIcon
                        className="moreIcon"
                        onClick={(e) => handleMenuClick(e, instructor.id)}
                      />
                    </td>
                  </tr>
                </React.Fragment>
              ))}
              
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

       

        {/* Context Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleEditOpen}>Edit</MenuItem>
          <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem>
        </Menu>

        {/* ✏️ Edit Instructor Modal */}
        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} fullWidth maxWidth="sm">
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

        {/* ❌ Delete Confirmation Dialog */}
        <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
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
      </div>
    </div>
  );
};

export default Instructor;
