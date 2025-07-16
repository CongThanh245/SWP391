import styles from './JourneySection.module.css';
import journeyPic from '../../../../../assets/images/bac-si-tu-van.jpg';
import journeyPic2 from '../../../../../assets/images/bac-si-tu-van-2.jpeg';
import journeyPic3 from '../../../../../assets/images/bac-si-tu-van-3.jpg';

// Sample placeholder images
const placeholderImages = {
  appointment: journeyPic,
  consultation: journeyPic2,
  treatmentTracking: journeyPic3
};

const journeyStages = [
  {
    id: 'appointment',
    title: 'Đặt lịch khám',
    description: 'Đặt lịch khám, theo dõi lịch hẹn cùng với bác sĩ bạn chọn',
    image: placeholderImages.appointment
  },
  {
    id: 'consultation',
    title: 'Hỗ trợ tư vấn',
    description: 'Tư vấn sức khỏe sinh sản, lựa chọn phương pháp điều trị phù hợp',
    image: placeholderImages.consultation
  },
  {
    id: 'treatment-tracking',
    title: 'Theo dõi kết quả',
    description: 'Theo dõi kết quả xét nghiệm theo từng giai đoạn điều trị.',
    image: placeholderImages.treatmentTracking
  }
];

function JourneyCard({ stage }) {
  return (
    <div className={styles.journeyCard}>
      <div className={styles.journeyCardImageContainer}>
        <img 
          src={stage.image} 
          alt={stage.title} 
          className={styles.journeyCardImage}
        />
      </div>
      <div className={styles.journeyCardContent}>
        <h3 className={styles.journeyCardTitle}>{stage.title}</h3>
        <p className={styles.journeyCardDescription}>{stage.description}</p>
      </div>
    </div>
  );
}

export default function JourneySection() {
  return (
    <section className={styles.journeySection}>
      <div className={styles.journeyContainer}>
        <div className={styles.journeyWrapper}>
          {/* Left side - Text content */}
          <div className={styles.journeyText}>
            <div className={styles.journeyHeader}>
              <h2 className={styles.journeyTitle}>
                Chúng tôi đồng hành cùng bạn trong cả <span className={styles.journeyHighlight}>hành trình</span>
              </h2>
              <p className={styles.journeySubtitle}>
                Hành trình tìm con – Bạn không đơn độc.
              </p>
            </div>
          </div>
          
          {/* Right side - Cards */}
          <div className={styles.journeyCards}>
            {journeyStages.map((stage) => (
              <JourneyCard key={stage.id} stage={stage} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}