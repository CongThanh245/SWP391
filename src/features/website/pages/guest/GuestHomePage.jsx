import React, { useEffect, useState } from 'react';
import { useToast } from '@hooks/use-toast';
import HeroSection from '@features/website/components/shared/HeroSection/HeroSection.jsx';
import JourneySection from '@features/website/components/guest/JourneySection/JourneySection';
import DoctorsCarousel from '@features/website/components/guest/DocorCarousel/DoctorCarousel';
import FAQ from '@features/website/components/shared/FAQ/FAQ';
import TestimonialSection from '@features/website/components/guest/TestimonialSection/TestimonialSection';
import FeaturesSection from '@features/website/components/patient/FeatureSection/FeatureSection';
import PatientHero from '@features/website/components/patient/PatientHero/PatientHero';
import AnimatedSection from '@components/common/AnimatedSection'; // Import wrapper

const GuestHomePage = () => {
  const [isPatient, setIsPatient] = useState(false);
  const [user, setUser] = useState(null);
  const { toasts, toast } = useToast();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('role');
    const isPatientAuthenticated = authToken && userRole === 'PATIENT';
    setIsPatient(isPatientAuthenticated);

    if (isPatientAuthenticated) {
      const userData = localStorage.getItem('user');
      setUser(userData ? JSON.parse(userData) : null);
    }

    const isFreshLogin = localStorage.getItem('isFreshLogin');
    if (isFreshLogin === 'true') {
      toast({
        title: 'Đăng nhập thành công',
        description: 'Chào mừng bạn đã quay trở lại.',
        variant: 'success',
      });
      localStorage.removeItem('isFreshLogin');
    }
  }, [toast]);

  return (
    <div>
      {isPatient ? (
        <>
          <AnimatedSection animationType="fade" minHeight="500px">
            <PatientHero userName={user ? user.patientName : 'bạn'} />
          </AnimatedSection>
        </>
      ) : (
        <AnimatedSection animationType="fade" minHeight="600px">
          <HeroSection />
        </AnimatedSection>
      )}

      <AnimatedSection animationType="slideUp" minHeight="400px">
        <JourneySection />
      </AnimatedSection>
      <AnimatedSection animationType="scale" minHeight="300px">
        <DoctorsCarousel />
      </AnimatedSection>
      <AnimatedSection animationType="fade" minHeight="400px">
        <TestimonialSection />
      </AnimatedSection>
      <AnimatedSection animationType="slideUp" minHeight="300px">
        <FAQ />
      </AnimatedSection>
    </div>
  );
};

export default GuestHomePage;