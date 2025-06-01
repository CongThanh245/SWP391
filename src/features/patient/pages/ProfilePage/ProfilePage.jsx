import React, { useState, useEffect } from 'react';
import { User, Calendar, FileText, Activity, Bell } from 'lucide-react';
import Sidebar from '@components/common/Sidebar/Sidebar';
import CommonLayout from '@components/layout/CommonLayout/CommonLayout';
import ProfileCard from '@features/patient/components/ProfileCard/ProfileCard';
import PatientInfo from '@features/patient/components/PatientInfo/PatientInfo';
import PlaceholderContent from '@features/patient/components/PlaceholderContent/PlaceholderContent';
import BaseModal from '@components/common/BaseModal/BaseModal';
import styles from './ProfilePage.module.css';
import { formatDate } from '@utils/format'
import { updatePatient } from '@api/patientApi'

const ProfilePage = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('profile');
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: ''
  });
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setEditForm({
          name: parsed.patientName || '',
          phone: parsed.patientPhone || '',
          address: parsed.patientAddress || ''
        });
        console.log(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user JSON in localStorage:", error);
      }
    }
  }, []);

  // Sample user data


  const genderMap = {
    MALE: "Nam",
    FEMALE: "Nữ",
    OTHER: "Khác",
    PREFER_NOT_TO_SAY: "Không tiết lộ"
  };

  const maritalStatusMap = {
    SINGLE: "Độc thân",
    MARRIED: "Đã kết hôn",
    DIVORCED: "Đã ly hôn",
    WIDOWED: "Goá",
  };

  const userData = {
    name: user?.patientName || "Chưa có tên",
    patientId: user?.patientId || "BN001234",
    joinDate: formatDate(user?.joinDate) || 'Chưa cập nhật',
    birthDate: formatDate(user?.dateOfBirth) || 'Chưa cập nhật',
    address: user?.patientAddress || 'Chưa cập nhật',
    phone: user?.patientPhone || 'Chưa cập nhật',
    gender: genderMap[user?.gender] || 'Chưa cập nhật',
    email: user?.email || 'Chưa cập nhật',
    maritalStatus: maritalStatusMap[user?.maritalStatus] || 'Chưa cập nhật',
    emergencyContact: user?.emergencyContact || 'Chưa cập nhật',
    image: user?.image || null,
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
    setIsModalOpen(true);
    console.log('Edit clicked');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }))
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      patientName: editForm.name,
      patientPhone: editForm.phone,
      patientAddress: editForm.address
    }

    try {
      const updated = await updatePatient(payload);

      // Update state and localStorage
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));

      setIsModalOpen(false);
    } catch (error) {
      console.error("Cập nhật hồ sơ thất bại:", error);
      alert("Không thể cập nhật hồ sơ. Vui lòng thử lại.");
    }
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

      <BaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Chỉnh sửa thông tin"
      >
        <form onSubmit={handleSave} className="edit-form">
          <div className="detail-grid">
            <div className="detail-item">
              <label className="detail-label">Họ tên:</label>
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleFormChange}
                required

              />
            </div>
            <div className="detail-item">
              <label className="detail-label">Số điện thoại:</label>
              <input
                type="text"
                name="phone"
                value={editForm.phone}
                onChange={handleFormChange}
                required

              />
            </div>
            <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
              <label className="detail-label">Địa chỉ:</label>
              <input
                type="text"
                name="address"
                value={editForm.address}
                onChange={handleFormChange}
                required

              />
            </div>
          </div>
          <div className="modal-actions" style={{ marginTop: '1rem' }}>
            <button type="submit" className="btn btn-update">Lưu</button>
            <button type="button" onClick={handleCloseModal} className="btn btn-delete">Hủy</button>
          </div>
        </form>
      </BaseModal>
    </CommonLayout>
  );
};

export default ProfilePage;