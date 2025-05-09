import React, { useState } from 'react';
import './AddEvent.css';

// Material UI imports
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Material UI icons
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

// Other imports
import xMark from '../assets/xmark.svg';
import dayjs from 'dayjs';

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result); // includes "data:image/png;base64,..."
  reader.onerror = (error) => reject(error);
});

// Function to resize image
const resizeImage = (file, maxWidth = 800, maxHeight = 600) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64 with reduced quality
      const resizedImage = canvas.toDataURL('image/jpeg', 0.7);
      resolve(resizedImage);
    };
    
    img.onerror = (error) => reject(error);
  });
};

const AddEvent = ({ onClose }) => {
  // State for form fields
  const [title, setTitle] = useState('');
  const [host, setHost] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  
  // State for date and time
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [expireDate, setExpireDate] = useState(null);
  
  // State for credits and checkins
  const [selectedCredits, setSelectedCredits] = useState('');
  const [selectedCheckins, setSelectedCheckins] = useState('');
  
  // State for image upload
  const [selectedImage, setSelectedImage] = useState(null);
  
  // State for menu anchors
  const [anchorElCredits, setAnchorElCredits] = useState(null);
  const [anchorElCheckins, setAnchorElCheckins] = useState(null);
  const [anchorElDate, setAnchorElDate] = useState(null);
  const [anchorElTime, setAnchorElTime] = useState(null);

  // Event handlers
  const handleCreateEvent = async () => {
    const eventDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const defaultCreditExpiry = new Date(eventDateTime.getTime() + 24 * 60 * 60 * 1000);
    const creditExpiry = expireDate
      ? dayjs(expireDate).format('YYYY-MM-DD HH:mm:ss')
      : defaultCreditExpiry.toISOString().slice(0, 19).replace('T', ' ');
  
    const formattedTime = selectedTime ? `${selectedTime}:00` : '';
  
    let base64Image = null;
  
    if (selectedImage) {
      try {
        // Resize the image before converting to base64
        base64Image = await resizeImage(selectedImage);
        console.log('Image resized successfully');
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Error processing image. Please try again.');
        return;
      }
    }
  
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
      image: base64Image // base64 string here
    };
  
    console.log('Event Data being sent:', {
      ...eventData,
      image: base64Image ? 'Base64 image data (truncated for console)' : 'No image'
    });

    try {
      // Get the JWT token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Not authorized. Please log in.');
        window.location.href = '/';
        return;
      }

      const response = await fetch('http://127.0.0.1:3841/events', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData),
      });
      
      if (response.ok) {
        alert('Event added successfully!');
        onClose();
      } else if (response.status === 401) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add event.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding event. Please try again.');
    }
  };

  // Menu handlers
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

  const handleMenuOpenDate = (event) => {
    setAnchorElDate(event.currentTarget);
  };

  const handleMenuCloseDate = () => {
    setAnchorElDate(null);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <div className="eventFormContainer">
      <div className="eventFormContent">
        {/* Close button */}
        <div className="closeContainer">
          <img src={xMark} alt="Close" onClick={onClose} />
        </div>
        
        {/* Event title */}
        <div className="formTitle">
          <input 
            type="text" 
            placeholder="Give your event a name" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>
        
        <div className="dividerDiv">
          <Divider sx={{ width: '100%', borderBottomWidth: '2px', borderColor: '#B2B4B7FF' }} />
        </div>
        
        {/* Date and time section */}
        <div className="dateTime">
          <div className="dateTimeInputs" onClick={handleMenuOpenDate}>
            <div className="dateTimeImg">
              <CalendarMonthIcon sx={{ color: '#c6cdcf' }} />
            </div>
            <div className="dateTimeText">
              <div className="dateTimeTitle">Day</div>
              <div className="dateTimeDisplay">{selectedDate || "Select Date"}</div>
            </div>
            <div className="arrows">
              <UnfoldMoreIcon sx={{ color: '#c6cdcf' }} />
            </div>
          </div>
          
          <div className="dateTimeInputs" onClick={handleMenuOpenTime}>
            <div className="dateTimeImg">
              <AccessTimeIcon sx={{ color: '#c6cdcf' }} />
            </div>
            <div className="dateTimeText">
              <div className="dateTimeTitle">Time</div>
              <div className="dateTimeDisplay">{selectedTime || "Select Time"}</div>
            </div>
            <div className="arrows">
              <UnfoldMoreIcon sx={{ color: '#c6cdcf' }} />
            </div>
          </div>
        </div>
        
        <div className="dividerDiv">
          <Divider sx={{ width: '100%', borderBottomWidth: '2px', borderColor: '#B2B4B7FF' }} />
        </div>
        
        {/* Date and time menus */}
        <Menu anchorEl={anchorElDate} open={Boolean(anchorElDate)} onClose={handleMenuCloseDate}>
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
        
        {/* Host and credits section */}
        <div className="hostAndImageContainer">
          <div className="seperationContainer">
            <div className="host">Host</div>
            <div className="hostAndImageInputContainer">
              <PersonIcon sx={{ color: '#c6cdcf' }} />
              <input 
                type="text" 
                placeholder="Host Name" 
                value={host} 
                onChange={(e) => setHost(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="numericSeperation">
            <div className="host">Credits</div>
            <div className="numericInputContainer" onClick={handleMenuOpenCredits}>
              <input type="text" placeholder="#CC" value={selectedCredits} readOnly />
            </div>
            <Menu 
              anchorEl={anchorElCredits} 
              open={Boolean(anchorElCredits)} 
              onClose={() => handleMenuCloseCredits(selectedCredits)}
            >
              <MenuItem onClick={() => handleMenuCloseCredits('1')}>1 CC</MenuItem>
              <MenuItem onClick={() => handleMenuCloseCredits('2')}>2 CC</MenuItem>
              <MenuItem onClick={() => handleMenuCloseCredits('3')}>3 CC</MenuItem>
            </Menu>
          </div>
        </div>
        
        <div className="dividerDiv">
          <Divider sx={{ width: '100%', borderBottomWidth: '2px', borderColor: '#B2B4B7FF' }} />
        </div>
        
        {/* Location and checkins section */}
        <div className="hostAndImageContainer">
          <div className="seperationContainer">
            <div className="host">Location</div>
            <div className="hostAndImageInputContainer">
              <LocationOnIcon sx={{ color: '#c6cdcf' }} />
              <input 
                type="text" 
                placeholder="Location Name" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="numericSeperation">
            <div className="host">Checkins</div>
            <div className="numericInputContainer" onClick={handleMenuOpenCheckins}>
              <input type="text" placeholder="#Checkins" value={selectedCheckins} readOnly />
            </div>
            <Menu 
              anchorEl={anchorElCheckins} 
              open={Boolean(anchorElCheckins)} 
              onClose={() => handleMenuCloseCheckins(selectedCheckins)}
            >
              <MenuItem onClick={() => handleMenuCloseCheckins('1')}>1 Checkin</MenuItem>
              <MenuItem onClick={() => handleMenuCloseCheckins('2')}>2 Checkins</MenuItem>
              <MenuItem onClick={() => handleMenuCloseCheckins('3')}>3 Checkins</MenuItem>
            </Menu>
          </div>
        </div>
        
        <div className="dividerDiv">
          <Divider sx={{ width: '100%', borderBottomWidth: '2px', borderColor: '#B2B4B7FF' }} />
        </div>

        {/* Image upload and expiry section */}
        <div className="imageExpire">
          <div className="seperationContainer">
            <div className="host">Upload Image</div>
            <div className="hostAndImageInputContainer">
              <CameraAltIcon sx={{ color: '#c6cdcf' }} />
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
          </div>
          
          <div className="numericSeperation">
            <div className="host">Expire</div>
            <div className="numericInputContainer">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Expire Date"
                  value={expireDate}
                  onChange={(newValue) => setExpireDate(newValue)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            border: 'none',
                          },
                          borderRadius: '8px',
                          '& .MuiInputAdornment-root': {
                            display: 'none',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          display: 'none',
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
        </div>

        <div className="dividerDiv">
          <Divider sx={{ width: '100%', borderBottomWidth: '2px', borderColor: '#B2B4B7FF' }} />
        </div>
        
        {/* Description section */}
        <div className="host">Event description</div>
        <div id="hostAndImageInputContainerDescription">
          <textarea 
            placeholder="Event description" 
            rows="4" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </div>
        
        {/* Create event button */}
        <div className="createEventButton" onClick={handleCreateEvent}>
          Create Event
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
