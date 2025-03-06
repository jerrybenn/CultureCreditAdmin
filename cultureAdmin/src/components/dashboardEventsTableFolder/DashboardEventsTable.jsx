import React from 'react'
import './DashboardEventsTable.css'

const DashboardEventsTable = () => {
  return (
    <div className="table-container">
    <table className="event-table">
      <thead>
        <tr>
          <th>Event</th>
          <th>Host</th>
          <th>Location</th>
          <th>Date</th>
          <th>Time</th>
          <th>#CC</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>2025 Hackathon</td>
          <td>CS Scinence Club</td>
          <td>BOA 230</td>
          <td>March 15, 2025</td>
          <td>6:00 PM</td>
          <td>3</td>
        </tr>
      </tbody>
    </table>
  </div>
  )
}

export default DashboardEventsTable