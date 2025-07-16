import React from 'react';
import AboutUsHero from '@features/website/components/shared/AboutUsHero/AboutUsHero.jsx';
import Vision from '@features/website/components/guest/Vision/Vision';
import WorkingHours from '@features/website/components/guest/WorkingHour/WorkingHour';
import AnimatedSection from '@components/common/AnimatedSection'; // Import wrapper

const GuestAboutUs = () => {
  return (
    <div>
      <AnimatedSection animationType="fade" minHeight="500px">
        <AboutUsHero />
      </AnimatedSection>
      <AnimatedSection animationType="slideUp" minHeight="300px">
        <WorkingHours />
      </AnimatedSection>
      <AnimatedSection animationType="scale" minHeight="400px">
        <Vision />
      </AnimatedSection>
    </div>
  );
};

export default GuestAboutUs;