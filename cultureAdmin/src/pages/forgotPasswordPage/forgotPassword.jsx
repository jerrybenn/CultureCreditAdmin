import React, { useState } from 'react';
import './forgotPassword.css';
import { useNavigate } from 'react-router-dom';
import mail from '../../components/assets/mail.svg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically make an API call to handle the password reset
    console.log('Password reset requested for:', email);
    alert(`Password reset link has been sent to ${email}`);
  };

  return (
    <div className='container'>
      <div className='forgotPasswordForm'>
        <div className='logoText'>
          <h1>Reset Password</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='emailContainer'>
            <img src={mail} alt='' />
            <input 
              type='email' 
              placeholder='Email Address' 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='submitContainer'>
            <button type="submit" className="submit">Send Reset Link</button>
          </div>
        </form>

        <div className='backToLogin'>
          <button onClick={() => navigate('/')}>Back to Login</button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;