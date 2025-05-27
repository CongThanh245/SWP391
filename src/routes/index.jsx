// src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';
import GuestLayout from '@components/layout/GuestLayout/GuestLayout.jsx';
import GuestHomePage from '@features/website/pages/guest/GuestHomePage.jsx';
import GuestAboutUs from '@features/website/pages/guest/GuestAboutUs.jsx';
import LoginPage from '@features/auth/pages/GuestLoginPage/LoginPage.jsx';
import RegisterPage from '@features/auth/pages/GuestRegisterPage/RegisterPage.jsx';
import ProfilePage from '@features/patient/pages/ProfilePage/ProfilePage';

const AppRoutes = () => (
  <Routes>
    <Route element={<GuestLayout />}>
      <Route path="/" element={<GuestHomePage />} />
      <Route path="/about-us" element={<GuestAboutUs />} />
      <Route path='health-records' element={<ProfilePage/>}/>
    </Route>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
  </Routes>
);

export default AppRoutes;