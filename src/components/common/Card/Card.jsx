// Card.jsx
import React from 'react';
import styles from './Card.module.css';
//  Card này bên trái là avatar bên trái, bên phải là nội dung chính của card
const Card = ({ 
  avatar, 
  avatarPlaceholder, 
  leftContent, 
  rightContent, 
  className = '',
  onClick 
}) => {
  return (
    <div 
      className={`${styles.card} ${className}`}
      onClick={onClick}
    >
      {/* Left Section - Avatar */}
      <div className={styles.leftSection}>
        {avatar ? (
          <img 
            src={avatar.src} 
            alt={avatar.alt}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {avatarPlaceholder}
          </div>
        )}
        {leftContent && (
          <div className={styles.leftContent}>
            {leftContent}
          </div>
        )}
      </div>

      {/* Right Section - Content */}
      <div className={styles.rightSection}>
        {rightContent}
      </div>
    </div>
  );
};

export default Card;