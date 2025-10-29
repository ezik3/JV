import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './UserSignupForm.css';

export default function UserSignupForm({ onRegistrationComplete }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    fullName: ''
  });
  const [error, setError] = useState('');
  const history = useHistory();
  const [activeField, setActiveField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', {
        username: formData.email,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        fullName: formData.fullName
      });
      
      if (response.data.userId) {
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.role);
        localStorage.setItem('userFullName', formData.fullName);
        localStorage.setItem('userPhone', formData.phone);
        localStorage.setItem('userEmail', formData.email);
        history.push('/user-email-verification');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.response?.data?.error || error.message || 'Registration failed');
    }
  };

  return (
    <div className="signup-container">
      <div className="cyber-grid"></div>
      <div className="form-wrapper">
        <div className="hologram-effect"></div>
        <h1 className="cyber-title">Initialize User Protocol</h1>
        <form onSubmit={handleSubmit} className="cyber-form">
          <div className="input-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setActiveField('email')}
              onBlur={() => setActiveField(null)}
              className={`cyber-input ${activeField === 'email' ? 'active' : ''}`}
              required
            />
            <label className="cyber-label">Email</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setActiveField('password')}
              onBlur={() => setActiveField(null)}
              className={`cyber-input ${activeField === 'password' ? 'active' : ''}`}
              required
            />
            <label className="cyber-label">Password</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onFocus={() => setActiveField('confirmPassword')}
              onBlur={() => setActiveField(null)}
              className={`cyber-input ${activeField === 'confirmPassword' ? 'active' : ''}`}
              required
            />
            <label className="cyber-label">Confirm Password</label>
          </div>

          <div className="input-group">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onFocus={() => setActiveField('phone')}
              onBlur={() => setActiveField(null)}
              className={`cyber-input ${activeField === 'phone' ? 'active' : ''}`}
              required
            />
            <label className="cyber-label">Phone Number</label>
          </div>

          <div className="input-group">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onFocus={() => setActiveField('fullName')}
              onBlur={() => setActiveField(null)}
              className={`cyber-input ${activeField === 'fullName' ? 'active' : ''}`}
              required
            />
            <label className="cyber-label">Full Name</label>
          </div>

          {error && <div className="error-message" style={{color: '#ff0000', marginBottom: '1rem'}}>{error}</div>}
          <button type="submit" className="cyber-button">
            <span className="button-content">Sign Up</span>
            <span className="button-glitch"></span>
          </button>
        </form>
      </div>    </div>
  );
}
