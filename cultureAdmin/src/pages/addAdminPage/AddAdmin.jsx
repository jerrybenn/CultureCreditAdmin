import React, { useState } from 'react';
import HorizontalNav from '../../components/horizontalNavbar/HorizontalNav.jsx';
import './AddAdmin.css';

const AddAdmin = () => {
  const [adminData, setAdminData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });

  const [status, setStatus] = useState({ message: '', type: '' }); // type: 'success' or 'error'

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setStatus({ message: '', type: '' });
    
    // Get the JWT token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      setStatus({ message: 'Not authorized. Please log in.', type: 'error' });
      return;
    }

    try {
      const response = await fetch('http://localhost:3841/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(adminData)
      });

      const result = await response.json();
      
      if (response.ok) {
        setStatus({ message: 'Admin created successfully!', type: 'success' });
        setAdminData({
          first_name: '',
          last_name: '',
          email: '',
          password: ''
        });
      } else if (response.status === 401) {
        setStatus({ message: 'Your session has expired. Please log in again.', type: 'error' });
        localStorage.removeItem('token');
        window.location.href = '/';
      } else {
        setStatus({ message: result.Error || 'Failed to create admin.', type: 'error' });
      }
    } catch (error) {
      console.error('Error submitting admin data:', error);
      setStatus({ message: 'Something went wrong. Please try again.', type: 'error' });
    }
  };

  return (
    <div>
      <div className="mainContent">
        <div className="addAdminForm">
          <div className="formTitle">
            Add New Admin
            <div className="formSubtitle">Add a new admin to the system</div>
          </div>
          <div className="formContent">
            <div className="nameContainer">
              <div className="adminInputContainer">
                <input
                  type="text"
                  name="first_name"
                  value={adminData.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                />
              </div>
              <div className="adminInputContainer">
                <input
                  type="text"
                  name="last_name"
                  value={adminData.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div className="adminInputContainer">
              <input
                type="email"
                name="email"
                value={adminData.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
            <div className="adminInputContainer">
              <input
                type="password"
                name="password"
                value={adminData.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </div>
          </div>

          <div className="formFooter">
            <div className="formButton" onClick={handleSubmit}>
              Submit
            </div>
            {status.message && (
              <div className={`formStatus ${status.type}`}>
                {status.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;
