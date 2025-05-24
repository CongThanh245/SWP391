import DNAPic from '@assets/images/DNA3DPic.svg';
import styles from './HeroSection.module.css'; 
import Button from '@components/common/Button/Button.jsx';


function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <h1>FERTICARE</h1>
          <p>Phần mềm quản lý và theo dõi quá trình điều trị hiếm muộn</p>
          <p className={styles.heroDescription}>
            Chúng tôi cung cấp giải pháp toàn diện để theo dõi quá trình điều trị
            hiếm muộn, bao gồm quản lý lịch trình, theo dõi tiến độ, và liên lạc
            với đội ngũ y tế. Điều này giúp bạn an tâm hơn trong hành trình đón
            chờ thiên thần nhỏ của mình.
          </p>
          <div className={styles.heroButtons}>
            <Button variant="primary">Đăng ký dịch vụ</Button>
            <Button variant="secondary">Tìm hiểu thêm</Button>
          </div>
        </div>
        <img
          className={styles.heroImage}
          src={DNAPic}
          alt="DNA"
        />  
      </div>
    </section>
  );
}

export default HeroSection;