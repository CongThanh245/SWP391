// src/routes/index.js
import { Routes, Route } from 'react-router-dom';
import GuestLayout from '@components/layout/GuestLayout/GuestLayout.jsx';
import GuestHomePage from '@features/website/pages/guest/GuestHomePage.jsx';
import GuestAboutUs from '@features/website/pages/guest/GuestAboutUs.jsx';
import LoginPage from '@features/auth/pages/LoginPage/LoginPage.jsx';
import RegisterPage from '@features/auth/pages/RegisterPage/RegisterPage.jsx';
import VerifyOtpPage from '@features/auth/pages/VerifyOtpPage/VerifyOtpPage.jsx';

const AppRoutes = () => (
  <Routes>
    <Route element={<GuestLayout />}>
      <Route path="/" element={<GuestHomePage />} />
      <Route path="/about-us" element={<GuestAboutUs />} />
    </Route>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/verify-otp" element={<VerifyOtpPage />} />
  </Routes>
);

export default AppRoutes;