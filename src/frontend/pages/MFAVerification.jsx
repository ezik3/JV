import React, { useState } from 'react';

const MFAVerification = () => {
  const [method, setMethod] = useState('email');
  const [code, setCode] = useState('');

  const handleSendCode = () => {
    console.log(`Sending code via ${method}`);
    // In a real app, this would send the code to the user's email or phone
  };

  const handleVerify = (e) => {
    e.preventDefault();
    console.log(`Verifying code: ${code}`);
    // In a real app, this would check if the code is correct
  };

  return (
    <div>
      <h2>Multi-Factor Authentication</h2>
      <div>
        <label>
          <input
            type="radio"
            value="email"
            checked={method === 'email'}
            onChange={(e) => setMethod(e.target.value)}
          />
          Email
        </label>
        <label>
          <input
            type="radio"
            value="phone"
            checked={method === 'phone'}
            onChange={(e) => setMethod(e.target.value)}
          />
          Phone
        </label>
      </div>
      <button onClick={handleSendCode}>Send Code</button>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter verification code"
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default MFAVerification;
