import React, { useState, useEffect } from 'react';
import { User, Calendar, FileText, Activity, Bell } from 'lucide-react';
import Sidebar from '@components/common/Sidebar/Sidebar';
import CommonLayout from '@components/layout/CommonLayout/CommonLayout';
import ProfileCard from '@features/patient/components/ProfileCard/ProfileCard';
import PatientInfo from '@features/patient/components/PatientInfo/PatientInfo';
import PlaceholderContent from '@features/patient/components/PlaceholderContent/PlaceholderContent';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('profile');
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user JSON in localStorage:", error);
      }
    }
  }, []);
  // Sample user data
  const userData = {
    name: user?.patientName || "Chưa có tên",
    patientId: user?.patientId|| "BN001234",
    joinDate: '15/01/2024',
    birthDate: '15/03/1990',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    phone: '0901 234 567',
    gender: 'Nữ',
    email: 'lan.nguyen@email.com',
    maritalStatus: 'Đã kết hôn'
  };

  // Patient menu items
  const patientMenuItems = [
    { key: 'profile', label: 'Hồ sơ cá nhân', icon: User },
    { key: 'medical-records', label: 'Hồ sơ bệnh án', icon: FileText },
    { key: 'appointments', label: 'Lịch khám', icon: Calendar },
    { key: 'health-monitoring', label: 'Theo dõi sức khỏe', icon: Activity },
    { key: 'notifications', label: 'Thông báo', icon: Bell }
  ];

  const handleMenuClick = (key) => {
    setActiveMenuItem(key);
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit clicked');
  };

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'profile':
        return (
          <div>
            <h1 className={styles.pageTitle}>Hồ sơ của tôi</h1>
            <ProfileCard user={userData} onEdit={handleEdit} />
            <PatientInfo user={userData} onEdit={handleEdit} />
          </div>
        );
      case 'medical-records':
        return (
          <PlaceholderContent
            icon={FileText}
            title="Hồ sơ bệnh án"
            description="Nội dung sẽ được phát triển..."
          />
        );
      case 'appointments':
        return (
          <PlaceholderContent
            icon={Calendar}
            title="Lịch khám"
            description="Nội dung sẽ được phát triển..."
          />
        );
      case 'health-monitoring':
        return (
          <PlaceholderContent
            icon={Activity}
            title="Theo dõi sức khỏe"
            description="Nội dung sẽ được phát triển..."
          />
        );
      case 'notifications':
        return (
          <PlaceholderContent
            icon={Bell}
            title="Thông báo"
            description="Nội dung sẽ được phát triển..."
          />
        );
      default:
        return null;
    }
  };

  const sidebar = (
    <Sidebar
      menuItems={patientMenuItems}
      activeItem={activeMenuItem}
      onItemClick={handleMenuClick}
      userRole="patient"
    />
  );

  return (
    <CommonLayout sidebar={sidebar} userRole="patient">
      {renderContent()}
    </CommonLayout>
  );
};

export default ProfilePage;