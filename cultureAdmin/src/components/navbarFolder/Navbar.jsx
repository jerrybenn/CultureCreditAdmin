import React from 'react'
import { Link } from 'react-router-dom';

import './Navbar.css'

const Navbar = () => {
  return (
    <div className='navbarContainer'>
        <h2>Culture Admin</h2>
        <nav>
            <div className="linkContainer">
                <Link to='/home'>Dashboard</Link>
            </div>
            <div className="linkContainer">
                <Link to='/events'>Events</Link>
            </div>
            <div className="linkContainer">
                <Link to='/calender'>Calender</Link>
            </div>
            <div className="underline"></div>
            <div className="linkContainer">
                <Link to ='/'>Logout</Link>
            </div>
        </nav>
    </div>
  )
}

export default Navbar