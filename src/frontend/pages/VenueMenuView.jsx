// src/frontend/pages/VenueMenuView.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AIWaiter from '../components/AIWaiter';

const VenueMenuView = () => {
  const { venueId } = useParams();
  const [menu, setMenu] = useState({ food: [], drinks: [] });
  const [venueInfo, setVenueInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVenueMenu();
    fetchVenueInfo();
  }, [venueId]);

  const fetchVenueMenu = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/menu/${venueId}`);
      const menuItems = response.data;
      setMenu({
        food: menuItems.filter(item => item.category === 'Food'),
        drinks: menuItems.filter(item => item.category === 'Drinks')
      });
      setLoading(false);
    } catch (error) {
      setError('Failed to load menu');
      setLoading(false);
    }
  };

  const fetchVenueInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/venues/${venueId}`);
      setVenueInfo(response.data);
    } catch (error) {
      setError('Failed to load venue information');
    }
  };

  if (loading) return <div>Loading menu...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="venue-menu-view">
      {venueInfo && (
        <div className="venue-header">
          <h1>{venueInfo.name}</h1>
          <p>{venueInfo.description}</p>
        </div>
      )}

      <div className="menu-sections">
        {menu.food.length > 0 && (
          <section className="menu-section">
            <h2>Food</h2>
            <div className="menu-items">
              {menu.food.map(item => (
                <div key={item._id} className="menu-item">
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <span className="price">${item.price}</span>
                  </div>
                  {item.isAvailable && (
                    <button 
                      className="order-btn"
                      onClick={() => handleOrder(item)}
                    >
                      Order
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {menu.drinks.length > 0 && (
          <section className="menu-section">
            <h2>Drinks</h2>
            <div className="menu-items">
              {menu.drinks.map(item => (
                <div key={item._id} className="menu-item">
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <span className="price">${item.price}</span>
                  </div>
                  {item.isAvailable && (
                    <button 
                      className="order-btn"
                      onClick={() => handleOrder(item)}
                    >
                      Order
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <AIWaiter venueId={venueId} />
    </div>
  );
};

export default VenueMenuView;