import React from 'react'
import './AddEvent.css'

import xMark from '../assets/xmark.svg'

const AddEvent = ({onClose}) => {
  return (
    <div className="eventFormContainer">
        <div className="eventFormContent">
            <div className="formTitle">
                Create
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
                            <input type="text" placeholder='Enter event date' />
                        </div>
                    </div>
                    
                    <div className="numericalInputContainer">
                        Time 
                        <div className="numericalInput">
                            <input type="text" placeholder='Enter event date' />
                        </div>
                    </div>

                    <div className="numericalInputContainer">
                        Duration 
                        <div className="numericalInput">
                            <input type="text" placeholder='Enter event date' />
                        </div>
                    </div>
                </div>

                {/* Second Event Name Field */}
                <div className="textInputContainer">
                    Location
                    <div className="inputContainer">
                        <input type="text" placeholder='Enter event name' />
                        <div className="addMore">Add description</div>
                    </div>
                </div>

                {/* third Event Name Field */}
                <div className="textInputContainer">
                    Host name
                    <div className="inputContainer">
                        <input type="text" placeholder='Enter event name' />
                        <div className="addMore">Add description</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AddEvent;
