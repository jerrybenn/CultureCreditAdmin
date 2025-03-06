import React from 'react'
import { Link } from 'react-router-dom';

import './Navbar.css'


import calendar from '../../components/assets/calendar.svg';
import dashBoardIcon from '../../components/assets/stats-down-square.svg';
import eventsIcon from '../../components/assets/task-list.svg';
import logout from '../../components/assets/log-out.svg';
import group from '../../components/assets/group.svg';




const Navbar = () => {
  return (
    <div className='navbarContainer'>
        <h2>Culture Admin</h2>
        <nav>
            <div className="linkContainer">
                <div> <img src={dashBoardIcon} alt="" /></div>
                <div className="navLink">
                    <Link to='/home'>Dashboard</Link>
                </div>
            </div>
            <div className="linkContainer">
                <div> <img src={eventsIcon} alt="" /></div>
                <div className="navLink">
                    <Link to='/events'>Events</Link>
                </div>
            </div>

            <div className="linkContainer">
                <div> <img src={group} alt="" /></div>
                <div className="navLink">
                    <Link to ='/students'>Students</Link>
                </div>
            </div>

            <div className="linkContainer">
                <div> <img src={calendar} alt="" /></div>
                <div className="navLink">
                    <Link to='/calender'>Calender</Link>
                </div>
            </div>
            <div className='underline'></div>
            <div className="linkContainer">
                <div> <img src={logout} alt="" /></div>
                <div className="navLink">
                    <Link to ='/'>Logout</Link>
                </div>
            </div>
            
        </nav>
    </div>
  )
}

export default Navbar