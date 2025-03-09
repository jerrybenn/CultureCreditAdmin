import React from 'react'
import './AddEvent.css'

import xMark from '../assets/xmark.svg'
import calendar from '../assets/calendar.svg'
import clock from '../assets/clock.svg'

const AddEvent = ({onClose}) => {
  return (
    <div className="eventFormContainer">
        <div className="eventFormContent">
            <div className="formTitle">
                Create event
                <img src={xMark} alt=""  onClick={onClose}/>            
            </div>
            
            <div className="formInputContent">
                {/* Event Name */}
                <div className="textInputContainer">
                    Event name
                    <div className="inputContainer">
                        <input type="text" placeholder='Enter event name' />
                        <div className="addMore">Add description</div>
                    </div>
                </div>

                {/* Two Date Inputs Side by Side */}
                <div className="overcallNumericalInputContainer">
                    <div className="numericalInputContainer">
                        Date 
                        <div className="numericalInput">
                            <input type="text" placeholder='Event date' />
                            <img src={calendar} alt="" />
                        </div>
                    </div>
                    
                    <div className="numericalInputContainer">
                        Time 
                        <div className="numericalInput">
                            <input type="text" placeholder='Event time' />
                            <img src={clock} alt="" />
                        </div>
                    </div>

                    <div className="numericalInputContainer">
                        Duration 
                        <div className="numericalInput">
                            <input type="text" placeholder='Event duration' />
                        </div>
                    </div>
                </div>

                {/* Second Event Name Field */}
                <div className="textInputContainer">
                    Location
                    <div className="inputContainer">
                        <input type="text" placeholder='Enter event location' />
                        <div className="addMore">Add description</div>
                    </div>
                </div>

                {/* third Event Name Field */}
                <div className="textInputContainer">
                    Host name
                    <div className="inputContainer">
                        <input type="text" placeholder='Enter host name' />
                        <div className="addMore">Add description</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AddEvent;
