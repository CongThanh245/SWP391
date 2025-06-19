import React from 'react';
import { Calendar, Phone, Mail, MapPin, User, Heart, Edit2, ShieldAlert } from 'lucide-react';
import Button from '../../../../components/common/Button/Button';
import styles from './PatientInfo.module.css';

const PatientInfo = ({ user, onEdit }) => {
  const infoItems = [
    { icon: Calendar, label: 'Ngày sinh', value: user.birthDate },
    { icon: MapPin, label: 'Địa chỉ', value: user.address },
    { icon: Phone, label: 'Số điện thoại', value: user.phone },
    { icon: User, label: 'Giới tính', value: user.gender },
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Heart, label: 'Tình trạng hôn nhân', value: user.maritalStatus },
    { icon: ShieldAlert, label: 'Người liên hệ khẩn cấp', value: user.emergencyContact}
  ];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Thông tin cá nhân</h3>
        <Button variant="secondary" onClick={onEdit}>
          <Edit2 size={16} className={styles.editIcon} />
          Chỉnh sửa
        </Button>
      </div>

      <div className={styles.grid}>
        {infoItems.map((item, index) => (
          <div key={index} className={styles.infoItem}>
            <item.icon size={20} className={styles.icon} />
            <div className={styles.infoContent}>
              <div className={styles.label}>{item.label}</div>
              <div className={styles.value}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientInfo;