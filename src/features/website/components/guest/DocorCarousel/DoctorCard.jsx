import React from 'react';
import styles from './DoctorCard.module.css';

const DoctorCard = ({ doctor }) => {
  const { name, specialization, image, yearsOfExperience, phone } = doctor;

  return (
    <div className={styles.card}>
      <div className={styles.avatarWrapper}>
        <img
          src={image || '/assets/images/bacsi.png'}
          alt={name}
          className={styles.avatar}
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.specialty}>{specialization}</p>
        <p className={styles.experience}>
          Kinh nghiệm: {yearsOfExperience} năm
        </p>
        <p className={styles.phone}>
          SĐT: {phone}
        </p>
        <button className={styles.button}>Tư vấn ngay</button>
      </div>
    </div>
  );
};

export default DoctorCard;