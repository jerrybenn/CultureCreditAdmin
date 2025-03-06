import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate,  } from 'react-router-dom';
import HorizontalNav from '../../components/horizontalNavbar/HorizontalNav.jsx'
import './Home.css'

import DashboardEventsTable from '../../components/dashboardEventsTableFolder/DashboardEventsTable.jsx';
import DashboardGraph from '../../components/dashboardGraphFolder/DashboardGraph.jsx';


import clipboardIcon from '../../components/assets/clipboard-check.svg'
import community from '../../components/assets/community.svg'






const Home = () => {
  let eventCount = 0;
  const studentCount = 0;

  const [data, setData] = useState([]);

  useEffect(() => {
  
        const loadData = async() =>  {
          console.log('fetching data');
          const d = await fetch('http://127.0.0.1:5000/events')
          const json = await d.json()
          setData(json.events)
          console.log('done fetching data');
        }
        loadData()
  
      },[]);

      eventCount = data.length;
  
  const navigate = useNavigate(); // Initialize navigation function
  return (
    
    <div className = 'dashBoardContainer'>
      
      <HorizontalNav />
  
        <div className="smalldashboardInfoCard">
        <div className="smallCard" onClick={() => navigate('/events')}>
            <div className="cardImage">
            <img src={clipboardIcon} alt="" />
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
            <img src={community} alt="" />
            </div>
            <div className="cardInfo">
              <div className="amount">
                {studentCount}
              </div>
              <div className="category">Students</div>
             
            </div>
              
          </div>
      </div>
      <div className="largeInfoCard">
        <DashboardGraph />
        <DashboardEventsTable />
       
       
        
      </div>
      
      dashboard</div>
  )
}

export default Home