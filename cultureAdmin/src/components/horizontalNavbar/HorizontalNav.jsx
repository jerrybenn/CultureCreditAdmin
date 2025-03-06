import {React, useState} from 'react'
import './HorizontalNav.css'
import searchIcon from '../assets/search.svg'
import bellIcon from '../assets/bell.svg'
import AddEvent from '../../components/addEventForm/AddEvent.jsx';

const HorizontalNav = () => {

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="horizontalNavContainter">
      
        <div className="iconBorder">
            <img src={searchIcon} alt="" />
        </div>
        <div className="iconBorder">
            <img src={bellIcon} alt="" />
        </div>
        <div className="addNew" onClick={() => setShowModal(true)}>+ Add New</div>
        {showModal && <AddEvent onClose={() => setShowModal(false)}/>}
    </div>
  )
}

export default HorizontalNav