import React from 'react';
import { User, Edit2 } from 'lucide-react';
import styles from './ProfileCard.module.css';
import Button from '@components/common/Button/Button';

const ProfileCard = ({ user, onEdit }) => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.avatar}>
          <User size={40} />
        </div>
        <div className={styles.info}>
          <div className={styles.header}>
            <div className={styles.userInfo}>
              <h2 className={styles.name}>{user.name}</h2>
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