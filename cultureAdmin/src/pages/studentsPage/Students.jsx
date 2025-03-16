import React from 'react'
import { useEffect, useState } from 'react';
import HorizontalNav from '../../components/horizontalNavbar/HorizontalNav.jsx'
import './Students.css'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const Students = () => {

  const [students, setStudents] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      console.log('fetching data');
      const d = await fetch('http://127.0.0.1:5000/students');
      const json = await d.json();
      setStudents(json.students);
      console.log('done fetching data');
    };
    loadData();
  }, []);

  
  return (
    <div className="studentsContainer"> <HorizontalNav />
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
      {students.map((students, index) => (
        <tr key={index}>
          <td>{students.first_name}</td>
          <td>{students.last_name}</td>

        </tr>
      ))}
      </tbody>
        </table>
    <div> students</div>
    </div>
  
    </div>
    
  )
}

export default Students