import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Zp } from '../../mapClasses';

const VenueDetails = ({ setCurrentVenue }) => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);

  useEffect(() => {
    const fetchVenue = async () => {
      const apiHandler = new Zp();
      try {
        const response = await fetch(`/api/venues/${id}`, {
          headers: apiHandler.headers
        });
        const data = await response.json();
        setVenue(data);
        setCurrentVenue(data);
      } catch (error) {
        console.error('Error fetching venue details:', error);
      }
    };

    fetchVenue();
  }, [id, setCurrentVenue]);

  if (!venue) return <div>Loading...</div>;

  return (
    <div>
      <h2>{venue.name}</h2>
      <p>Address: {venue.address}</p>
      <p>Check-in radius: {venue.checkInRadius} meters</p>
      {/* Add more venue details as needed */}
    </div>
  );
};

export default VenueDetails;