import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './HorizontalNav.css';
import searchIcon from '../assets/search.svg';
import bellIcon from '../assets/bell.svg';
import AddEvent from '../../components/addEventForm/AddEvent.jsx';
import { Menu, MenuItem, Tabs, Tab, List, ListItem, ListItemText } from '@mui/material';
import Grow from '@mui/material/Grow';

const HorizontalNav = ({ searchQuery, setSearchQuery }) => {
  const [showModal, setShowModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notificationTab, setNotificationTab] = useState(0);
  const location = useLocation();

  // Mock notification data - replace with actual data from your backend
  const recentNotifications = [
    { id: 1, message: "New event 'Spring Festival' has been added", time: "2 hours ago" },
    { id: 2, message: "Student John Doe attended 'Art Exhibition'", time: "5 hours ago" },
  ];

  const olderNotifications = [
    { id: 3, message: "Event 'Music Concert' was completed", time: "2 days ago" },
    { id: 4, message: "New instructor Jane Smith joined", time: "3 days ago" },
  ];

  // Show search by default on students page
  useEffect(() => {
    if (location.pathname === "/students") {
      setShowSearch(true);
    }
  }, [location.pathname]);

  const getPlaceholder = () => {
    if (location.pathname === "/events") {
      return "Search events";
    } else if (location.pathname === "/students") {
      return "Search students";
    }
    return "Search";
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      console.log('Search Query:', searchQuery);
    }
  };

  const handleNotificationTabChange = (event, newValue) => {
    setNotificationTab(newValue);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  return (
    <div className="horizontalNavContainter">
      {showSearch && (
        <div className="searchInput">
          <input
            type="text"
            placeholder={getPlaceholder()}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      )}

      <div className="iconBorder" onClick={() => setShowSearch(!showSearch)}>
        <img src={searchIcon} alt="Search" />
      </div>

      <div className="iconBorder" onClick={handleNotificationClick}>
        <img src={bellIcon} alt="Notifications" />
      </div>

      <div className="addNew" onClick={() => setShowModal(true)}>+ Add New</div>

      {showModal && <AddEvent onClose={() => setShowModal(false)} />}

      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationClose}
        PaperProps={{
          style: {
            width: 320,
            maxHeight: 400,
            transform: 'translate(115px, 8px)'
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Tabs 
          value={notificationTab} 
          onChange={handleNotificationTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Recent" />
          <Tab label="Older" />
        </Tabs>
        
        <List sx={{ width: '100%', maxHeight: 300, overflow: 'auto' }}>
          {(notificationTab === 0 ? recentNotifications : olderNotifications).map((notification) => (
            <MenuItem 
              key={notification.id} 
              onClick={handleNotificationClose}
              sx={{ 
                whiteSpace: 'normal',
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <ListItemText
                primary={notification.message}
                secondary={notification.time}
                primaryTypographyProps={{
                  sx: {
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    wordBreak: 'break-word'
                  }
                }}
                secondaryTypographyProps={{
                  sx: {
                    fontSize: '0.75rem',
                    color: 'text.secondary'
                  }
                }}
              />
            </MenuItem>
          ))}
        </List>
      </Menu>
    </div>
  );
};

export default HorizontalNav;
