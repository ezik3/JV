import React, { useState } from 'react';
import '../styles/VenueSettings.css';

const VenueSettings = () => {
  const [venueInfo, setVenueInfo] = useState({
    name: 'The Purple Lounge',
    address: '123 Main Street, Sydney, NSW 2000',
    email: 'contact@purplelounge.com',
    phone: '+61 2 9876 5432'
  });

  const [paymentSettings, setPaymentSettings] = useState({
    currency: 'AUD',
    cryptoEnabled: true,
    apiKey: '••••••••••••••••'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    lowStock: true
  });

  const [appearance, setAppearance] = useState({
    darkMode: true,
    themeColor: '#6200EA'
  });

  const sidebarLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/pos", label: "POS" },
    { path: "/sales", label: "Sales" },
    { path: "/menu-management", label: "Menu Management" },
    { path: "/inventory", label: "Inventory" },
    { path: "/orders", label: "Orders" },
    { path: "/staff", label: "Staff" },
    { path: "/customers", label: "Customers" },
    { path: "/analytics", label: "Analytics" },
    { path: "/marketing", label: "Marketing" },
    { path: "/reports", label: "Reports" },
    { path: "/settings", label: "Settings" }
  ];

  const colorOptions = [
    { color: '#6200EA', isActive: true },
    { color: '#00BCD4', isActive: false },
    { color: '#F50057', isActive: false },
    { color: '#FF6D00', isActive: false }
  ];

  const handleColorChange = (selectedColor) => {
    setAppearance(prev => ({
      ...prev,
      themeColor: selectedColor
    }));
  };

  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
    // Implement your save logic here
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      // Implement your reset logic here
      alert('Settings reset to default!');
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">JointVibe POS</div>
        <nav className="nav-menu">
          {sidebarLinks.map((link) => (
            <li key={link.path} className="nav-item">
              <a 
                href={link.path} 
                className={`nav-link ${window.location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <div className="settings-header">
          <h1>Settings</h1>
        </div>

        <div className="settings-grid">
          {/* Venue Information Card */}
          <div className="settings-card">
            <h3>Venue Information</h3>
            <div className="form-group">
              <label>Venue Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={venueInfo.name}
                onChange={(e) => setVenueInfo({...venueInfo, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input 
                type="text" 
                className="form-input" 
                value={venueInfo.address}
                onChange={(e) => setVenueInfo({...venueInfo, address: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Contact Email</label>
              <input 
                type="email" 
                className="form-input" 
                value={venueInfo.email}
                onChange={(e) => setVenueInfo({...venueInfo, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                className="form-input" 
                value={venueInfo.phone}
                onChange={(e) => setVenueInfo({...venueInfo, phone: e.target.value})}
              />
            </div>
          </div>

          {/* Payment Settings Card */}
          <div className="settings-card">
            <h3>Payment Settings</h3>
            <div className="form-group">
              <label>Default Currency</label>
              <select 
                className="form-input"
                value={paymentSettings.currency}
                onChange={(e) => setPaymentSettings({...paymentSettings, currency: e.target.value})}
              >
                <option value="AUD">Australian Dollar (AUD)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Accept Crypto Payments</label>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={paymentSettings.cryptoEnabled}
                  onChange={(e) => setPaymentSettings({...paymentSettings, cryptoEnabled: e.target.checked})}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="form-group">
              <label>Payment Gateway API Key</label>
              <input 
                type="password" 
                className="form-input" 
                value={paymentSettings.apiKey}
                onChange={(e) => setPaymentSettings({...paymentSettings, apiKey: e.target.value})}
              />
            </div>
          </div>

          {/* Notification Preferences Card */}
          <div className="settings-card">
            <h3>Notification Preferences</h3>
            <div className="form-group">
              <label>Email Notifications</label>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={notifications.email}
                  onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="form-group">
              <label>Push Notifications</label>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={notifications.push}
                  onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="form-group">
              <label>Low Stock Alerts</label>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={notifications.lowStock}
                  onChange={(e) => setNotifications({...notifications, lowStock: e.target.checked})}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          {/* Appearance Card */}
          <div className="settings-card">
            <h3>Appearance</h3>
            <div className="form-group">
              <label>Theme Color</label>
              <div className="color-picker">
                {colorOptions.map((option, index) => (
                  <div
                    key={index}
                    className={`color-option ${option.color === appearance.themeColor ? 'active' : ''}`}
                    style={{ background: option.color }}
                    onClick={() => handleColorChange(option.color)}
                  />
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Dark Mode</label>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={appearance.darkMode}
                  onChange={(e) => setAppearance({...appearance, darkMode: e.target.checked})}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button className="button button-primary" onClick={handleSaveSettings}>
            Save Changes
          </button>
          <button className="button button-secondary" onClick={handleResetSettings}>
            Reset to Default
          </button>
        </div>
      </main>
    </div>
  );
};

export default VenueSettings;