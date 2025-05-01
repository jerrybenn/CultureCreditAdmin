import React, { useState } from 'react';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';

import mail from '../../components/assets/mail.svg';
import lock from '../../components/assets/lock.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const webLink = "http://127.0.0.1:3841/login";

  const handleLogin = async () => {
    try {
      const response = await fetch(webLink, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login Successful:", data);

        // 🔐 Store the correct token (either `token` or `access_token`)
        const jwt = data.token || data.access_token;
        if (!jwt) {
          throw new Error("No token returned in response");
        }

        localStorage.setItem('token', jwt);
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

        <Link to="/forgotpassword" className='forgot'>Forgot Password?</Link>

        <div className='submitContainer'>
          <div className="submit" onClick={handleLogin}>Login</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
