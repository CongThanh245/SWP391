// src/features/patient/components/ProfileContent/ProfileContent.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ProfileCard from '../ProfileCard/ProfileCard';
import PatientInfo from '../PatientInfo/PatientInfo';
import BaseModal from '@components/common/BaseModal/BaseModal';
import styles from './ProfileContent.module.css';
import { formatDate } from '@utils/format';
import { updatePatient } from '@api/patientApi';

// Validation Schema với Yup
const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(50, 'Họ tên không được vượt quá 50 ký tự')
    .matches(/^[a-zA-ZÀ-ỹ\s]+$/, 'Họ tên chỉ được chứa chữ cái và khoảng trắng')
    .required('Họ tên là bắt buộc'),
  
  phone: Yup.string()
    .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại không hợp lệ (VD: 0901234567)')
    .required('Số điện thoại là bắt buộc'),
  
  address: Yup.string()
    .min(10, 'Địa chỉ phải có ít nhất 10 ký tự')
    .max(200, 'Địa chỉ không được vượt quá 200 ký tự')
    .required('Địa chỉ là bắt buộc'),
  
  dateOfBirth: Yup.date()
    .required('Ngày sinh là bắt buộc')
    .max(new Date(), 'Ngày sinh không được là ngày trong tương lai')
    .test('age', 'Tuổi phải từ 1 đến 120', function(value) {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 1 && age <= 120;
    }),
  
  gender: Yup.string()
    .oneOf(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'], 'Vui lòng chọn giới tính')
    .required('Giới tính là bắt buộc'),
});

const ProfileContent = () => {
  const { userData: initialUserData } = useOutletContext() || {};
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
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

  // Initial values cho Formik
  const getInitialValues = () => ({
    name: user?.patientName || '',
    phone: user?.patientPhone || '',
    address: user?.patientAddress || '',
    dateOfBirth: user?.dateOfBirth ? formatDateForInput(user.dateOfBirth) : '',
    gender: user?.gender || '',
  });

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Hàm để format ngày từ YYYY-MM-DD sang định dạng phù hợp cho input date
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setIsSubmitting(true);
    
    const payload = {
      patientName: values.name.trim(),
      patientPhone: values.phone.trim(),
      patientAddress: values.address.trim(),
      dateOfBirth: values.dateOfBirth,
      gender: values.gender,
    };

    try {
      const updated = await updatePatient(payload);
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setIsModalOpen(false);
      // Có thể thêm thông báo thành công ở đây
      alert('Cập nhật hồ sơ thành công!');
    } catch (error) {
      console.error('Cập nhật hồ sơ thất bại:', error);
      
      // Xử lý lỗi chi tiết từ server
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        Object.keys(serverErrors).forEach(field => {
          setFieldError(field, serverErrors[field]);
        });
      } else {
        alert('Không thể cập nhật hồ sơ. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Hồ sơ của tôi</h1>
      <ProfileCard user={userData} onEdit={handleEdit} />
      <PatientInfo user={userData} onEdit={handleEdit} />
      
      <BaseModal isOpen={isModalOpen} onClose={handleCloseModal} title="Chỉnh sửa thông tin">
        <Formik
          initialValues={getInitialValues()}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true} // Cho phép re-initialize khi user data thay đổi
        >
          {({ values, errors, touched, isSubmitting: formikSubmitting }) => (
            <Form className={styles.editForm}>
              <div className={styles.detailGrid}>
                {/* Hàng 1: Họ tên và Số điện thoại */}
                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Họ tên:</label>
                  <Field
                    type="text"
                    name="name"
                    className={`${styles.formInput} ${
                      errors.name && touched.name ? styles.inputError : ''
                    }`}
                    placeholder="Nhập họ và tên"
                  />
                  <ErrorMessage 
                    name="name" 
                    component="div" 
                    className={styles.errorMessage} 
                  />
                </div>

                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Số điện thoại:</label>
                  <Field
                    type="tel"
                    name="phone"
                    className={`${styles.formInput} ${
                      errors.phone && touched.phone ? styles.inputError : ''
                    }`}
                    placeholder="Nhập số điện thoại"
                  />
                  <ErrorMessage 
                    name="phone" 
                    component="div" 
                    className={styles.errorMessage} 
                  />
                </div>

                {/* Hàng 2: Ngày sinh và Giới tính */}
                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Ngày sinh:</label>
                  <Field
                    type="date"
                    name="dateOfBirth"
                    className={`${styles.formInput} ${
                      errors.dateOfBirth && touched.dateOfBirth ? styles.inputError : ''
                    }`}
                  />
                  <ErrorMessage 
                    name="dateOfBirth" 
                    component="div" 
                    className={styles.errorMessage} 
                  />
                </div>

                <div className={styles.detailItem}>
                  <label className={styles.detailLabel}>Giới tính:</label>
                  <Field
                    as="select"
                    name="gender"
                    className={`${styles.formSelect} ${
                      errors.gender && touched.gender ? styles.inputError : ''
                    }`}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                    <option value="PREFER_NOT_TO_SAY">Không tiết lộ</option>
                  </Field>
                  <ErrorMessage 
                    name="gender" 
                    component="div" 
                    className={styles.errorMessage} 
                  />
                </div>

                {/* Hàng 3: Địa chỉ chiếm toàn bộ chiều rộng */}
                <div className={`${styles.detailItem} ${styles.detailItemFull}`}>
                  <label className={styles.detailLabel}>Địa chỉ:</label>
                  <Field
                    type="text"
                    name="address"
                    className={`${styles.formInput} ${
                      errors.address && touched.address ? styles.inputError : ''
                    }`}
                    placeholder="Nhập địa chỉ chi tiết"
                  />
                  <ErrorMessage 
                    name="address" 
                    component="div" 
                    className={styles.errorMessage} 
                  />
                </div>
              </div>

              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  onClick={handleCloseModal} 
                  className={`${styles.btnBase} ${styles.btnCancel}`}
                  disabled={formikSubmitting || isSubmitting}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className={`${styles.btnBase} ${styles.btnUpdate}`}
                  disabled={formikSubmitting || isSubmitting}
                >
                  {formikSubmitting || isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </BaseModal>
    </div>
  );
};

export default ProfileContent;