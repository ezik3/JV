import React from 'react';
import { Link } from 'react-router-dom';
import './SignupPage.css';

export const SignupPage = () => {
  return (
    <div className="signup-page">
      <div className="cyber-grid"></div>
      <div className="floating-orbs"></div>
      
      <header className="header">
        <div className="logo">
          <span className="logo-text">Joint Vibe</span>
          <div className="logo-glow"></div>
        </div>
        <nav className="nav-buttons">
          <a href="#" className="nav-button login-button">
            <span className="button-text">Login</span>
            <div className="button-glow"></div>
          </a>
          <Link to="/registration-choice" className="nav-button signup-button">
            <span className="button-text">Sign Up</span>
            <div className="button-glow"></div>
          </Link>
        </nav>
      </header>
      
      <main className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="glitch" data-text="Joint Vibe">Joint Vibe</span>
          </h1>
          <p className="hero-description">
            Step into the future of social connection. Experience venues in a dimension where reality meets the metaverse.
          </p>
          <div className="cta-buttons">
            <Link to="/registration-choice" className="cta-button cta-primary">
              <span className="button-text">Launch Experience</span>
              <div className="button-glow"></div>
            </Link>
            <a href="#features" className="cta-button cta-secondary">
              <span className="button-text">Explore Features</span>
              <div className="button-glow"></div>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;