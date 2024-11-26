import React, { useState } from 'react';

const UserMFAVerification = () => {
  const [method, setMethod] = useState('email');
  const [code, setCode] = useState('');

  const handleSendCode = () => {
    console.log(`Sending code via ${method}`);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    console.log(`Verifying code: ${code}`);
    history.push('/profile-setup');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'var(--bg-dark, #050505)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: '"Orbitron", sans-serif',
      position: 'relative',
      overflow: 'hidden',
    },
    verificationBox: {
      background: 'rgba(5, 5, 5, 0.8)',
      backdropFilter: 'blur(10px)',
      border: '1px solid #8A2BE2',
      borderRadius: '15px',
      padding: '3rem',
      width: '90%',
      maxWidth: '500px',
      position: 'relative',
      zIndex: 1,
      boxShadow: '0 0 20px #8A2BE2',
    },
    title: {
      color: '#8A2BE2',
      textAlign: 'center',
      fontSize: '2rem',
      marginBottom: '2rem',
      textTransform: 'uppercase',
      letterSpacing: '3px',
      textShadow: '0 0 10px #8A2BE2',
    },
    radioGroup: {
      display: 'flex',
      justifyContent: 'center',
      gap: '2rem',
      marginBottom: '2rem',
    },
    radioLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#fff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    radioInput: {
      appearance: 'none',
      width: '20px',
      height: '20px',
      border: '2px solid #8A2BE2',
      borderRadius: '50%',
      cursor: 'pointer',
      position: 'relative',
      '&:checked': {
        backgroundColor: '#8A2BE2',
        boxShadow: '0 0 10px #8A2BE2',
      },
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    input: {
      width: '100%',
      padding: '1rem',
      background: 'transparent',
      border: '2px solid rgba(138, 43, 226, 0.3)',
      borderRadius: '5px',
      color: '#fff',
      fontSize: '1.1rem',
      letterSpacing: '0.2em',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      outline: 'none',
    },
    button: {
      padding: '1rem',
      background: 'transparent',
      border: '2px solid #8A2BE2',
      color: '#8A2BE2',
      fontSize: '1.1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '20px',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      '&:hover': {
        background: 'rgba(138, 43, 226, 0.1)',
        boxShadow: '0 0 20px #8A2BE2',
      },
    },
    info: {
      color: '#8A2BE2',
      textAlign: 'center',
      marginBottom: '2rem',
      fontSize: '0.9rem',
      lineHeight: '1.5',
      opacity: '0.8',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.verificationBox}>
        <h2 style={styles.title}>Multi-Factor Authentication</h2>
        <p style={styles.info}>Choose your preferred verification method</p>
        
        <div style={styles.radioGroup}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              value="email"
              checked={method === 'email'}
              onChange={(e) => setMethod(e.target.value)}
              style={styles.radioInput}
            />
            Email
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              value="phone"
              checked={method === 'phone'}
              onChange={(e) => setMethod(e.target.value)}
              style={styles.radioInput}
            />
            Phone
          </label>
        </div>

        <button onClick={handleSendCode} style={styles.button}>
          Send Code
        </button>

        <form onSubmit={handleVerify} style={styles.form}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter verification code"
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserMFAVerification;