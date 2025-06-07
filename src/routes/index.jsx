// src/routes/index.jsx
import { Routes, Route } from "react-router-dom";
import GuestLayout from "@components/layout/GuestLayout/GuestLayout.jsx";
import GuestHomePage from "@features/website/pages/guest/GuestHomePage.jsx";
import GuestAboutUs from "@features/website/pages/guest/GuestAboutUs.jsx";
import PatientLoginPage from "@features/auth/pages/PatientLoginPage/PatientLoginPage.jsx";
import PatientRegisterPage from "@features/auth/pages/PatientRegisterPage/PatientRegisterPage.jsx";
import VerifyOtpPage from "@features/auth/pages/VerifyOtpPage/VerifyOtpPage.jsx";
import ProfilePage from "@features/patient/pages/ProfilePage/ProfilePage";
import ReceptionistLoginPage from "@features/auth/pages/ReceptionistLoginPage/ReceptionistLoginPage";
import DoctorLoginPage from "@features/auth/pages/DoctorLoginPage/DoctorLoginPage";
import AdminLoginPage from "@features/auth/pages/AdminLoginPage/AdminLoginPage";
import ReceptionistDashboard from "@features/dashboard/ReceptionistDashboard/ReceptionistDashboard";
import ProtectedRoute from "./ProtectedRoute.jsx";
import DoctorDetails from "@features/doctor/components/DoctorDetails/DoctorDetails.jsx";
import AppointmentManagement from "@features/appointment/pages/AppointmentManagement/AppointmentManagement.jsx";
import PreTestResult from "@features/test-result/pages/PreTestResult.jsx";
import PatientList from "@features/patient/pages/PatientList/PatientList.jsx";
import DoctorList from "@features/doctor/pages/DoctorList/DoctorList.jsx";
import React from 'react';
import DoctorDashboard from '@features/doctor/pages/DoctorDashboard'



const AppRoutes = () => { 

  return (
  <Routes>
    <Route element={<GuestLayout />}>
      <Route path="/" element={<GuestHomePage />} />
      <Route path="/about-us" element={<GuestAboutUs />} />
      <Route
        path="health-records"
        element={
          <ProtectedRoute requiredRoles={["PATIENT"]}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Route>
   
    <Route path="/login" element={<PatientLoginPage />} />
    <Route path="/register" element={<PatientRegisterPage />} />
    <Route path="/verify-otp" element={<VerifyOtpPage />} />
    <Route path="/recep-login" element={<ReceptionistLoginPage />} />
    <Route path="/doctor-login" element={<DoctorLoginPage />} />
    <Route path="/admin-login" element={<AdminLoginPage />} />
    <Route path="/receptionist-dashboard" element={<ReceptionistDashboard />}>
      <Route index element={null} /> {/* Trang chủ sẽ được xử lý trong ReceptionistDashboard */}
      <Route path="appointment" element={<AppointmentManagement />} />
      <Route path="test-results" element={<PreTestResult />} />
      <Route path="patients" element={<PatientList />} />
      <Route path="doctors" element={<DoctorList />} />
      <Route path="doctor/:id" element={<DoctorDetails />} />
    </Route>
 <Route
        path="/doctor-dashboard"
        element={
          
            <DoctorDashboard/>
          
        }
      />

  </Routes>
  );
}

export default AppRoutes;
