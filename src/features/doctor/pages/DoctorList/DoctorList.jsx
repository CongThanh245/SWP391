import React, { useState } from 'react';
import { Phone, Users } from 'lucide-react';
import { useAdminDoctors } from '@hooks/useDoctors';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styles from './DoctorList.module.css';
import DoctorDetails from '@features/doctor/components/DoctorDetails/DoctorDetails';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.modalCloseButton} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

const DoctorList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const { doctors, loading, error } = useAdminDoctors({ page, size: pageSize });

  // Lấy chữ cái đầu của từ cuối trong tên
  const getInitials = (name) => {
    if (!name) return 'N';
    const lastWord = name.split(' ').pop();
    return lastWord.charAt(0).toUpperCase();
  };

  const handleCloseModal = () => {
    navigate('/receptionist-dashboard/doctors');
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0) {
      setPage(newPage);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  if (error) {
    return <div className={styles.error}>Lỗi: {error}</div>;
  }

  return (
    <div className={styles.doctorListPage}>
      <div className={styles.pageHeader}>
        <h2>Danh sách Bác sĩ</h2>
        <p>Thông tin các bác sĩ trong phòng khám</p>
      </div>

      <div className={styles.doctorGrid}>
        {/* Grid Header */}
        <div className={styles.gridHeader}>
          <div>Avatar</div>
          <div>Thông tin bác sĩ</div>
          <div>Chuyên khoa</div>
          <div>Số điện thoại</div>
          <div>Hành động</div>
        </div>

        {/* Grid Rows */}
        {doctors && doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div key={doctor.id} className={styles.gridRow}>
              {/* Avatar Column */}
              <div className={styles.avatarColumn}>
                <div className={styles.doctorAvatar}>
                  {doctor.imageProfile && doctor.imageProfile !== '/assets/images/bacsi.png' ? (
                    <img
                      src={doctor.imageProfile}
                      alt={doctor.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 border-2 border-white shadow-sm">
                      {getInitials(doctor.name)}
                    </div>
                  )}
                </div>
              </div>

              {/* Doctor Info Column */}
              <div className={styles.doctorInfoColumn}>
                <div className={styles.doctorId}>ID: {doctor.id}</div>
                <h3 className={styles.doctorName}>{doctor.name}</h3>
              </div>

              {/* Specialization Column */}
              <div className={styles.specializationColumn}>
                <div className={styles.specializationTag}>
                  {doctor.specialization}
                </div>
              </div>

              {/* Phone Column */}
              <div className={styles.phoneColumn}>
                <Phone size={16} />
                <span>{doctor.phone}</span>
              </div>

              {/* Action Column */}
              <div className={styles.actionColumn}>
                <Link
                  to={`/receptionist-dashboard/doctors/${doctor.id}`}
                  className={styles.viewDetailsButton}
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <Users />
            <p>Không có bác sĩ nào trong danh sách</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
        >
          Trang trước
        </button>
        <span className={styles.paginationInfo}>Trang {page + 1}</span>
        <button
          className={styles.paginationButton}
          onClick={() => handlePageChange(page + 1)}
          disabled={doctors.length < pageSize}
        >
          Trang sau
        </button>
      </div>

      {/* Modal */}
      {id && (
        <Modal isOpen={!!id} onClose={handleCloseModal}>
          <DoctorDetails onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default DoctorList;