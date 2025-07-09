// src/routes/index.jsx
import { Routes, Route } from "react-router-dom";
import GuestLayout from "@components/layout/GuestLayout/GuestLayout.jsx";
import GuestHomePage from "@features/website/pages/guest/GuestHomePage.jsx";
import GuestAboutUs from "@features/website/pages/guest/GuestAboutUs.jsx";
import PatientRegisterPage from "@features/auth/pages/PatientRegisterPage/PatientRegisterPage.jsx";
import VerifyOtpPage from "@features/auth/pages/VerifyOtpPage/VerifyOtpPage.jsx";
import ProfilePage from "@features/profile/pages/ProfilePage/ProfilePage.jsx";
import ReceptionistDashboard from "@features/dashboard/components/ReceptionistDashboard/ReceptionistDashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import DoctorDetails from "@features/doctor/components/DoctorDetails/DoctorDetails.jsx";
import AppointmentManagement from "@features/appointment/pages/AppointmentManagement/AppointmentManagement.jsx";
import PreTestResult from "@features/test-result/pages/PreTestResult.jsx";
import PatientList from "@features/patient/pages/PatientList/PatientList.jsx";
import DoctorList from "@features/doctor/pages/DoctorList/DoctorList.jsx";
import React, { useState } from "react";
import DoctorDashboard from "@features/doctor/pages/DoctorDashboard";
import ReceptionistHomePage from "@features/dashboard/pages/ReceptionistHomePage/ReceptionistHomePage.jsx";
import DoctorsPage from "@features/doctor/components/DoctorPage/DoctorPage.jsx";
import ProfileContent from "@features/profile/components/ProfileContent/ProfileContent.jsx";
import { AppointmentsContent } from "@components/AppointmentsContent.js";
import AppointmentSchedulePage from "@features/appointment/pages/AppointmentSchedulePage/AppointmentSchedulePage.jsx";
import ServicesPage from "@features/website/pages/guest/ServicesPage.jsx";
import AdminDashboard from "@features/AdminDashboard.tsx";
import LoginPage from "@features/auth/pages/LoginPage/LoginPage.jsx";
import MedicalRecordsManager from "@features/file/MedicalRecordsManager/MedicalRecordsManager.jsx";
import PrescriptionsPage from "@features/medicine/pages/PrescriptionPage.jsx";
import PatientResultsPage from "@features/test-result/pages/PatientResultPage.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<GuestLayout />}>
        <Route path="/" element={<GuestHomePage />} />
        <Route path="/about-us" element={<GuestAboutUs />} />
        <Route path="/our-doctors" element={<DoctorsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route
          path="health-records"
          element={
            <ProtectedRoute requiredRoles={["PATIENT"]}>
            <ProfilePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileContent />} />
          <Route path="profile" element={<ProfileContent />} />
          <Route path="medical-records" element={<PatientResultsPage />} />
          <Route path="appointments" element={<AppointmentSchedulePage />} />
          <Route path="health-monitoring" element={<PrescriptionsPage />} />
          <Route path="notifications" element={<AppointmentsContent />} />
          <Route path="attachments" element={<MedicalRecordsManager></MedicalRecordsManager>} />
        </Route>
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<PatientRegisterPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/receptionist-dashboard" element={<ReceptionistDashboard />}>
        <Route index element={<ReceptionistHomePage />} />
        {/* Trang chủ sẽ được xử lý trong ReceptionistDashboard */}
        <Route path="appointment" element={<AppointmentManagement />} />
        <Route path="test-results" element={<PreTestResult />} />
        <Route path="patients" element={<PatientList />} />
        <Route path="doctors" element={<DoctorList />}>
          <Route path=":id" element={<DoctorDetails />} />
        </Route>
      </Route>
      <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
