// src/features/patient/components/ProfileContent/ProfileContent.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import ProfileCard from '../ProfileCard/ProfileCard';
import PatientInfo from '../PatientInfo/PatientInfo';
import BaseModal from '@components/common/BaseModal/BaseModal';
import styles from '../../pages/ProfilePage/ProfilePage.module.css';
import { formatDate } from '@utils/format';
import { updatePatient } from '@api/patientApi';

const ProfileContent = () => {
  const { userData: initialUserData } = useOutletContext() || {}; // Mặc định là object rỗng nếu null
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setEditForm({
          name: parsed.patientName || '',
          phone: parsed.patientPhone || '',
          address: parsed.patientAddress || '',
        });
      } catch (error) {
        console.error('Invalid user JSON in localStorage:', error);
      }
    }
  }, []);

  const genderMap = {
    MALE: 'Nam',
    FEMALE: 'Nữ',
    OTHER: 'Khác',
    PREFER_NOT_TO_SAY: 'Không tiết lộ',
  };

  const maritalStatusMap = {
    SINGLE: 'Độc thân',
    MARRIED: 'Đã kết hôn',
    DIVORCED: 'Đã ly hôn',
    WIDOWED: 'Goá',
  };

  const userData = {
    name: user?.patientName || initialUserData?.name || 'Chưa có tên',
    patientId: user?.patientId || initialUserData?.patientId || 'BN001234',
    joinDate: formatDate(user?.joinDate) || initialUserData?.joinDate || 'Chưa cập nhật',
    birthDate: formatDate(user?.dateOfBirth) || initialUserData?.dateOfBirth || 'Chưa cập nhật',
    address: user?.patientAddress || initialUserData?.address || 'Chưa cập nhật',
    phone: user?.patientPhone || initialUserData?.phone || 'Chưa cập nhật',
    gender: genderMap[user?.gender] || initialUserData?.gender || 'Chưa cập nhật',
    email: user?.email || initialUserData?.email || 'Chưa cập nhật',
    maritalStatus: maritalStatusMap[user?.maritalStatus] || initialUserData?.maritalStatus || 'Chưa cập nhật',
    emergencyContact: user?.emergencyContact || initialUserData?.emergencyContact || 'Chưa cập nhật',
    image: user?.image || initialUserData?.image || null,
  };

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      patientName: editForm.name,
      patientPhone: editForm.phone,
      patientAddress: editForm.address,
    };

    try {
      const updated = await updatePatient(payload);
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Cập nhật hồ sơ thất bại:', error);
      alert('Không thể cập nhật hồ sơ. Vui lòng thử lại.');
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Hồ sơ của tôi</h1>
      <ProfileCard user={userData} onEdit={handleEdit} />
      <PatientInfo user={userData} onEdit={handleEdit} />
      <BaseModal isOpen={isModalOpen} onClose={handleCloseModal} title="Chỉnh sửa thông tin">
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
    </div>
  );
};

export default ProfileContent;