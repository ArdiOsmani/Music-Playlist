import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Login.css';

function Login() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 


  const handleLoginSlide = () => {
    setIsLoginView(true);
    setError('');
  };

  const handleSignupSlide = () => {
    setIsLoginView(false);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!loginUsername || !loginPassword) {
      setError("Please enter both username and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:8585/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      console.log(response)

      const data = await response.json();

      console.log(data)

      if (response.ok) {
        console.log("Success", data);
        setLoginUsername("");
        setLoginPassword("");
        navigate("/home");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!signupUsername || !signupPassword) {
      setError('Please enter both username and password');
      return;
    }

    // Optional: Add password strength check
    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await fetch('http://localhost:8585/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: signupUsername,
          password: signupPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Signup Success', data);
        
        setIsLoginView(true);
        alert('Signup Successful! Please log in.');
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className={`form-structor ${isLoginView ? '' : 'slide-up'}`}>
      <div className={`signup ${isLoginView ? '' : 'slide-up'}`}>
        <h2
          className="form-title"
          id="signup"
          onClick={handleLoginSlide}
        >
          <span>or</span>Register
        </h2>
        <div className="form-holder">
          <input
            type="text"
            className="input"
            placeholder="Username"
            value={signupUsername}
            onChange={(e) => setSignupUsername(e.target.value)}
          />
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button
          className="submit-btn"
          onClick={handleSignup}
        >
          Register
        </button>
      </div>

      <div className={`login ${isLoginView ? 'slide-up' : ''}`}>
        <div className="center">
          <h2
            className="form-title"
            id="login"
            onClick={handleSignupSlide}
          >
            <span>or</span>Log in
          </h2>
          <div className="form-holder">
            <input
              type="text"
              className="input"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />
            <input
              type="password"
              className="input"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button
            className="submit-btn"
            onClick={handleLogin}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;