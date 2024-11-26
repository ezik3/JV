import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../api';
import './VenueSignup.css';
import SignupForm from './SignupForm';
import IDUploadAndFacialRecognition from './IDUploadAndFacialRecognition';
import EmailVerification from './EmailVerification';
import PhoneVerification from './PhoneVerification';

function VenueSignup() {
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);
  const [venueData, setVenueData] = useState({});
  const [venueId, setVenueId] = useState(null);
  const history = useHistory();

  useEffect(() => {
    console.log('Current step:', step);
  }, [step]);

  const handleSubmit = async (formData) => {
    console.log('handleSubmit called in VenueSignup');
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords don't match!");
      return;
    }
    
    if (documents.length === 0) {
      setMessage("Please upload at least one document for verification.");
      return;
    }

    const completeVenueData = {
      ...formData,
      role: 'venue',
      verificationDocuments: documents.map(doc => doc.name)
    };

    console.log('Complete Venue Signup:', completeVenueData);
    
    try {
      console.log('Attempting to send data to backend');
      const response = await api.post('/api/auth/register-venue', completeVenueData);
      console.log('Registration response:', response);
      
      if (response.data && response.data.venueId) {
        setMessage('Venue registration submitted successfully. Please proceed with ID verification.');
        setVenueData(completeVenueData);
        setVenueId(response.data.venueId);
        setStep(2); // Move to the next step (ID Upload and Facial Recognition)
      } else {
        setMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage(`An error occurred during registration: ${error.message}`);
    }
  };

  const handleIDUploadComplete = async (idData) => {
    console.log('ID Upload complete:', idData);
    setStep(3); // Move to email verification step
  };

  const handleEmailVerificationComplete = () => {
    setStep(4); // Move to phone verification step
  };

  const handlePhoneVerificationComplete = () => {
    history.push('/venue-generate-keys');
  };

  const handleFileUpload = (e) => {
    const newDocuments = Array.from(e.target.files);
    setDocuments(prevDocuments => [...prevDocuments, ...newDocuments]);
  };

  const removeDocument = (index) => {
    setDocuments(prevDocuments => prevDocuments.filter((_, i) => i !== index));
  };

  return (
    <div className="venue-signup">
      <h2>Venue Registration</h2>
      {message && <p className="message">{message}</p>}
      <p>Current step: {step}</p>
      {step === 1 && (
        <>
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
          <SignupForm type="venue" onSubmit={handleSubmit} />
        </>
      )}
      {step === 2 && (
        <IDUploadAndFacialRecognition onComplete={handleIDUploadComplete} />
      )}
      {step === 3 && (
        <EmailVerification 
          venueId={venueId}
          onVerificationComplete={handleEmailVerificationComplete}
        />
      )}
      {step === 4 && (
        <PhoneVerification
          venueId={venueId}
          onVerificationComplete={handlePhoneVerificationComplete}
        />
      )}
    </div>
  );
}

export default VenueSignup;