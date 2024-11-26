import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from "../api";

const PhoneVerification = ({ venueId, phone, onVerificationComplete }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    const sendVerificationSMS = async () => {
      try {
        await api.post('/api/auth/send-venue-verification-sms', { phone, venueId });
        console.log('Verification SMS sent');
      } catch (error) {
        console.error('Error sending verification SMS:', error);
        setError('Failed to send verification SMS. Please try again.');
      }
    };

    sendVerificationSMS();
  }, [phone, venueId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Phone verification code submitted:', verificationCode);
    try {
      await api.post('/api/auth/verify-venue-phone', { venueId, verificationCode });
      if (onVerificationComplete) {
        onVerificationComplete();
      } else {
        history.push('/venue-generate-keys');
      }
    } catch (error) {
      console.error('Error during phone verification:', error);
      setError('Invalid verification code');
    }
  };

  const handleResendCode = async () => {
    try {
      await api.post('/api/auth/send-venue-verification-sms', { phone, venueId });
      console.log('Verification SMS resent');
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error resending verification SMS:', error);
      setError('Failed to resend verification SMS. Please try again.');
    }
  };

  return (
    <div>
      <h2>Verify Your Venue Phone Number</h2>
      <p>A verification code has been sent to {phone}. Please enter it below.</p>
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

export default PhoneVerification;