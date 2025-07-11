import React from 'react';
import { User, Edit2, Info } from 'lucide-react';
import styles from './ProfileCard.module.css';
import Button from '@components/common/Button/Button';

const ProfileCard = ({ user, onEdit }) => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isProfileComplete = storedUser.profileCompleted;

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.avatar}>
          <User size={40} />
        </div>
        <div className={styles.info}>
          <div className={styles.header}>
            <div className={styles.userInfo}>
              <div className={styles.nameContainer}>
                <h2 className={styles.name}>{user.name}</h2>
                <div className={styles.statusContainer}>
                  <span className={`${styles.statusBadge} ${isProfileComplete ? styles.complete : styles.incomplete}`}>
                    {isProfileComplete ? 'Hoàn thành' : 'Chưa hoàn thành'}
                  </span>
                  <div className={styles.tooltip}>
                    <Info size={14} className={styles.infoIcon} />
                    <span className={styles.tooltipText}>
                      {isProfileComplete 
                        ? 'Hồ sơ đã hoàn thành - Có thể đặt lịch hẹn' 
                        : 'Vui lòng điền đầy đủ thông tin để hoàn thành hồ sơ và đặt lịch hẹn'}
                    </span>
                  </div>
                </div>
              </div>
              <p className={styles.patientId}>
                Mã bệnh nhân: {user.patientId}
              </p>
              <p className={styles.joinDate}>
                Ngày tham gia: {user.joinDate}
              </p>
            </div>
            <Button variant="secondary" onClick={onEdit}>
              <Edit2 size={16} className={styles.editIcon} />
              Chỉnh sửa
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;