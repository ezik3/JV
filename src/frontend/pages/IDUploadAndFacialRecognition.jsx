import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';

const IDUploadAndFacialRecognition = ({ onComplete }) => {
  const [idImage, setIdImage] = useState(null);
  const [facialImage, setFacialImage] = useState(null);
  const webcamRef = useRef(null);

  const handleIDUpload = (event) => {
    const file = event.target.files[0];
    setIdImage(URL.createObjectURL(file));
  };

  const captureFacialImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setFacialImage(imageSrc);
  };

  const handleSubmit = () => {
    // Here you would typically send both images to your backend for verification
    // For now, we'll just simulate a successful verification
    onComplete({ idVerified: true });
  };

  return (
    <div>
      <h2>ID Upload and Facial Recognition</h2>
      <input type="file" accept="image/*" onChange={handleIDUpload} />
      {idImage && <img src={idImage} alt="ID" />}
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <button onClick={captureFacialImage}>Capture Face</button>
      {facialImage && <img src={facialImage} alt="Facial Recognition" />}
      <button onClick={handleSubmit}>Submit for Verification</button>
    </div>
  );
};

export default IDUploadAndFacialRecognition;