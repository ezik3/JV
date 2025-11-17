import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/managerLogin.css';

const ManagerLogin = () => {
  const [step, setStep] = useState(1);
  const [theme, setTheme] = useState('dark');
  const [currentPin, setCurrentPin] = useState('');
  const history = useHistory();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    // Here you would validate the credentials
    console.log('Validating credentials:', { email, password });
    
    // If validation successful, show PIN setup
    setStep(2);
  };

  const handleKeyPress = (value) => {
    if (value === 'Clear') {
      setCurrentPin('');
    } else if (value === 'Enter') {
      if (currentPin.length === 6) {
        console.log('Saving PIN:', currentPin);
        history.push('/venue/pos/dashboard');
      }
    } else if (currentPin.length < 6) {
      setCurrentPin(prev => prev + value);
    }
  };

  const renderKeypad = () => {
    const keys = [
      '1', '2', '3',
      '4', '5', '6',
      '7', '8', '9',
      'Clear', '0', 'Enter'
    ];

    return keys.map((key, index) => (
      <button
        key={index}
        className={`key ${key === 'Clear' ? 'clear' : ''} ${key === 'Enter' ? 'enter' : ''}`}
        onClick={() => handleKeyPress(key)}
      >
        {key}
      </button>
    ));
  };

  return (
    <div className="pos-page">
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'dark' ? '🌙' : '☀️'}
      </button>

      <div className="login-container">
        <div className={`steps ${step === 1 ? 'active' : ''}`}>
          <div className="welcome-text">
            <h1>Manager Login</h1>
            <p>Please enter your credentials</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                required
                placeholder="Enter your password"
              />
            </div>
            
            <button type="submit" className="submit-btn">
              Continue
            </button>
          </form>
        </div>
        
        <div className={`steps ${step === 2 ? 'active' : ''}`}>
          <div className="welcome-text">
            <h1>Set Master PIN</h1>
            <p>Create a 6-digit PIN for manager access</p>
          </div>
          
          <div className="pin-dots">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className={`pin-dot ${index < currentPin.length ? 'filled' : ''}`}
              />
            ))}
          </div>
          
          <div className="keypad">
            {renderKeypad()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerLogin;