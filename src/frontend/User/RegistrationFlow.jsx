import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import UserSignupForm from './UserSignupForm';
import UserEmailVerification from './UserEmailVerification';
import UserPhoneVerification from './UserPhoneVerification';
import UserGenerateKeys from './UserGenerateKeys';
import UserPrivateKey from './UserPrivateKey';
import UserMFAVerification from './UserMFAVerification';
import ProfileSetup from '../components/ProfileSetup'; // Add this import

const RegistrationFlow = () => {
  const [step, setStep] = useState('signup');
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const history = useHistory();

  const handleSignupComplete = (newUserId, role) => {
    setUserId(newUserId);
    setUserRole(role);
    setStep('emailVerification');
  };

  const handleEmailVerificationComplete = () => {
    setStep('phoneVerification');
  };

  const handlePhoneVerificationComplete = () => {
    setStep('generateKeys');
  };

  const handleKeysGenerated = () => {
    setStep('privateKey');
  };

  const handlePrivateKeyComplete = () => {
    setStep('profileSetup'); // Changed from 'mfaVerification' to 'profileSetup'
  };

  const handleProfileSetupComplete = () => {
    setStep('mfaVerification');
  };

  const handleMFAComplete = () => {
    // Redirect to appropriate feed based on role
    if (userRole === 'venue') {
      history.push('/venue-feed');
    } else {
      history.push('/party-feed');
    }
  };

  return (
    <div>
      {step === 'signup' && (
        <UserSignupForm onRegistrationComplete={handleSignupComplete} />
      )}
      {step === 'emailVerification' && (
        <UserEmailVerification
          userId={userId}
          onVerificationComplete={handleEmailVerificationComplete}
        />
      )}
      {step === 'phoneVerification' && (
        <UserPhoneVerification
          userId={userId}
          onVerificationComplete={handlePhoneVerificationComplete}
        />
      )}
      {step === 'generateKeys' && (
        <UserGenerateKeys
          userId={userId}
          onKeysGenerated={handleKeysGenerated}
        />
      )}
      {step === 'privateKey' && (
        <UserPrivateKey
          userId={userId}
          onPrivateKeyComplete={handlePrivateKeyComplete}
        />
      )}
      {step === 'profileSetup' && (
        <ProfileSetup
          userId={userId}
          userRole={userRole}
          onComplete={handleProfileSetupComplete}
        />
      )}
      {step === 'mfaVerification' && (
        <UserMFAVerification
          userId={userId}
          onMFAComplete={handleMFAComplete}
        />
      )}
    </div>
  );
};

export default RegistrationFlow;