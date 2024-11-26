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
    <div className="app-container">
      <h1 className="page-title">Notifications</h1>
      <div className="notification-list">
        {notificationsData.map((notification, index) => (
          <NotificationItem key={index} notification={notification} />
        ))}
      </div>
      <button className="load-more">Load More</button>
    </div>
  );
};

export default Notifications;
