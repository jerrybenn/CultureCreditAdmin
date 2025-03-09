import React from 'react';
import HorizontalNav from '../../components/horizontalNavbar/HorizontalNav.jsx';
import './Events.css';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const Events = () => {
  return (
    <div className="eventsPageContainer">
      <HorizontalNav /> {/* ✅ Ensure it's outside of mainContent */}
      <div className="mainContent">
        <table className="eventsTable">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Host</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
              <th>#CC</th>
              <th>Checkins</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Event 1</td>
              <td>Host 1</td>
              <td>Location 1</td>
              <td>Date 1</td>
              <td>Time 1</td>
              <td>CC 1</td>
              <td>1</td>
              <td><MoreHorizIcon /></td>
            </tr>
            <tr>
              <td>Event 2</td>
              <td>Host 2</td>
              <td>Location 2</td>
              <td>Date 2</td>
              <td>Time 2</td>
              <td>CC 2</td>
              <td>1</td>
              <td><MoreHorizIcon /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Events;
