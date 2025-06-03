import React from 'react';
import HeroSection from '@features/website/components/shared/HeroSection/HeroSection.jsx';
import JourneySection from '@features/website/components/guest/JourneySection/JourneySection';
import DoctorsCarousel from '@features/website/components/guest/DocorList/DoctorCarousel';
import BlogSection from '@features/website/components/shared/BlogSection/BlogSection';
import FAQ from '@features/website/components/shared/FAQ/FAQ';
import TestimonialSection from '@features/website/components/guest/TestimonialSection/TestimonialSection';
import FeaturesSection from '@features/website/components/patient/FeatureSection/FeatureSection';
import PatientHero from '@features/website/components/patient/PatientHero/PatientHero';

const GuestHomePage = () => {
    return (
        <div>
            {/* <HeroSection></HeroSection> */}
            <PatientHero userName="bạn"></PatientHero>
            <FeaturesSection></FeaturesSection>
            <JourneySection></JourneySection>
            <DoctorsCarousel/>
            <TestimonialSection/>
            <BlogSection/>
            <FAQ/>
        </div>
    );
};

export default GuestHomePage;