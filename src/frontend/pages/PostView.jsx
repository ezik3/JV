import React, { useState } from 'react';
import './PostView.css';

const PostView = ({ posts, initialPostIndex, onClose }) => {
  const [currentPostIndex, setCurrentPostIndex] = useState(initialPostIndex);

  const currentPost = posts[currentPostIndex];
  const prevPost = posts[(currentPostIndex - 1 + posts.length) % posts.length];
  const nextPost = posts[(currentPostIndex + 1) % posts.length];

  const handlePrevPost = () => {
    setCurrentPostIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
  };

  const handleNextPost = () => {
    setCurrentPostIndex((prevIndex) => (prevIndex + 1) % posts.length);
  };

  return (
    <div className="post-view">
      <div className="post-view-background" style={{backgroundImage: `url(${currentPost.cityImage})`}}></div>
      <div className="post-view-content">
        <button className="post-view-close" onClick={onClose}>×</button>
        <div className="post-view-header">
          <img src={currentPost.userImage} alt={currentPost.userName} className="post-view-user-image" />
          <div className="post-view-user-info">
            <h2>{currentPost.userName}</h2>
            {currentPost.venue && <p className="post-view-venue">@ {currentPost.venue} with {currentPost.otherUsers} others</p>}
            <p className="post-view-time">{currentPost.timeAgo}</p>
          </div>
        </div>
        <div className="post-view-image-container">
          <img src={prevPost.postImage} alt="Previous post" className="post-view-side-image left" onClick={handlePrevPost} />
          <div className="post-view-main-image-wrapper">
            <img src={currentPost.postImage} alt={currentPost.caption} className="post-view-main-image" />
            <p className="post-view-caption">{currentPost.caption}</p>
            <div className="post-view-actions">
              <button className="post-view-action-button pound">🤜🤛 {currentPost.pounds}</button>
              <button className="post-view-action-button comment">💬 {currentPost.comments}</button>
            </div>
          </div>
          <img src={nextPost.postImage} alt="Next post" className="post-view-side-image right" onClick={handleNextPost} />
        </div>
      </div>
    </div>
  );
};

export default PostView;