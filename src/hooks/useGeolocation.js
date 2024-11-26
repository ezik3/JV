import { useState, useEffect } from 'react';

const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    const handleSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
    };

    const handleError = (error) => {
      setError(error.message);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);

    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);

    return () => navigator.geolocation.clearWatch(watchId);
  }, [options]);

  return { location, error };
};

export default useGeolocation;