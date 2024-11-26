import React from 'react';

const Post = ({ post }) => {
  return (
    <div className="post">
      <div className="post-header">
        <img src={post.authorAvatar} alt={post.authorName} className="post-avatar" />
        <div>
          <div className="post-user"><strong>{post.authorName}</strong></div>
          <div className="post-time">{post.timestamp} · {post.venue && <span className="post-venue">@{post.venue}</span>}</div>
        </div>
      </div>
      <div className="post-content">
        <p className="post-text">{post.content}</p>
        {post.image && <img src={post.image} alt="Post" className="post-image" />}
      </div>
      <div className="post-actions">
        <button className="action-button pounds-button">
          Pounds
        </button>
        {/* Add other action buttons here */}
      </div>
    </div>
  );
};

export default Post;