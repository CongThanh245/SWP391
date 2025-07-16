import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimatedSection = ({ children, animationType = 'fade', minHeight = 'auto' }) => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Chỉ kích hoạt animation một lần
    threshold: 0.1, // Kích hoạt khi 10% component vào viewport
  });

  // Các biến thể animation nhẹ nhàng hơn
  const variants = {
    fade: {
      hidden: { opacity: 0.3 },
      visible: { opacity: 1, transition: { duration: 0.7 } },
    },
    slideUp: {
      hidden: { opacity: 0.3, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
    },
    scale: {
      hidden: { opacity: 0.3, scale: 0.95 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
    },
  };

  return (
    <div ref={ref} style={{ minHeight }}>
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={variants[animationType]}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default AnimatedSection;