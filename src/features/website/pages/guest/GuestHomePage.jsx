import React, { useEffect, useState } from "react";
import { useToast } from "@hooks/use-toast"; // Ensure this is correctly imported
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
  const { toasts, toast } = useToast();

  useEffect(() => {
    // Check authentication status
    const authToken = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("role");
    const isPatientAuthenticated = authToken && userRole === "PATIENT";
    setIsPatient(isPatientAuthenticated);

    // Fetch user data if authenticated as patient
    if (isPatientAuthenticated) {
      const userData = localStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    }

    // Show welcome toast for fresh login
    const isFreshLogin = localStorage.getItem("isFreshLogin");
    if (isFreshLogin === "true") {
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn đã quay trở lại.",
        variant: "success", // Optional: Use variant if supported
      });
      localStorage.removeItem("isFreshLogin"); // Clear flag to prevent re-trigger
    }
  }, [toast]); // Include toast in dependency array

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
      <FAQ />
    </div>
  );
};

export default GuestHomePage;
