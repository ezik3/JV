import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to Our App</h1>
      <nav>
        <ul>
          <li><Link to="/venue-signup">Venue Signup</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;