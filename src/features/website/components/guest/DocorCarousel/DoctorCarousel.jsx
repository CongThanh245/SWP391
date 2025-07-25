import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import DoctorCard from "@features/website/components/guest/DocorCarousel/DoctorCard";
import { useDoctors } from "@hooks/useDoctors";
import styles from "./DoctorCarousel.module.css";

const visibleCount = 10;
const cardWidth = 266; 
const cardMargin = 16; 

const DoctorsCarousel = () => {
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const size = 15;
  const { doctors, loading, error } = useDoctors({size});

  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex + visibleCount >= doctors.length;

  const scrollToIndex = (index) => {
    if (carouselRef.current) {
      carouselRef.current.style.transition = "transform 0.5s ease";
      carouselRef.current.style.transform = `translateX(-${
        index * (cardWidth + cardMargin)
      }px)`;
    }
  };

  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex]);

  const handlePrev = () => {
    if (!isAtStart) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (!isAtEnd) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (loading) {
    return <div className={styles.carouselContainer}>Đang tải...</div>;
  }

  if (error) {
    return <div className={styles.carouselContainer}>Lỗi: {error}</div>;
  }

  if (doctors.length === 0) {
    return <div className={styles.carouselContainer}>Không có bác sĩ nào.</div>;
  }

  return (
    <div className={styles.carouselContainer}>
      <button
        className={styles.scrollButton}
        onClick={handlePrev}
        disabled={isAtStart}
      >
        <ChevronLeft size={24} />
      </button>

      <div className={styles.carouselWrapper}>
        <p className={styles.carouseTitle}>Đội ngũ chuyên gia</p>
        <Link to="/our-doctors" className={styles.viewMoreLinkUnderline}>
          Xem thêm danh sách bác sĩ tại đây
        </Link>
        <div className={styles.carousel} ref={carouselRef}>
          {doctors.map((doctor, index) => (
            <div key={`doctor-${index}`} className={styles.carouselItem}>
              <DoctorCard doctor={doctor} />
            </div>
          ))}
        </div>
      </div>

      <button
        className={styles.scrollButton}
        onClick={handleNext}
        disabled={isAtEnd}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default DoctorsCarousel;
