import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';



import mail from '../../components/assets/mail.svg';
import lock from '../../components/assets/lock.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const webLink = "http://DSU-Matlab-02.desu.edu:5000/web/admin/";
  const localLink = "http://127.0.0.1:5000/web/admin/";

  const handleLogin = async() => {

    try {
      const response = await fetch(localLink, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Login Successful:", data);
        navigate("/home");
      } else {
        alert("Invalid credentials, please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong. Please try again later.");
    }
    
    
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className='container'>
      <div className='loginForm'>
        <div className='logoText'>
          <h1>Culture Admin</h1>
        </div>

        <div className='emailContainer'>
          <img src={mail} alt='' />
          <input 
            type='email' 
            placeholder='Email Address' 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className='passwordContainer'>
          <img src={lock} alt='' />
          <input 
            type='password' 
            placeholder='Password' 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className='forgot'>Forgot Password?</div>

        <div className='submitContainer'>
        <div className="submit" onClick={handleLogin}>Login</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
