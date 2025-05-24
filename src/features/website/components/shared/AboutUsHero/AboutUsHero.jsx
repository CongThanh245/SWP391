// components/Hero/Hero.jsx
import styles from './AboutUsHero.module.css';
import FamilyPicture from '../../../../../assets/images/family-pic.gif'; // Adjust the path as necessary

const Hero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>Phòng khám đa khoa An Khang</h1>
        <p className={styles.subtitle}>
          Chăm sóc sức khỏe toàn diện với đội ngũ bác sĩ giàu kinh nghiệm 
          và trang thiết bị hiện đại
        </p>
        <div className={styles.buttonGroup}>
        </div>
      </div>
      <div className={styles.heroImage}>
        <div className={styles.imageCollage}>
          <img 
            src={FamilyPicture}
            alt="Gia đình hạnh phúc - Phòng khám An Khang" 
            className={styles.mainImage}
          />
          <div className={styles.decorativeElements}>
            <div className={styles.leafDecoration}></div>
            <div className={styles.photoFrame}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;