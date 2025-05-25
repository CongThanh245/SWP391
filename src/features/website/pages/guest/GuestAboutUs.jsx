import React from 'react';
import AboutUsHero from '@features/website/components/shared/AboutUsHero/AboutUsHero.jsx';
import Vision from '@features/website/components/guest/Vision/Vision';
import WorkingHours from '@features/website/components/guest/WorkingHour/WorkingHour';
const GuestAboutUs = () => {
    return (
        <div>
            <AboutUsHero></AboutUsHero>
            <WorkingHours/>
            <Vision/>
        </div>
    );
};

export default GuestAboutUs;