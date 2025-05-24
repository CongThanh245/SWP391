import React from 'react';
import styles from './DoctorCard.module.css';

const DoctorCard = ({ doctor }) => {
  const { name, title, specialty, price, level, rating, visits, image } = doctor;

  return (
    <div className={styles.card}>
      <div className={styles.avatarWrapper}>
        <img src={image} alt={name} className={styles.avatar} />
      </div>
      <div className={styles.info}>
        <div className={styles.rating}>
          Đánh giá: {rating} <span className="star">★</span>
        </div>
        <div className={styles.visits}>
          Lượt khám: {visits}
        </div>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.level}>
          {title || level}
        </p>
        <p className={styles.specialty}>{specialty}</p>
        <p className={styles.price}>{price}</p>
        <button className={styles.button}>Tư vấn ngay</button>
      </div>
    </div>
  );
};

export default DoctorCard;