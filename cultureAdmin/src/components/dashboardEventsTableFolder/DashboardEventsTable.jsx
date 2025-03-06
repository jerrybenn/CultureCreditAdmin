import  {React, useEffect, useState} from 'react'
import './DashboardEventsTable.css'

const DashboardEventsTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {

      const loadData = async() =>  {
        console.log('fetching data');
        const d = await fetch('http://127.0.0.1:5000/events')
        const json = await d.json()
        setData(json.events)

      

     
        /*.then(data => setData(data))
        .catch(error => console.error('Error fetching data:', error));*/
        
        console.log('done fetching data');
      }
      loadData()

    },[]);
    
      

  

  return (
    
    <div className="table-container">
    <table className="event-table">
      <thead>
        <tr>
          <th>Event Name</th>
          <th>Host</th>
          <th>Location</th>
          <th>Date</th>
          <th>Time</th>
          <th>#CC</th>
        </tr>
      </thead>
      <tbody>
      {data.map((events, index) => (
        <tr key={index}>
          <td>{events.eventName}</td>
          <td>{events.host}</td>
          <td>{events.location}</td>
          <td>{events.date}</td>
          <td>{events.time}</td>
          <td>{events.numOfCC}</td>
        </tr>
      ))}
      </tbody>
    </table>
  </div>
  )
}

export default DashboardEventsTable;