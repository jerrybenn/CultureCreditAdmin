import React, { useEffect, useState } from 'react';
import HorizontalNav from '../../components/horizontalNavbar/HorizontalNav.jsx';
import './Students.css';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!searchQuery.trim()) {
        setStudents([]); // or optionally fetch all students if you have that endpoint
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

  const filteredStudents = students.filter(student =>
    student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  return (
    <div className="studentsContainer">
      <HorizontalNav searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="mainContent">
        <table className="eventsTable">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Device Id</th>
              <th>Verified</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.first_name}</td>
                <td>{student.last_name}</td>
                <td>{student.email}</td>
                <td>{student.device}</td>
                <td>{student.verified ? 'Yes' : 'No'}</td>
                <td><MoreHorizIcon /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      
      <div className="studentCardsContainer">
        card go here
        <div className="studentCard">
          hi card
        </div>
      </div>
    </div>
  );
};

export default Students;
