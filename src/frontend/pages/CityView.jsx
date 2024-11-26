import React, { useRef, useEffect, useState } from 'react';
import './CityView.css';
import PostView from '../pages/PostView';
import { Vp, Yp, Zp } from '../../mapClasses.js';

const CityView = () => {
  const [clickedProfile, setClickedProfile] = useState(null);
  const profilesContainerRef = useRef(null);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [loadingState, setLoadingState] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      // Parse the clicked profile from URL with error handling
      const params = new URLSearchParams(window.location.search);
      const profileParam = params.get('profile');
      
      if (profileParam) {
        try {
          const profile = JSON.parse(decodeURIComponent(profileParam));
          console.log('Parsed profile data:', profile); // Debug log
          if (!profile.id) {
            console.error('Invalid profile data: missing id');
            setHasError(true);
            return;
          }
          setClickedProfile(profile);
        } catch (error) {
          console.error('Error parsing profile data:', error);
          setHasError(true);
        }
      } else {
        console.log('No profile parameter found in URL');
        setHasError(true);
      }

      const profilesContainer = profilesContainerRef.current;
      if (!profilesContainer) return;

      let isDown = false;
      let startX;
      let scrollLeft;

      const mouseDown = (e) => {
        isDown = true;
        startX = e.pageX - profilesContainer.offsetLeft;
        scrollLeft = profilesContainer.scrollLeft;
      };

      const mouseLeave = () => {
        isDown = false;
      };

      const mouseUp = () => {
        isDown = false;
      };

      const mouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - profilesContainer.offsetLeft;
        const walk = (x - startX) * 2;
        profilesContainer.scrollLeft = scrollLeft - walk;
      };

      profilesContainer.addEventListener('mousedown', mouseDown);
      profilesContainer.addEventListener('mouseleave', mouseLeave);
      profilesContainer.addEventListener('mouseup', mouseUp);
      profilesContainer.addEventListener('mousemove', mouseMove);

      return () => {
        profilesContainer.removeEventListener('mousedown', mouseDown);
        profilesContainer.removeEventListener('mouseleave', mouseLeave);
        profilesContainer.removeEventListener('mouseup', mouseUp);
        profilesContainer.removeEventListener('mousemove', mouseMove);
      };
    } catch (error) {
      console.error('Error in useEffect:', error);
      setHasError(true);
    }
  }, []);

  useEffect(() => {
    const vp = new Vp();
    const yp = new Yp();
    const zp = new Zp();

    console.log('Unique ID:', yp.Kv);

    // Example of using Vp
    setLoadingState(vp.ai());

    // Example of using Zp
    const mockRequest = {
      setHeader: (name, value) => console.log(`Setting header: ${name} = ${value}`),
      getHeader: () => null
    };
    zp.intercept(mockRequest, (req) => console.log('Request intercepted'));

  }, []);

  const profiles = [
    { name: "Ally Wilks", age: 19, status: "Taken", connections: 451 },
    { name: "Milly Vanilly", age: 22, status: "Single", connections: 212 },
    { name: "Mary Meyers", age: 23, status: "Single", connections: 89 },
    { name: "Chris Baulik", age: 18, status: "Single", connections: 13 },
    { name: "Sam Smith", age: 25, status: "Single", connections: 178 },
    { name: "Emma Watson", age: 21, status: "Taken", connections: 322 },
    { name: "Tom Hardy", age: 28, status: "Single", connections: 156 },
    { name: "Lisa Jones", age: 24, status: "Single", connections: 201 },
    { name: "John Doe", age: 26, status: "Taken", connections: 135 },
    { name: "Sarah Connor", age: 20, status: "Single", connections: 98 },
    { name: "Mike Ross", age: 27, status: "Single", connections: 245 },
    { name: "Rachel Green", age: 25, status: "Taken", connections: 189 },
    { name: "David Smith", age: 29, status: "Single", connections: 167 },
    { name: "Emily Brown", age: 22, status: "Single", connections: 112 },
    { name: "Alex Turner", age: 26, status: "Taken", connections: 278 },
    { name: "Olivia Wilson", age: 23, status: "Single", connections: 145 },
  ];

  const handleProfileClick = (index) => {
    setSelectedPostIndex(index);
  };
// Early return if we have an error
  if (hasError) {
    return (
      <div className="error-container">
        <h2>Unable to load profile</h2>
        <p>Please try again later</p>
      </div>
    );
  }

  // Show loading state while we wait for profile data
  if (!clickedProfile) {
    return (
      <div className="loading-container">
        <h2>Loading profile...</h2>
      </div>
    );
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-content">
          <a href="/feed" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
            Feed
          </a>
          <a href="/top10" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
            </svg>
            Top 10
          </a>
          <a href="/venues" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
            </svg>
            Venues
          </a>
          <a href="/maps" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
            </svg>
            Maps
          </a>
          <a href="/messages" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
            Messages
          </a>
          <a href="/notifications" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
            Notifications
          </a>
          <a href="/profile" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
            Profile
          </a>
        </div>
      </nav>

      <div className="city-view">
        <h1 className="city-name">BRISBANE</h1>
        <nav className="city-nav">
          <a href="/bris" className="active">BRIS</a>
          <a href="/syd">SYD</a>
          <a href="/melb">MELB</a>
          <a href="/adel">ADEL</a>
          <a href="/hob">HOB</a>
          <a href="/per">PER</a>
        </nav>
      </div>
<div className="profiles" ref={profilesContainerRef}>
        {clickedProfile && (
          <div className="profile clicked-profile">
            <img src={clickedProfile.imgSrc} alt={`Profile ${clickedProfile.id}`} />
            <h3>{clickedProfile.name || clickedProfile.id}</h3>
            <p>{clickedProfile.age || '??'} years old • {clickedProfile.status || 'Unknown'}</p>
            <p>{clickedProfile.city || 'Brisbane'}</p>
            <p className="connections">{clickedProfile.connections || 0} connections</p>
            {clickedProfile.interests && (
              <div className="interests">
                {clickedProfile.interests.map((interest, i) => (
                  <span key={i} className="interest-tag">{interest}</span>
                ))}
              </div>
            )}
            <button className="add-btn">Connect</button>
          </div>
        )}
        {profiles.map((profile, index) => (
          <div className="profile" key={index} onClick={() => handleProfileClick(index)}>
            <img 
              src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? 'women' : 'men'}/${index + 1}.jpg`} 
              alt={`Profile of ${profile.name}`} 
            />
            <h3>{profile.name}</h3>
            <p>{profile.age}, {profile.status}</p>
            <p>Brisbane</p>
            <p className="connections">{profile.connections}</p>
            <button className="add-btn">Connect</button>
          </div>
        ))}
      </div>

      {selectedPostIndex !== null && (
        <PostView
          posts={profiles.map((profile, index) => ({
            ...profile,
            cityImage: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
            postImage: `https://randomuser.me/api/portraits/${index % 2 === 0 ? 'women' : 'men'}/${index + 1}.jpg`,
            caption: "It's Friday night & I'm gonna get my drank on!!! Where are my peoples?",
            pounds: Math.floor(Math.random() * 100),
            comments: Math.floor(Math.random() * 20),
            venue: 'Alumbra',
            otherUsers: '5',
            timeAgo: '11 minutes ago'
          }))}
          initialPostIndex={selectedPostIndex}
          onClose={() => setSelectedPostIndex(null)}
        />
      )}

      {loadingState && <div dangerouslySetInnerHTML={{ __html: loadingState }} />}
    </div>
  );
};

export default CityView;