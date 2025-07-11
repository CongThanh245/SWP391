import React, { useEffect, useState } from 'react';
import Sidebar from '@components/common/Sidebar/PatientSidebar';
import CommonLayout from '@components/layout/CommonLayout/CommonLayout';
import { Outlet } from 'react-router-dom';
import { User, Calendar, FileText, Activity, CloudUpload  } from 'lucide-react';
import { formatDate } from '@utils/format';
import { getPatientProfile } from '@api/patientApi';

const ProfilePage = () => {
  const [initialUserData, setInitialUserData] = useState(null);
  const [rawUserData, setRawUserData] = useState(null); // Lưu dữ liệu thô từ API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const parsed = await getPatientProfile();
        const genderMap = { MALE: 'Nam', FEMALE: 'Nữ', OTHER: 'Khác' };
        const maritalStatusMap = { SINGLE: 'Độc thân', MARRIED: 'Đã kết hôn', DIVORCED: 'Đã ly hôn', WIDOWED: 'Goá' };

        // Lưu dữ liệu thô từ API
        setRawUserData(parsed);

        // Dữ liệu hiển thị
        setInitialUserData({
          name: parsed.patientName || 'Chưa có tên',
          patientId: parsed.patientId || 'BN001234',
          joinDate: formatDate(parsed.joinDate) || 'Chưa cập nhật',
          birthDate: formatDate(parsed.dateOfBirth) || 'Chưa cập nhật',
          marriageDate: formatDate(parsed.marriageDate) || 'Chưa cập nhật',
          address: parsed.patientAddress || 'Chưa cập nhật',
          phone: parsed.patientPhone || 'Chưa cập nhật',
          gender: genderMap[parsed.gender] || 'Chưa cập nhật',
          email: parsed.email || 'Chưa cập nhật',
          maritalStatus: maritalStatusMap[parsed.maritalStatus] || 'Chưa cập nhật',
          emergencyContact: parsed.emergencyContact || 'Chưa cập nhật',
          image: parsed.image || null,
          spouseName: parsed.spousePatientName || 'Chưa cập nhật',
          spouseAddress: parsed.spousePatientAddress || 'Chưa cập nhật',
          spousePhone: parsed.spousePatientPhone || 'Chưa cập nhật',
          spouseEmergencyContact: parsed.spouseEmergencyContact || 'Chưa cập nhật',
          spouseBirthDate: formatDate(parsed.spouseDateOfBirth) || 'Chưa cập nhật',
          spouseGender: genderMap[parsed.spouseGender] || 'Chưa cập nhật',
        });

        // localStorage.setItem('user', JSON.stringify(parsed));
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
        setError('Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const patientMenuItems = [
    { key: 'profile', label: 'Hồ sơ cá nhân', icon: User, path: '/health-records/profile' },
    { key: 'appointments', label: 'Lịch khám', icon: Calendar, path: '/health-records/appointments' },
    { key: 'attachments', label: 'Hồ sơ đính kèm', icon: CloudUpload, path: '/health-records/attachments' },
    { key: 'medical-records', label: 'Kết quả điều trị', icon: FileText, path: '/health-records/medical-records' },
    { key: 'prescriptions', label: 'Đơn thuốc', icon: Activity, path: '/health-records/prescriptions' },
  ];

  const sidebar = (
    <Sidebar menuItems={patientMenuItems} userRole="patient" />
  );

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <CommonLayout sidebar={sidebar} userRole="patient">
      <Outlet context={{ userData: initialUserData, rawUserData }} />
    </CommonLayout>
  );
};

export default ProfilePage;