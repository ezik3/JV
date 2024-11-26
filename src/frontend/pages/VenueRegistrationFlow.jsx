import React, { useState, useEffect } from 'react';
import api from '../api';
import SignupForm from './SignupForm';
import IDUploadAndFacialRecognition from './IDUploadAndFacialRecognition';
import EmailVerification from './EmailVerification';
import PhoneVerification from './PhoneVerification';
import GenerateKeys from './GenerateKeys';
import PrivateKey from './PrivateKey';

const VenueRegistrationFlow = () => {
  const [step, setStep] = useState(1);
  const [venueData, setVenueData] = useState({});
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('Current step:', step);
    console.log('Current venueData:', venueData);
  }, [step, venueData]);

  const nextStep = () => {
    setStep(prevStep => prevStep + 1);
  };

  const handleVenueData = async (formData) => {
    console.log('handleVenueData called with:', formData);
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords don't match!");
      return;
    }
  
    const completeVenueData = {
      ...formData,
      role: 'venue',
      verificationDocuments: documents.map(doc => doc.name)
    };
  
    try {
      console.log('Attempting to send data to backend:', completeVenueData);
      const response = await api.post('/api/auth/register-venue', completeVenueData);
      console.log('Registration response:', response);
      
      if (response.data && response.data.userId) {
        setVenueData({ ...completeVenueData, id: response.data.userId });
        setMessage('Venue registered successfully. Proceeding to next step.');
        console.log('Moving to next step');
        nextStep();
      } else {
        setMessage('Failed to register venue. Please try again.');
      }
    } catch (error) {
      console.error('Error registering venue:', error);
      setMessage('Failed to register venue. Please try again.');
    }
  };

  const handleFileUpload = (e) => {
    const newDocuments = Array.from(e.target.files);
    setDocuments(prevDocuments => [...prevDocuments, ...newDocuments]);
  };

  const removeDocument = (index) => {
    setDocuments(prevDocuments => prevDocuments.filter((_, i) => i !== index));
  };

  const handleIDUploadComplete = async (idData) => {
    console.log('ID Upload complete:', idData);
    nextStep();
  };

  const handleEmailVerificationComplete = () => {
    console.log('Email verification complete');
    nextStep();
  };

  const handlePhoneVerificationComplete = () => {
    console.log('Phone verification complete');
    nextStep();
  };

  const handleGenerateKeysComplete = () => {
    console.log('Keys generated');
    nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2>Venue Registration</h2>
            {message && <p className="message">{message}</p>}
            <div className="file-upload">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.png,.doc,.docx"
                multiple
                required
              />
              <p>Upload ownership proof documents (business license, property deed, etc.)</p>
            </div>
            {documents.length > 0 && (
              <div className="uploaded-documents">
                <h4>Uploaded Documents:</h4>
                <ul>
                  {documents.map((doc, index) => (
                    <li key={index}>
                      {doc.name}
                      <button type="button" onClick={() => removeDocument(index)}>Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <SignupForm type="venue" onSubmit={handleVenueData} />
          </div>
        );
      case 2:
        return <IDUploadAndFacialRecognition onComplete={handleIDUploadComplete} />;
      case 3:
        return (
          <EmailVerification 
            venueId={venueData.id} 
            email={venueData.email}
            onVerificationComplete={handleEmailVerificationComplete} 
          />
        );
      case 4:
        return (
          <PhoneVerification 
            venueId={venueData.id} 
            phone={venueData.phone}
            onVerificationComplete={handlePhoneVerificationComplete} 
          />
        );
      case 5:
        return <GenerateKeys venueId={venueData.id} onComplete={handleGenerateKeysComplete} />;
      case 6:
        return <PrivateKey venueData={venueData} onComplete={() => setStep(7)} />;
      case 7:
        return <div>Registration Complete</div>;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="venue-registration-flow">
      <h1>Venue Registration - Step {step}</h1>
      {renderStep()}
    </div>
  );
};

export default VenueRegistrationFlow;