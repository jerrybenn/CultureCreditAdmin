import React, { useEffect, useState } from 'react';
import HorizontalNav from '../../components/horizontalNavbar/HorizontalNav.jsx';
import './Students.css';
import { Grid, Container } from '@mui/material';
import StudentCard from '../../components/studentCard/StudentCard.jsx';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredStudents = students.filter(student =>
    student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="studentsContainer">
      <HorizontalNav searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <Container sx={{ marginTop: 4 }}>
      <Grid container spacing={3}>
  {filteredStudents.map((student, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <StudentCard student={student} />
    </Grid>
  ))}
</Grid>

      </Container>
    </div>
  );
};

export default Students;
