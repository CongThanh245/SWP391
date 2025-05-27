import React from 'react';
import styles from './PlaceholderContent.module.css';

const PlaceholderContent = ({ icon: Icon, title, description }) => {
  return (
    <div className={styles.placeholder}>
      <Icon size={48} className={styles.icon} />
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default PlaceholderContent;