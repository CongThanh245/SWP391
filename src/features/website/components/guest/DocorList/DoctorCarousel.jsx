import React, { useState, useRef, useEffect } from 'react';
import DoctorCard from './DoctorCard.jsx';
import styles from './DoctorCarousel.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import doctorImg from '../../../../../assets/images/bacsi.png'; 

const visibleCount = 4;
const cardWidth = 266; // Card width + margins (adjust this value if needed)

// Using your existing doctor data
const doctors = [
  { name: 'Nguyễn Thị Sen', title: 'BS CKI.', specialty: 'Da liễu', price: '0đ - 200.000đ', level: 'Bác sĩ Chuyên Khoa', rating: 5, visits: 43, image: doctorImg },
  { name: 'Nguyễn Đức Bảo', title: 'Ths BS.', specialty: 'Tai mũi họng', price: '150.000đ', level: 'Bác sĩ Chuyên Khoa', rating: 4.2, visits: 37, image: doctorImg },
  { name: 'Nguyễn Ngọc Bách', title: 'Ths BS.', specialty: 'Nhi khoa', price: '150.000đ', level: 'Bác sĩ Chuyên Khoa', rating: 4.3, visits: 121, image: doctorImg },
  { name: 'Nguyễn Thị Mỹ Linh', title: 'Ths BS.', specialty: 'Cơ Xương Khớp', price: '220.000đ', level: 'Bác sĩ Chuyên Khoa', rating: 4.1, visits: 53, image: doctorImg },
  { name: 'Nguyễn Văn A', title: 'BS.', specialty: 'Tim mạch', price: '180.000đ', level: 'Bác sĩ Chuyên Khoa', rating: 4.5, visits: 66, image: doctorImg },
  { name: 'Nguyễn Văn B', title: 'BS.', specialty: 'Tim mạch', price: '180.000đ', level: 'Bác sĩ Chuyên Khoa', rating: 4.5, visits: 66, image: doctorImg },
];

function DoctorsCarousel() {
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Calculate if buttons should be disabled
  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex + visibleCount >= doctors.length;
  
  // Handle scrolling animation manually
  const scrollToIndex = (index) => {
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'transform 0.5s ease';
      carouselRef.current.style.transform = `translateX(-${index * cardWidth}px)`;
    }
  };
  
  // Update scroll position when index changes
  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex]);
  
  // Handle navigation
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
}

export default DoctorsCarousel;