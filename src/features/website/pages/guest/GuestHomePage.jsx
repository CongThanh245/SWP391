import React, { useEffect, useState } from "react";
import HeroSection from "@features/website/components/shared/HeroSection/HeroSection.jsx";
import JourneySection from "@features/website/components/guest/JourneySection/JourneySection";
import DoctorsCarousel from "@features/website/components/guest/DocorCarousel/DoctorCarousel";
import BlogSection from "@features/website/components/shared/BlogSection/BlogSection";
import FAQ from "@features/website/components/shared/FAQ/FAQ";
import TestimonialSection from "@features/website/components/guest/TestimonialSection/TestimonialSection";
import FeaturesSection from "@features/website/components/patient/FeatureSection/FeatureSection";
import PatientHero from "@features/website/components/patient/PatientHero/PatientHero";

const GuestHomePage = () => {
  const [isPatient, setIsPatient] = useState(false);
  const [user, setUser] = useState(null);

  const isAuthenticated = () => {
    const authToken = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("role");
    return authToken && userRole === "PATIENT"; 
  };

  const getUserData = () => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  };

  useEffect(() => {
    const patientStatus = isAuthenticated();
    setIsPatient(patientStatus);
    if (patientStatus) {
      setUser(getUserData());
    }
  }, []);

  return (
    <div>
      {isPatient ? (
        <>
          <PatientHero userName={user ? user.patientName : "bạn"} />
          <FeaturesSection />
        </>
      ) : (
        <HeroSection />
      )}

      <JourneySection />
      <DoctorsCarousel />
      <TestimonialSection />
      <BlogSection />
      <FAQ />
    </div>
  );
};

export default GuestHomePage;