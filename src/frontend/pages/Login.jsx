import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../api';  // Make sure this path is correct

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/auth/login', { email, password });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('userRole', response.data.role);
      
      // Redirect based on role
      if (response.data.role === 'venue') {
        history.push('/venue/home');
      } else {
        history.push('/home');
      }
    } catch (error) {
      setError('Login failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;