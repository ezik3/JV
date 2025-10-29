import React from 'react';
import './Notifications.css';

const notificationsData = [
  {
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    name: 'Emma W.',
    action: 'liked your post "Last night was 🔥!"',
    time: '2 minutes ago',
    icon: 'heart',
    unread: true,
  },
  {
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    name: 'Mike B.',
    action: 'commented on your post: "Can\'t wait for the next event!"',
    time: '15 minutes ago',
    icon: 'comment',
    unread: true,
  },
  {
    avatar: 'https://randomuser.me/api/portraits/women/89.jpg',
    name: 'Soph L.',
    action: 'tagged you in a photo at ',
    venue: 'Club Neon',
    venueLink: '/venues/club-neon',
    time: '2 hours ago',
    icon: 'photo',
  },
  {
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    name: 'Dave K.',
    action: 'invited you to an event: ',
    venue: 'Summer Beats Festival',
    venueLink: '/events/summer-beats-festival',
    time: '1 day ago',
    icon: 'event',
  },
  {
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    name: 'Liv D.',
    action: 'started following you',
    time: '2 days ago',
    icon: 'follow',
  },
];

const NotificationItem = ({ notification }) => {
  const getIconPath = (icon) => {
    switch (icon) {
      case 'heart':
        return (
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        );
      case 'comment':
        return (
          <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
        );
      case 'photo':
        return (
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        );
      case 'event':
        return (
          <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
        );
      case 'follow':
        return (
          <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`notification ${notification.unread ? 'unread' : ''}`}>
      <img src={notification.avatar} alt={notification.name} className="notification-avatar" />
      <div className="notification-content">
        <p className="notification-text">
          <strong>{notification.name}</strong> {notification.action}
          {notification.venue && (
            <a href={notification.venueLink} className="venue-link">
              {notification.venue}
            </a>
          )}
        </p>
        <p className="notification-time">{notification.time}</p>
      </div>
      <div className="notification-icon">
        <svg viewBox="0 0 24 24">{getIconPath(notification.icon)}</svg>
      </div>
    </div>
  );
};

const Notifications = () => {
  return (
    <div>
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

      <div className="app-container">
        <h1 className="page-title">Notifications</h1>
        <div className="notification-list">
          {notificationsData.map((notification, index) => (
            <NotificationItem key={index} notification={notification} />
          ))}
        </div>
        <button className="load-more">Load More</button>
      </div>
    </div>
  );
};

export default Notifications;
