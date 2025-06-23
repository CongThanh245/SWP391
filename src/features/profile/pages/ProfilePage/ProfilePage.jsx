// src/features/patient/pages/ProfilePage/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '@components/common/Sidebar/PatientSidebar';
import CommonLayout from '@components/layout/CommonLayout/CommonLayout';
import { Outlet } from 'react-router-dom';
import { User, Calendar, FileText, Activity, Bell } from 'lucide-react';
import { formatDate } from '@utils/format';

const ProfilePage = () => {
  const [initialUserData, setInitialUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const genderMap = { MALE: 'Nam', FEMALE: 'Nữ', OTHER: 'Khác', PREFER_NOT_TO_SAY: 'Không tiết lộ' };
        const maritalStatusMap = { SINGLE: 'Độc thân', MARRIED: 'Đã kết hôn', DIVORCED: 'Đã ly hôn', WIDOWED: 'Goá' };

        setInitialUserData({
          name: parsed.patientName || 'Chưa có tên',
          patientId: parsed.patientId || 'BN001234',
          joinDate: formatDate(parsed.joinDate) || 'Chưa cập nhật',
          birthDate: formatDate(parsed.dateOfBirth) || 'Chưa cập nhật',
          address: parsed.patientAddress || 'Chưa cập nhật',
          phone: parsed.patientPhone || 'Chưa cập nhật',
          gender: genderMap[parsed.gender] || 'Chưa cập nhật',
          email: parsed.email || 'Chưa cập nhật',
          maritalStatus: maritalStatusMap[parsed.maritalStatus] || 'Chưa cập nhật',
          emergencyContact: parsed.emergencyContact || 'Chưa cập nhật',
          image: parsed.image || null,
        });
      } catch (error) {
        console.error('Invalid user JSON in localStorage:', error);
      }
    }
  }, []);

  const patientMenuItems = [
    { key: 'profile', label: 'Hồ sơ cá nhân', icon: User, path: '/health-records/profile' },
    { key: 'medical-records', label: 'Kết quả điều trị', icon: FileText, path: '/health-records/medical-records' },
    { key: 'appointments', label: 'Lịch khám', icon: Calendar, path: '/health-records/appointments' },
    { key: 'health-monitoring', label: 'Đơn thuốc', icon: Activity, path: '/health-records/health-monitoring' },
  ];

  const sidebar = (
    <Sidebar
      menuItems={patientMenuItems}
      userRole="patient"
    />
  );

  return (
    <CommonLayout sidebar={sidebar} userRole="patient">
      <Outlet context={{ userData: initialUserData }} />
    </CommonLayout>
  );
};

export default ProfilePage;