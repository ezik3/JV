// src/frontend/pages/POS/screens/Kitchen2.jsx
import React from 'react';
import './styles/kitchen-grid.css';

const KitchenGridView = ({ onToggleView }) => {
  const [stats, setStats] = React.useState({
    activeOrders: 12,
    avgTime: '14:23',
    completedToday: 164
  });
  const [filterMode, setFilterMode] = React.useState('all');

  const handleOrderAction = (orderId, action) => {
    const card = document.querySelector(`[data-order-id="${orderId}"]`);
    if (card) {
      card.style.opacity = '0';
      setTimeout(() => card.remove(), 300);
    }
  };

  return (
    <div className="kitchen-grid-container">
      <div className="kitchen-header">
        <div className="kitchen-stats">
          <div className="stat">
            <div className="stat-label">Active Orders</div>
            <div className="stat-value">{stats.activeOrders}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Avg. Time</div>
            <div className="stat-value">{stats.avgTime}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Completed Today</div>
            <div className="stat-value">{stats.completedToday}</div>
          </div>
        </div>
        <div className="filter-buttons">
          <button 
            className={`filter-button ${filterMode === 'all' ? 'active' : ''}`}
            onClick={() => setFilterMode('all')}
          >
            All Orders
          </button>
          <button 
            className={`filter-button ${filterMode === 'urgent' ? 'active' : ''}`}
            onClick={() => setFilterMode('urgent')}
          >
            Urgent
          </button>
          <button 
            className={`filter-button ${filterMode === 'vip' ? 'active' : ''}`}
            onClick={() => setFilterMode('vip')}
          >
            VIP
          </button>
        </div>
        <button onClick={onToggleView} className="view-toggle-btn">
          Switch to List View
        </button>
      </div>

      <div className="kitchen-grid">
        <div className="order-card new" data-order-id="1234">
          <div className="order-header">
            <span className="order-number">#1234</span>
            <span className="order-time urgent">15:42</span>
          </div>
          <div className="order-details">
            <div className="table-info">
              <span>Table 12</span>
              <span>Server: John</span>
            </div>
            <ul className="order-items">
              <li className="order-item">
                <span className="item-quantity">2</span>
                <div className="item-details">
                  <div className="item-name">Grilled Salmon</div>
                  <div className="item-mods">- No sauce<br/>- Extra crispy skin</div>
                  <div className="item-allergens">
                    <span className="allergen-tag">FISH</span>
                    <span className="allergen-tag">DAIRY</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="order-actions">
            <button 
              className="action-button complete"
              onClick={() => handleOrderAction('1234', 'complete')}
            >
              Mark Complete
            </button>
            <button 
              className="action-button bump"
              onClick={() => handleOrderAction('1234', 'bump')}
            >
              Bump Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenGridView;