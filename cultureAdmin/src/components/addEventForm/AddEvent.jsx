import React, { useState } from 'react';
import './AddEvent.css';

import xMark from '../assets/xmark.svg';
import calendar from '../assets/calendar.svg';
import clock from '../assets/clock.svg';
import timer from '../assets/timer (1).svg';
import CheckIcon from '@mui/icons-material/Check';
import check from '../assets/check.svg';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';



const AddEvent = ({ onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file)); // Create preview URL
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Prevent default behavior to allow drop
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setSelectedImage(null); // Remove selected file
  };

  return (
    <div className="eventFormContainer">
      <div className="eventFormContent">
        <div className="formTitle">
          Create event
          <img src={xMark} alt="Close" onClick={onClose} />
        </div>

        <div className="formInputContent">
          {/* Event Name */}
          <div className="textInputContainer">
            Event name
            <div className="inputContainer">
              <input type="text" placeholder="Enter event name" />
              <div className="addMore">Add description</div>
            </div>
          </div>

          {/* Date, Time, Duration */}
          <div className="overcallNumericalInputContainer">
            <div className="numericalInputContainer">
              Date
              <div className="numericalInput">
                <input type="text" placeholder="Event date" />
                <img src={calendar} alt="Calendar" />
              </div>
            </div>

            <div className="numericalInputContainer">
              Time
              <div className="numericalInput">
                <input type="text" placeholder="Event time" />
                <img src={clock} alt="Clock" />
              </div>
            </div>

            <div className="numericalInputContainer">
              Duration
              <div className="numericalInput">
                <input type="text" placeholder="Event duration" />
                <img src={timer} alt="Timer" />
                
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="textInputContainer">
            Location
            <div className="inputContainer">
              <input type="text" placeholder="Enter event location" />
              <div className="addMore">Add description</div>
            </div>
          </div>

          {/* Host Name */}
          <div className="textInputContainer">
            Host name
            <div className="inputContainer">
              <input type="text" placeholder="Enter host name" />
              <div className="addMore">Add description</div>
            </div>
          </div>

          {/* Upload Image Section */}
          <div
            className="uploadImageContainer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="uploadImage">
              {!selectedImage && ( // Hide icon when an image is uploaded
                <AddPhotoAlternateIcon sx={{ fontSize: 40, color: "#005ffe" }} />
              )}

              {selectedImage ? (
                <div className="imagePreview">
                  <img src={selectedImage} alt="Uploaded Preview" />
                  <button className="cancelButton" onClick={handleCancel}>Cancel</button>
                </div>
              ) : (
                <div className="uploadText">
                  <label htmlFor="fileInput" className="clickToUpload">
                    Click to upload
                  </label> 
                  <span> or drag to drop.</span>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                  />
                </div>
              )}
            </div>
          </div>
          <div className="submitContainer">
            <div className="formSubmit">
                Submit
                
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AddEvent;
