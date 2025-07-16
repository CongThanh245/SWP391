import React, { useEffect, useState } from 'react';
import { useToast } from '@hooks/use-toast';
import HeroSection from '@features/website/components/shared/HeroSection/HeroSection.jsx';
import JourneySection from '@features/website/components/guest/JourneySection/JourneySection';
import DoctorsCarousel from '@features/website/components/guest/DocorCarousel/DoctorCarousel';
import FAQ from '@features/website/components/shared/FAQ/FAQ';
import TestimonialSection from '@features/website/components/guest/TestimonialSection/TestimonialSection';
import FeaturesSection from '@features/website/components/patient/FeatureSection/FeatureSection';
import PatientHero from '@features/website/components/patient/PatientHero/PatientHero';
import AnimatedSection from '@components/common/AnimatedSection';
import OnboardingModal from '@components/common/OnBoardingModal/OnBoardingModal.jsx';

const GuestHomePage = () => {
  const [isPatient, setIsPatient] = useState(false);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toasts, toast } = useToast();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('role');
    const isPatientAuthenticated = authToken && userRole === 'PATIENT';
    setIsPatient(isPatientAuthenticated);

    if (isPatientAuthenticated) {
      const userData = localStorage.getItem('user');
      setUser(userData ? JSON.parse(userData) : null);

      // Kiểm tra xem người dùng đã xem modal chưa
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      if (!hasSeenOnboarding || hasSeenOnboarding === 'false') {
        setIsModalOpen(true);
        toast({
          title: 'Đăng nhập thành công',
          description: 'Chào mừng bạn đã quay trở lại.',
          variant: 'success',
        });
      }
    }
  }, [toast]);

  return (
    <div>
      {isPatient ? (
        <>
          <AnimatedSection animationType="fade" minHeight="500px">
            <PatientHero userName={user ? user.patientName : 'bạn'} />
          </AnimatedSection>
          <OnboardingModal
            isOpen={isModalOpen}
            onRequestClose={() => {
              setIsModalOpen(false);
              localStorage.setItem('hasSeenOnboarding', 'true');
            }}
            userName={user ? user.patientName : 'bạn'}
          />
        </>
      ) : (
        <AnimatedSection animationType="fade" >
          <HeroSection />
        </AnimatedSection>
      )}

      <AnimatedSection animationType="slideUp" >
        <JourneySection />
      </AnimatedSection>
      <AnimatedSection animationType="scale" >
        <DoctorsCarousel />
      </AnimatedSection>
      <AnimatedSection animationType="fade" >
        <TestimonialSection />
      </AnimatedSection>
      <AnimatedSection animationType="slideUp" >
        <FAQ />
      </AnimatedSection>
    </div>
  );
};

export default GuestHomePage;