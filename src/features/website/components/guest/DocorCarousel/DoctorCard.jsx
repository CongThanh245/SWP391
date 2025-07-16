import React from "react";
import styles from "./DoctorCard.module.css";
import { Link } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  const { name, specialization, imageProfile, yearsOfExperience, active } =
    doctor;

  // Lấy chữ cái đầu của từ cuối trong tên
  const getInitials = (name) => {
    if (!name) return "N";
    const lastWord = name.split(" ").pop();
    return lastWord.charAt(0).toUpperCase(); // Chỉ lấy chữ cái đầu của từ cuối
  };

  return (
    <div className={styles.card}>
      <div className={styles.avatarWrapper}>
        {imageProfile && imageProfile !== "/assets/images/bacsi.png" ? (
          <img src={imageProfile} alt={name} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>{getInitials(name)}</div>
        )}
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>BS. {name}</h3>
        <p className={styles.specialty}>{specialization}</p>
        <p className={styles.experience}>
          Kinh nghiệm: {yearsOfExperience} năm
        </p>
        <Link to="/our-doctors">
          <button className={styles.button}>Tìm hiểu thêm</button>{" "}
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
