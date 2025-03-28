import React, { useState, useEffect } from 'react';
import './Instructor.css';
import HorizontalNav from '../../components/horizontalNavbar/HorizontalNav';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Instructor = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedInstructorId, setSelectedInstructorId] = useState(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      const res = await fetch('http://127.0.0.1:3841/instructors');
      const json = await res.json();
      setData(json.instructors || []);
    };
    fetchInstructors();
  }, []);

  const handleMenuClick = (event, instructorId) => {
    setAnchorEl(event.currentTarget);
    setSelectedInstructorId(instructorId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const filteredInstructors = data.filter((instructor) =>
    instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            {filteredInstructors.map((instructor, index) => (
              <tr key={index}>
                <td>{instructor.name}</td>
                <td>{instructor.email}</td>
                <td>
                  <MoreHorizIcon
                    className="moreIcon"
                    onClick={(e) => handleMenuClick(e, instructor.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => { console.log(`Edit instructor ${selectedInstructorId}`); handleMenuClose(); }}>Edit</MenuItem>
          <MenuItem onClick={() => { console.log(`Delete instructor ${selectedInstructorId}`); handleMenuClose(); }}>Delete</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Instructor;
