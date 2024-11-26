// src/frontend/pages/POSMain.jsx
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import VenueOwnerHome from './VenueOwnerHome';
import VenueOrders from './VenueOrders';
import POSInterface from '../components/POSInterface';
import VenueHomeFeed from './VenueHomeFeed';
import VenueMenu from './VenueMenu';
import './POSMain.css';

const POSMain = () => {
  return (
    <div className="pos-main">
      <nav className="pos-nav">
        <Link to="/pos" className="pos-logo">VibeVenue POS</Link>
        <div className="pos-nav-links">
          <Link to="/pos" className="pos-nav-link">Dashboard</Link>
          <Link to="/pos/orders" className="pos-nav-link">Orders</Link>
          <Link to="/pos/interface" className="pos-nav-link">POS</Link>
          <Link to="/pos/menu" className="pos-nav-link">Menu</Link>
          <Link to="/pos/home-feed" className="pos-nav-link">Feed</Link>
        </div>
      </nav>

      <div className="pos-content">
        <Switch>
          <Route exact path="/pos" component={VenueOwnerHome} />
          <Route path="/pos/orders" component={VenueOrders} />
          <Route path="/pos/interface" component={POSInterface} />
          <Route path="/pos/menu" component={VenueMenu} />
          <Route path="/pos/home-feed" component={VenueHomeFeed} />
        </Switch>
      </div>
    </div>
  );
};

export default POSMain;