import React from 'react';
import './AdminResetPassword.css';

const AdminResetPassword = () => {
    return (<div className="mainContent">
        <div className="adminResetForm">
            <div className="formTitle">
                Reset Password
                <div className="formSubtitle">Enter a new password below to regain access to your account.</div>
            </div>
            
            <div className="formContent">
                <div className="adminInputContainer">
                    <input type="password" placeholder="Old Password" />
                </div>
                <div className="adminInputContainer">
                    <input type="password" placeholder="New Password" />
                </div>
            </div>
            <div className="formFooter">
            <div className="formButton" >
              Submit
            </div>
          </div>
        </div>
    </div>
);
};

export default AdminResetPassword;