import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Webcam from 'react-webcam';
import api from '../api';
import './ProfileSetup.css';

const ProfileSetup = (props) => {
  useEffect(() => {
    console.log('ProfileSetup mounted with props:', props);
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
      console.log('Stored userId:', storedUserId);
      
      if (!storedUserId) {
        setError('User ID not found. Please try logging in again.');
        return;
      }

      try {
        await api.post('/api/profile/update-username', {
          userId: storedUserId,
          username,
          showUsername
        });
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
      const token = localStorage.getItem('token');

      const response = await fetch('/api/profile/update-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          profilePic: photoData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Photo upload response:', data);
      return data;

    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw new Error('Failed to upload profile picture: ' + error.message);
    }
  };
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setError('');
        await handlePhotoUpload(profilePic);
        await handleProfileComplete();
      } catch (error) {
        console.error('Setup submission error:', error);
        setError('Failed to complete setup: ' + error.message);
      }
    };

    const handleProfileComplete = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('profilePic', profilePic);

        const response = await api.post('/api/profile/update-photo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data && response.data.success) {
          localStorage.setItem('userProfilePic', response.data.profilePicture);
          history.push('/home');
        }
      } catch (error) {
        setError('Failed to complete setup: ' + (error.message || 'Unknown error'));
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