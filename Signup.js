import React, { useState } from 'react';
import './Signup.css';

const Signup = ({ onRedirectToLogin }) => {
  const [formData, setFormData] = useState({
    username: '', 
    email: '', 
    password: '', 
    allergies: '', 
    prefers: '', 
    avoids: '', 
    height: '', 
    weight: '', 
    age: ''
  });

  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.password) {
      alert("Please fill out all required fields");
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3030/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Signup successful:', data);
        
        // Show success message and then redirect to login form
        setSignupSuccess(true);
        setTimeout(() => {
          onRedirectToLogin();
        }, 2000); // Redirect after 2 seconds
      } else {
        const text = await response.text();
        console.error('Unexpected response format:', text);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="signup-container">
      <h2>Create an Account</h2>
      {signupSuccess ? (
        <div className="success-message">
          Signup successful! Redirecting to login...
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              placeholder="Enter your username" 
              value={formData.username} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Enter your email" 
              value={formData.email} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Enter your password" 
              value={formData.password} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="allergies">Allergies</label>
            <input 
              type="text" 
              id="allergies" 
              name="allergies" 
              placeholder="Enter your allergies" 
              value={formData.allergies} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="prefers">Prefers</label>
            <input 
              type="text" 
              id="prefers" 
              name="prefers" 
              placeholder="Foods you prefer" 
              value={formData.prefers} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="avoids">Avoids</label>
            <input 
              type="text" 
              id="avoids" 
              name="avoids" 
              placeholder="Foods you avoid" 
              value={formData.avoids} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="height">Height</label>
            <input 
              type="text" 
              id="height" 
              name="height" 
              placeholder="Enter your height" 
              value={formData.height} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="weight">Weight</label>
            <input 
              type="text" 
              id="weight" 
              name="weight" 
              placeholder="Enter your weight" 
              value={formData.weight} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input 
              type="text" 
              id="age" 
              name="age" 
              placeholder="Enter your age" 
              value={formData.age} 
              onChange={handleChange} 
            />
          </div>
          <button type="submit" className="btn-submit">Sign Up</button>
        </form>
      )}
    </div>
  );
};

export default Signup;



