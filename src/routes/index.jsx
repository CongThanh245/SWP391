// src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';
import GuestLayout from '@components/layout/GuestLayout/GuestLayout.jsx';
import GuestHomePage from '@features/website/pages/guest/GuestHomePage.jsx';
import GuestAboutUs from '@features/website/pages/guest/GuestAboutUs.jsx';
import PatientLoginPage from '@features/auth/pages/PatientLoginPage/PatientLoginPage.jsx';
import PatientRegisterPage from '@features/auth/pages/PatientRegisterPage/PatientRegisterPage.jsx';
import VerifyOtpPage from '@features/auth/pages/VerifyOtpPage/VerifyOtpPage.jsx';
import ProfilePage from '@features/patient/pages/ProfilePage/ProfilePage';
import ReceptionistLoginPage from '@features/auth/pages/ReceptionistLoginPage/ReceptionistLoginPage';
import DoctorLoginPage from '@features/auth/pages/DoctorLoginPage/DoctorLoginPage';
import AdminLoginPage from '@features/auth/pages/AdminLoginPage/AdminLoginPage';


const AppRoutes = () => (
  <Routes>
    <Route element={<GuestLayout />}>
      <Route path="/" element={<GuestHomePage />} />
      <Route path="/about-us" element={<GuestAboutUs />} />
      <Route path='health-records' element={<ProfilePage/>}/>
    </Route>
    <Route path="/login" element={<PatientLoginPage />} />
    <Route path="/register" element={<PatientRegisterPage />} />
    <Route path="/verify-otp" element={<VerifyOtpPage />} />
    <Route path="/recep-login" element={<ReceptionistLoginPage />} />
    <Route path="/doctor-login" element={<DoctorLoginPage />} />
    <Route path="/admin-login" element={<AdminLoginPage />} />

  </Routes>
);

export default AppRoutes;