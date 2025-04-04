import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './HorizontalNav.css';
import searchIcon from '../assets/search.svg';
import bellIcon from '../assets/bell.svg';
import AddEvent from '../../components/addEventForm/AddEvent.jsx';

const HorizontalNav = ({ searchQuery, setSearchQuery }) => {
  const [showModal, setShowModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const location = useLocation();

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

      <div className="iconBorder">
        <img src={bellIcon} alt="Notifications" />
      </div>

      <div className="addNew" onClick={() => setShowModal(true)}>+ Add New</div>

      {showModal && <AddEvent onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default HorizontalNav;
