import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from "../api";

const EmailVerification = ({ venueId, email, onVerificationComplete }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    console.log('Email Verification component mounted');
    console.log('Venue ID:', venueId);
    console.log('Email:', email);
  }, [email, venueId]);

  const sendVerificationEmail = async () => {
    try {
      await api.post('/api/auth/send-venue-verification-email', { email, venueId });
      console.log('Verification email sent');
    } catch (error) {
      console.error('Error sending verification email:', error);
      setError('Failed to send verification email. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Verification code submitted:', verificationCode);
    try {
      await api.post('/api/auth/verify-venue-email', { venueId, verificationCode });
      if (onVerificationComplete) {
        onVerificationComplete();
      } else {
        history.push('/venue-phone-verification');
      }
    } catch (error) {
      console.error('Error during email verification:', error);
      setError('Invalid verification code');
    }
  };

  const handleResendCode = async () => {
    try {
      await api.post('/api/auth/send-venue-verification-email', { email, venueId });
      console.log('Verification email resent');
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error resending verification email:', error);
      setError('Failed to resend verification email. Please try again.');
    }
  };

  return (
    <div>
      <h2>Verify Your Venue Email</h2>
      <p>Click the button below to send a verification code to {email}.</p>
      <button onClick={sendVerificationEmail}>Send Verification Email</button>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={verificationCode} 
          onChange={(e) => setVerificationCode(e.target.value)} 
          placeholder="Enter verification code"
          required
        />
        <button type="submit">Verify</button>
      </form>
      <button onClick={handleResendCode}>Resend Code</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default EmailVerification;