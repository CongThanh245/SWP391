import React, { useState, useEffect } from "react";
import styles from "./TestimonialSection.module.css";
import avatar1 from "../../../../../assets/images/avatar1.jpg";
import avatar2 from "@assets/images/avatar2.jpg";
import avatar3 from "@assets/images/avatar3.jpg";

const TestimonialSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Thị Minh",
      avatar: avatar1,
      role: "Bệnh nhân",
      quote:
        "Tôi rất hài lòng với dịch vụ khám chữa bệnh tại đây. Bác sĩ tư vấn tận tình, nhân viên y tế nhiệt tình và chu đáo. Cơ sở vật chất hiện đại, sạch sẽ tạo cảm giác thoải mái cho bệnh nhân.",
      rating: 5,
    },
    {
      id: 2,
      name: "Trần Văn Hùng",
      avatar: avatar2,
      role: "Bệnh nhân",
      quote:
        "Đội ngũ y bác sĩ chuyên nghiệp, trang thiết bị hiện đại. Tôi đặc biệt ấn tượng với cách bác sĩ giải thích rõ ràng về tình trạng bệnh và phương pháp điều trị.",
      rating: 5,
    },
    {
      id: 3,
      name: "Lê Hoàng Mai",
      avatar: avatar3,
      role: "Bệnh nhân",
      quote:
        "Quá trình đặt lịch khám online dễ dàng và tiện lợi. Không phải chờ đợi lâu khi đến khám. Bác sĩ khám rất tỉ mỉ và tận tâm, giải đáp mọi thắc mắc của tôi.",
      rating: 4,
    },
    {
      id: 4,
      name: "Phạm Thanh Tùng",
      avatar: avatar2,
      role: "Bệnh nhân",
      quote:
        "Tôi đã điều trị dài hạn tại đây và rất hài lòng với kết quả. Đội ngũ y tế theo dõi sức khỏe rất chu đáo và liên tục cập nhật tình hình điều trị.",
      rating: 5,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-scroll testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Render star ratings
  const renderRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`${styles.star} ${i <= rating ? styles.filled : ""}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className={styles.testimonialSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Nhận Xét Từ Bệnh Nhân</h2>
          <p className={styles.sectionSubtitle}>
            Khám phá trải nghiệm và đánh giá của bệnh nhân về dịch vụ y tế của
            chúng tôi
          </p>
        </div>

        <div className={styles.testimonialCarousel}>
          <div
            className={styles.testimonialSlider}
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className={styles.testimonialCard}>
                <div className={styles.quoteIconContainer}>
                  <svg
                    className={styles.quoteIcon}
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M10 11H6.5C5.4 11 4.5 10.1 4.5 9V8C4.5 5.79 6.29 4 8.5 4H9C9.55 4 10 3.55 10 3C10 2.45 9.55 2 9 2H8.5C5.19 2 2.5 4.69 2.5 8V9C2.5 11.21 4.29 13 6.5 13H10C10.55 13 11 12.55 11 12C11 11.45 10.55 11 10 11ZM21.5 11H18C17.45 11 17 11.45 17 12C17 12.55 17.45 13 18 13H21.5C23.71 13 25.5 11.21 25.5 9V8C25.5 4.69 22.81 2 19.5 2H19C18.45 2 18 2.45 18 3C18 3.55 18.45 4 19 4H19.5C21.71 4 23.5 5.79 23.5 8V9C23.5 10.1 22.6 11 21.5 11Z"></path>
                  </svg>
                </div>
                <div className={styles.testimonialContent}>
                  <p className={styles.testimonialQuote}>{testimonial.quote}</p>
                  <div className={styles.testimonialRating}>
                    {renderRating(testimonial.rating)}
                  </div>
                </div>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>
                    <div
                      className={styles.avatarImage}
                      style={{ backgroundImage: `url(${testimonial.avatar})` }}
                    ></div>
                  </div>
                  <div className={styles.authorInfo}>
                    <h4 className={styles.authorName}>{testimonial.name}</h4>
                    <p className={styles.authorRole}>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.testimonialDots}>
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${
                activeIndex === index ? styles.activeDot : ""
              }`}
              onClick={() => handleDotClick(index)}
              aria-label={`Testimonial ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
