import React, { useState } from 'react';
import './AddEvent.css';

import xMark from '../assets/xmark.svg';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import PersonIcon from '@mui/icons-material/Person';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Menu from '@mui/material/Menu';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import TextField from '@mui/material/TextField';

const AddEvent = ({ onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [anchorElCredits, setAnchorElCredits] = useState(null);
  const [anchorElCheckins, setAnchorElCheckins] = useState(null);
  const [selectedCredits, setSelectedCredits] = useState('');
  const [selectedCheckins, setSelectedCheckins] = useState('');
  const [anchorElDate, setAnchorElDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [anchorElTime, setAnchorElTime] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');

  const [title, setTitle] = useState('');
  const [host, setHost] = useState(''); 
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  

  const handleCreateEvent = async () => {
    const eventDateTime = new Date(`${selectedDate}T${selectedTime}`);

    // Add 24 hours to the eventDateTime
    const creditExpiryDate = new Date(eventDateTime.getTime() + 24 * 60 * 60 * 1000);
  
    // Format creditExpiryDate to 'YYYY-MM-DD HH:MM:SS'
    const creditExpiry = creditExpiryDate.toISOString().slice(0, 19).replace('T', ' ');

    const formattedTime = selectedTime ? `${selectedTime}:00` : '';
    
    const eventData = {
      title,
      host,
      location,
      date: selectedDate,
      time: formattedTime,
      credits: selectedCredits,
      num_of_checkIns: selectedCheckins,
      description,
      credit_expiry: creditExpiry,
    };

    console.log('Event Data being sent:', eventData);

    try {
      const response = await fetch('http://127.0.0.1:5000/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      if (response.ok) {
        alert('Event added successfully!');
        onClose();
      } else {
        alert('Failed to add event.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding event.');
    }
  };

  



  const handleMenuOpenTime = (event) => {
    setAnchorElTime(event.currentTarget);
  };

  const handleMenuCloseTime = () => {
    setAnchorElTime(null);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleMenuOpenCredits = (event) => {
    setAnchorElCredits(event.currentTarget);
  };

  const handleMenuCloseCredits = (number) => {
    setSelectedCredits(number);
    setAnchorElCredits(null);
  };

  const handleMenuOpenCheckins = (event) => {
    setAnchorElCheckins(event.currentTarget);
  };

  const handleMenuCloseCheckins = (number) => {
    setSelectedCheckins(number);
    setAnchorElCheckins(null);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleMenuOpenDate = (event) => {
    setAnchorElDate(event.currentTarget);
  };

  const handleMenuCloseDate = () => {
    setAnchorElDate(null);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };


  


  return (
    <div className="eventFormContainer">
      <div className="eventFormContent">
        <div className="closeContainer">
          <img src={xMark} alt="Close" onClick={onClose} />
        </div>
        <div className="formTitle">
          <input type="text" placeholder="Give your event a name" value={title} onChange={(e) => setTitle(e.target.value)}/>
        </div>
        <div className="dividerDiv">
          <Divider sx={{ width: '100%', borderBottomWidth: '2px', borderColor: '#B2B4B7FF' }} />
        </div>
        <div className="dateTime">
          <div className="dateTimeInputs" onClick={handleMenuOpenDate}>
            <div className="dateTimeImg">
              <CalendarMonthIcon sx={{ color: '#c6cdcf'}} />
            </div>
            <div className="dateTimeText">
              <div className="dateTimeTitle">Day</div>
              <div className="dateTimeDisplay">{selectedDate || "Select Date"}</div>
            </div>
            <div className="arrows">
              <UnfoldMoreIcon sx={{ color: '#c6cdcf'}}/>
            </div>
          </div>
          <div className="dateTimeInputs" onClick={handleMenuOpenTime}>
            <div className="dateTimeImg">
              <AccessTimeIcon sx={{ color: '#c6cdcf'}} />
            </div>
            <div className="dateTimeText">
              <div className="dateTimeTitle">Time</div>
              <div className="dateTimeDisplay">{selectedTime || "Select Time"}</div>
            </div>
            <div className="arrows">
              <UnfoldMoreIcon sx={{ color: '#c6cdcf'}} />
            </div>
          </div>
        </div>
        <div className="dividerDiv">
          <Divider sx={{ width: '100%', borderBottomWidth: '2px', borderColor: '#B2B4B7FF' }} />
        </div>
        <Menu
          anchorEl={anchorElDate}
          open={Boolean(anchorElDate)}
          onClose={handleMenuCloseDate}
        >
          <MenuItem>
            <TextField
              type="date"
              label="Select Date"
              InputLabelProps={{ shrink: true }}
              value={selectedDate}
              onChange={handleDateChange}
              fullWidth 
            />
          </MenuItem>
        </Menu>

        {/* Time Menu */}
        <Menu anchorEl={anchorElTime} open={Boolean(anchorElTime)} onClose={handleMenuCloseTime}>
          <MenuItem>
            <TextField
              type="time"
              label="Select Time"
              InputLabelProps={{ shrink: true }}
              value={selectedTime}
              onChange={handleTimeChange}
              fullWidth
            />
          </MenuItem>
        </Menu>

        <div className="hostAndImageContainer">
          <div className="seperationContainer">
            <div className="host">Host</div>
            <div className="hostAndImageInputContainer">
              <PersonIcon sx={{ color: '#c6cdcf'}} />
              <input type="text" placeholder="Host Name" value={host} onChange={(e) => setHost(e.target.value)} />
            </div>
          </div>
          <div className="numericSeperation">
            <div className="host">Credits</div>
            <div className="numericInputContainer" onClick={handleMenuOpenCredits}>
              <input type="text" placeholder="#CC" value={selectedCredits} readOnly />
            </div>
            <Menu anchorEl={anchorElCredits} open={Boolean(anchorElCredits)} onClose={() => handleMenuCloseCredits(selectedCredits)}>
              <MenuItem onClick={() => handleMenuCloseCredits('1')}>1 CC</MenuItem>
              <MenuItem onClick={() => handleMenuCloseCredits('2')}>2 CC</MenuItem>
              <MenuItem onClick={() => handleMenuCloseCredits('3')}>3 CC</MenuItem>
            </Menu>
          </div>
        </div>
        <div className="dividerDiv">
          <Divider sx={{ width: '100%', borderBottomWidth: '2px', borderColor: '#B2B4B7FF' }} />
        </div>
        <div className="hostAndImageContainer">
          <div className="seperationContainer">
            <div className="host">Location</div>
            <div className="hostAndImageInputContainer">
              <LocationOnIcon sx={{ color: '#c6cdcf'}} />
              <input type="text" placeholder="Location Name" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>
          <div className="numericSeperation">
            <div className="host">Checkins</div>
            <div className="numericInputContainer" onClick={handleMenuOpenCheckins}>
              <input type="text" placeholder="#Checkins" value={selectedCheckins} readOnly />
            </div>
            <Menu anchorEl={anchorElCheckins} open={Boolean(anchorElCheckins)} onClose={() => handleMenuCloseCheckins(selectedCheckins)}>
              <MenuItem onClick={() => handleMenuCloseCheckins('1')}>1 Checkin</MenuItem>
              <MenuItem onClick={() => handleMenuCloseCheckins('2')}>2 Checkins</MenuItem>
              <MenuItem onClick={() => handleMenuCloseCheckins('3')}>3 Checkins</MenuItem>
            </Menu>
          </div>
        </div>
        <div className="dividerDiv">
          <Divider sx={{ width: '100%', borderBottomWidth: '2px', borderColor: '#B2B4B7FF' }} />
        </div>
        <div className="imageInputContainer">
          <div className="host">Upload Image</div>
          <div className="hostAndImageInputContainer">
              <CameraAltIcon sx={{ color: '#c6cdcf'}} />
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>

        </div>
        <div className="dividerDiv">
          <Divider sx={{ width: '100%', borderBottomWidth: '2px', borderColor: '#B2B4B7FF' }} />
        </div>
        <div className="host">Event description</div>
        <div id="hostAndImageInputContainerDescription">
        <textarea placeholder="Event description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="createEventButton" onClick={handleCreateEvent}>
        Create Event
      </div>
      </div>
      
    </div>
  );
};

export default AddEvent;
