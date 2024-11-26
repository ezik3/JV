import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from "../api";

const UserEmailVerification = ({ userId, onVerificationComplete }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/verify-email', { userId, verificationCode });
      if (onVerificationComplete) {
        onVerificationComplete();
      } else {
        history.push('/user-phone-verification');
      }
    } catch (error) {
      setError('Invalid verification code');
    }
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
      border: '1px solid #00fff2',
      borderRadius: '15px',
      padding: '3rem',
      width: '90%',
      maxWidth: '500px',
      position: 'relative',
      zIndex: 1,
      boxShadow: '0 0 20px #00fff2',
      animation: 'pulse 2s infinite',
    },
    title: {
      color: '#00fff2',
      textAlign: 'center',
      fontSize: '2rem',
      marginBottom: '2rem',
      textTransform: 'uppercase',
      letterSpacing: '3px',
      textShadow: '0 0 10px #00fff2',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    inputGroup: {
      position: 'relative',
    },
    input: {
      width: '100%',
      padding: '1rem',
      background: 'transparent',
      border: '2px solid rgba(0, 255, 242, 0.3)',
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
      border: '2px solid #00fff2',
      color: '#00fff2',
      fontSize: '1.1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '20px',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      position: 'relative',
      overflow: 'hidden',
    },
    error: {
      color: '#ff0055',
      textAlign: 'center',
      marginTop: '1rem',
      fontSize: '0.9rem',
      textShadow: '0 0 5px #ff0055',
    },
    info: {
      color: '#00fff2',
      textAlign: 'center',
      marginBottom: '2rem',
      fontSize: '0.9rem',
      lineHeight: '1.5',
      opacity: '0.8',
    },
    '@keyframes pulse': {
      '0%': { boxShadow: '0 0 20px #00fff2' },
      '50%': { boxShadow: '0 0 40px #00fff2' },
      '100%': { boxShadow: '0 0 20px #00fff2' },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.verificationBox}>
        <h2 style={styles.title}>Email Verification</h2>
        <p style={styles.info}>
          Enter the verification code sent to your email to continue your journey
        </p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter Code"
              required
              style={styles.input}
              maxLength="6"
            />
          </div>
          <button type="submit" style={styles.button}>
            Verify Email
          </button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default UserEmailVerification;