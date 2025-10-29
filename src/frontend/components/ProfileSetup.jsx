import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Webcam from 'react-webcam';
import api from '../api';
import './ProfileSetup.css';

const ProfileSetup = (props) => {
  useEffect(() => {
    console.log('ProfileSetup mounted with props:', props);
    // Load fullName from localStorage
    const storedFullName = localStorage.getItem('userFullName');
    if (storedFullName) {
      setFullName(storedFullName);
    }
  }, []);

  const [step, setStep] = useState('username');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [showUsername, setShowUsername] = useState(true);
  const [location, setLocation] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState('');
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const history = useHistory();

  const handleUsernameSubmit = async () => {
    const storedUserId = localStorage.getItem('userId');
    try {
      const response = await api.post('/api/profile/update-username', {
        userId: storedUserId,
        username,
        showUsername
      });
      if (username.trim()) {
        localStorage.setItem('username', username);
      }
      setStep('photo');
    } catch (error) {
      setError('Failed to update username. Please try again.');
    }
  };

  const handlePhotoCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setProfilePic(imageSrc);
    setIsCameraActive(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = async (photoData) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await api.post('/api/profile/update-photo', {
        userId,
        profilePic: photoData
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to upload profile picture: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      console.log('=== PROFILE SETUP SUBMIT START ===');
      console.log('Submitting profile setup...');
      const result = await handlePhotoUpload(profilePic);
      console.log('Photo upload result:', JSON.stringify(result, null, 2));
      console.log('result.success:', result.success);
      console.log('result.isProfileComplete:', result.isProfileComplete);
      console.log('typeof result.success:', typeof result.success);
      console.log('typeof result.isProfileComplete:', typeof result.isProfileComplete);
      
      if (result.success && result.isProfileComplete) {
        console.log('BOTH CONDITIONS MET - Profile completed successfully, redirecting...');
        // Get user role to determine redirect path
        const userRole = localStorage.getItem('userRole');
        console.log('User role:', userRole);
        
        // Set flag to prevent redirect loop
        sessionStorage.setItem('profileSetupCompleted', 'true');
        console.log('Set sessionStorage flag');
        
        // Small delay to ensure database update completes
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (userRole === 'venue') {
          console.log('Redirecting to /venue/home');
          history.push('/venue/home');
        } else {
          console.log('Redirecting to /party-feed');
          history.push('/party-feed');
        }
      } else {
        console.log('CONDITION FAILED:');
        console.log('  result.success =', result.success);
        console.log('  result.isProfileComplete =', result.isProfileComplete);
        console.log('=== PROFILE SETUP SUBMIT END (FAILED) ===');
        setError('Profile setup incomplete. Please try again.');
      }
    } catch (error) {
      console.error('=== PROFILE SETUP ERROR ===');
      console.error('Setup submission error:', error);
      setError('Failed to complete setup: ' + error.message);
    }
  };

  const handleLocationInput = async (e) => {
    const input = e.target.value;
    setLocation(input);
    
    if (input.length > 2) {
      const mockSuggestions = [
        `${input} City`,
        `${input} District`,
        `${input} Town`
      ];
      setLocationSuggestions(mockSuggestions);
    } else {
      setLocationSuggestions([]);
    }
  };

  return (
    <div className="profile-setup-container">
      {step === 'username' ? (
        <div className="setup-step username-step">
          <h2>Set Up Your Profile</h2>
          
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              disabled
              className="disabled-input"
            />
          </div>

          <div className="input-group">
            <label>Choose your username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          <div className="visibility-toggle">
            <label>
              <input
                type="checkbox"
                checked={showUsername}
                onChange={(e) => setShowUsername(e.target.checked)}
              />
              Show username to other users
            </label>
          </div>
          
          <div className="input-group">
            <label>Location (optional)</label>
            <input
              type="text"
              value={location}
              onChange={handleLocationInput}
              placeholder="Enter your location"
            />
            {locationSuggestions.length > 0 && (
              <div className="location-suggestions">
                {locationSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => {
                      setLocation(suggestion);
                      setLocationSuggestions([]);
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="next-button"
            onClick={handleUsernameSubmit}
            disabled={!username.trim()}
          >
            Next
          </button>
        </div>
      ) : (
        <div className="setup-step photo-step">
          <h2>Add Profile Picture</h2>
          
          {!isCameraActive && !profilePic && (
            <div className="photo-options">
              <button onClick={() => setIsCameraActive(true)}>
                Take Photo
              </button>
              <span>or</span>
              <button onClick={() => fileInputRef.current.click()}>
                Upload Photo
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
          )}

          {isCameraActive && !profilePic && (
            <div className="camera-container">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: "user"
                }}
              />
              <button onClick={handlePhotoCapture}>Capture Photo</button>
              <button onClick={() => setIsCameraActive(false)}>Cancel</button>
            </div>
          )}

          {profilePic && (
            <div className="preview-container">
              <img src={profilePic} alt="Profile Preview" />
              <div className="preview-actions">
                <button onClick={() => setProfilePic(null)}>Retake</button>
                <button onClick={handleSubmit}>Complete Setup</button>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ProfileSetup;
