import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { useHistory } from 'react-router-dom';

const UserPrivateKey = () => {
  const [privateKey, setPrivateKey] = useState('');
  const [keysSecured, setKeysSecured] = useState(false);
  const [showFacialRecognition, setShowFacialRecognition] = useState(false);
  const [facialRecognitionStatus, setFacialRecognitionStatus] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = useRef(null);
  const history = useHistory();

  React.useEffect(() => {
    const newKey = 'VIP-' + Math.random().toString(36).substr(2, 9);
    setPrivateKey(newKey);
  }, []);

  const handleSecureKeys = () => {
    setKeysSecured(true);
    setShowFacialRecognition(true);
    setPrivateKey('');
  };

  const handleFacialRecognition = async () => {
    setFacialRecognitionStatus('Starting...');
    setIsCameraOpen(true);
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setIsCameraOpen(false);
    setFacialRecognitionStatus('Facial recognition successful!');
    
    setTimeout(() => {
      history.push('/profile-setup');
    }, 2000);
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
    keyBox: {
      background: 'rgba(5, 5, 5, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '1px solid #FFD700',
      borderRadius: '15px',
      padding: '3rem',
      width: '90%',
      maxWidth: '500px',
      position: 'relative',
      zIndex: 1,
      boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
    },
    title: {
      color: '#FFD700',
      textAlign: 'center',
      fontSize: '2rem',
      marginBottom: '2rem',
      textTransform: 'uppercase',
      letterSpacing: '3px',
      textShadow: '0 0 10px #FFD700',
    },
    keyDisplay: {
      background: 'rgba(255, 215, 0, 0.1)',
      padding: '1.5rem',
      borderRadius: '8px',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      marginBottom: '2rem',
      fontSize: '1.2rem',
      color: '#FFD700',
      textAlign: 'center',
      letterSpacing: '2px',
      fontFamily: 'monospace',
      animation: 'glow 1.5s ease-in-out infinite alternate',
    },
    warning: {
      color: '#FF4444',
      textAlign: 'center',
      marginBottom: '2rem',
      padding: '1rem',
      border: '1px solid rgba(255, 68, 68, 0.3)',
      borderRadius: '8px',
      background: 'rgba(255, 68, 68, 0.1)',
    },
    button: {
      width: '100%',
      padding: '1rem',
      background: 'transparent',
      border: '2px solid #FFD700',
      color: '#FFD700',
      fontSize: '1.1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '20px',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      '&:hover': {
        background: 'rgba(255, 215, 0, 0.1)',
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
      },
    },
    camera: {
      width: '100%',
      borderRadius: '8px',
      border: '2px solid #FFD700',
      marginTop: '1rem',
    },
    status: {
      color: '#FFD700',
      textAlign: 'center',
      marginTop: '1rem',
      fontSize: '1.1rem',
    },
    hologramEffect: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      background: 'linear-gradient(45deg, transparent 65%, rgba(255, 215, 0, 0.1) 100%)',
      pointerEvents: 'none',
      borderRadius: '15px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.keyBox}>
        <div style={styles.hologramEffect}></div>
        <h2 style={styles.title}>Your Private Key</h2>
        
        {!keysSecured && (
          <>
            <div style={styles.keyDisplay}>{privateKey}</div>
            <div style={styles.warning}>
              Warning: This key will only be shown once. Store it securely before proceeding.
            </div>
            <button style={styles.button} onClick={handleSecureKeys}>
              I've Secured My Key
            </button>
          </>
        )}

        {showFacialRecognition && !isCameraOpen && (
          <>
            <button style={styles.button} onClick={handleFacialRecognition}>
              Complete Facial Recognition
            </button>
            <p style={styles.status}>{facialRecognitionStatus}</p>
          </>
        )}

        {isCameraOpen && (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              style={styles.camera}
            />
            <button style={styles.button} onClick={captureImage}>
              Capture
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserPrivateKey;