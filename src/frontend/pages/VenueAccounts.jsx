import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import api from '../api';
import './VenueAccounts.css';
import PurchaseJVCoin from '../components/PurchaseJVCoin';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const VenueAccounts = () => {
  const [venueData, setVenueData] = useState({
    visitorCount: 0,
    currentOccupancy: 0,
    revenue: 0,
    pushNotificationCredits: 0,
    jvCoinBalance: 0,
    newVisitors: 0,
    returningVisitors: 0,
    revenueByDay: [],
  });
  
  const [timeRange, setTimeRange] = useState('week');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchVenueData();
    fetchUserData();
  }, [timeRange]);

  const fetchVenueData = async () => {
    try {
      const response = await api.get(`/api/venue/stats?timeRange=${timeRange}`);
      setVenueData(response.data);
    } catch (error) {
      console.error('Error fetching venue data:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const userResponse = await api.get('/api/user/current');
      setUserId(userResponse.data._id);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const updateJVCoinBalance = (newBalance) => {
    setVenueData(prevData => ({
      ...prevData,
      jvCoinBalance: newBalance
    }));
  };

  const visitorData = {
    labels: ['New Visitors', 'Returning Visitors'],
    datasets: [
      {
        data: [venueData.newVisitors || 0, venueData.returningVisitors || 0],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  const revenueData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue',
        data: venueData.revenueByDay || [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="venue-accounts">
      <h1>Venue Dashboard</h1>
      
      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total Visitors</h3>
          <p>{venueData.visitorCount}</p>
        </div>
        <div className="stat-card">
          <h3>Current Occupancy</h3>
          <p>{venueData.currentOccupancy}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>${venueData.revenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Push Notification Credits</h3>
          <p>{venueData.pushNotificationCredits}</p>
        </div>
        <div className="stat-card">
          <h3>JV Coin Balance</h3>
          <p>{venueData.jvCoinBalance}</p>
        </div>
      </div>

      <div className="time-range-selector">
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="charts">
        {venueData.newVisitors !== undefined && venueData.returningVisitors !== undefined && (
          <div className="chart">
            <h3>Visitor Breakdown</h3>
            <Pie data={visitorData} />
          </div>
        )}
        {venueData.revenueByDay && venueData.revenueByDay.length > 0 && (
          <div className="chart">
            <h3>Revenue Over Time</h3>
            <Line data={revenueData} />
          </div>
        )}
      </div>

      <div className="actions">
        <button onClick={() => alert('Purchase credits functionality to be implemented')}>
          Purchase Push Notification Credits
        </button>
      </div>

      <div className="jv-coin-purchase">
  <h2>JV Coin Management</h2>
  <p>Current Balance: {venueData.jvCoinBalance} JV Coins</p>
  {userId ? (
    <PurchaseJVCoin 
      userId={userId} 
      onPurchase={updateJVCoinBalance} 
    />
  ) : (
    <p>Loading user data...</p>
  )}
</div>
    </div>
  );
};

export default VenueAccounts;