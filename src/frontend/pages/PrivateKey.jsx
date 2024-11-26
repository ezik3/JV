import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';

const PrivateKey = () => {
  const [privateKey, setPrivateKey] = useState('');
  const [keysSecured, setKeysSecured] = useState(false);
  const [showFacialRecognition, setShowFacialRecognition] = useState(false);
  const [facialRecognitionStatus, setFacialRecognitionStatus] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = useRef(null);

  // Simulate generating a private key
  const generatePrivateKey = () => {
    const newKey = 'VIP-' + Math.random().toString(36).substr(2, 9);
    setPrivateKey(newKey);
  };

  // Call this when the component loads
  React.useEffect(() => {
    generatePrivateKey();
  }, []);

  const handleSecureKeys = () => {
    setKeysSecured(true);
    setShowFacialRecognition(true);
    setPrivateKey(''); // Hide the private key
    console.log('Keys secured, showing facial recognition option');
  };

  const handleFacialRecognition = async () => {
    console.log('Starting facial recognition...');
    setFacialRecognitionStatus('Starting...');
    setIsCameraOpen(true);
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log('Image captured:', imageSrc);
    setIsCameraOpen(false);
    // Here you would typically send the image to your backend
    // For now, we'll just simulate a successful recognition
    setFacialRecognitionStatus('Facial recognition successful!');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your VIP Private Key</h1>
      {!keysSecured && (
        <div>
          <p style={styles.key}>{privateKey}</p>
          <p style={styles.warning}>
            Warning: This key will only be shown once. Please secure it safely before proceeding.
          </p>
          <button style={styles.button} onClick={handleSecureKeys}>I've secured my key</button>
        </div>
      )}
      {showFacialRecognition && !isCameraOpen && (
        <div>
          <button style={styles.button} onClick={handleFacialRecognition}>Start Facial Recognition</button>
          <p>Status: {facialRecognitionStatus}</p>
        </div>
      )}
      {isCameraOpen && (
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={styles.camera}
          />
          <button style={styles.button} onClick={captureImage}>Capture</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    maxWidth: '500px',
    margin: '0 auto',
  },
  title: {
    color: '#333',
  },
  key: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: '20px',
  },
  warning: {
    color: 'red',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
  },
  camera: {
    width: '100%',
    marginBottom: '20px',
  },
};

export default PrivateKey;