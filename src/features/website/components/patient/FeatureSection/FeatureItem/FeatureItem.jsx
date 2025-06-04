// src/components/home/FeaturesSection/FeatureItem/FeatureItem.jsx
import React from 'react';
import styles from '../FeatureItem/FeatureItem.module.css'; // Adjust the path as necessary

function FeatureItem({ icon, title, description }) {
  return (
    <div className={styles.featureItem}>
      <div className={styles.featureIcon}>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default FeatureItem;