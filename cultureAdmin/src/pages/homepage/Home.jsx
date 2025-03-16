import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate,  } from 'react-router-dom';
import HorizontalNav from '../../components/horizontalNavbar/HorizontalNav.jsx'
import './Home.css'

import DashboardEventsTable from '../../components/dashboardEventsTableFolder/DashboardEventsTable.jsx';
import DashboardGraph from '../../components/dashboardGraphFolder/DashboardGraph.jsx';

import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import GroupsIcon from '@mui/icons-material/Groups';






const Home = () => {
  
  const studentCount = 0;
  const [eventCount, setEventCount] = useState(0); // Store event count separately

  const [data, setData] = useState([]);

  useEffect(() => {
  
        const loadData = async() =>  {
          console.log('fetching data');
          const d = await fetch('http://127.0.0.1:5000/events')
          const json = await d.json()
          setData(json.events)
          setEventCount(json.events.length); // Update event count dynamically
          console.log('done fetching data');
          console.log(json.events);
          
          
        }
        loadData()
      },[]);
      
  const navigate = useNavigate(); // Initialize navigation function
  return (
    
    <div className = 'dashBoardContainer'>
      
      <HorizontalNav />
      <div className="mainContent"></div>
  
        <div className="smalldashboardInfoCard">
        <div className="smallCard" onClick={() => navigate('/events')}>
            <div className="cardImage">
            <ConfirmationNumberIcon sx={{color:'white', fontSize:'40px'}}/>
            </div>
            <div className="cardInfo">
              <div className="amount">
                {eventCount}
              </div>
              <div className="category">Events</div>
            </div>   
          </div>
          <div className="smallCard" onClick={() => navigate('/students')}>
            <div className="cardImage">
            <GroupsIcon sx={{color:'white', fontSize:'40px'}}/>
            </div>
            <div className="cardInfo">
              <div className="amount">
                {studentCount}
              </div>
              <div className="category">Students</div>
             
            </div>
              
          </div>
      </div>
      <div className="largedashboardInfoCard">
        <DashboardGraph />
        <DashboardEventsTable />
       
       
        
      </div>
    </div>
  )
}

export default Home