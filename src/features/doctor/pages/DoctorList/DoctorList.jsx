import React from "react";
import { User, Phone } from "lucide-react";
import { useDoctors } from "@hooks/useDoctors";
import { Link } from "react-router-dom";
import styles from "./DoctorList.module.css";

const DoctorList = () => {
  const { doctors, loading, error } = useDoctors();

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
        {doctors.map((doctor) => (
          <div key={doctor.id} className={styles.doctorCard}>
            <div className={styles.doctorAvatar}>
              <User size={32} />
            </div>
            <div className={styles.doctorInfo}>
              <h4>{doctor.id}</h4>
              <h3>{doctor.name}</h3>
              <p>{doctor.specialization}</p>
              <div className={styles.doctorDetails}>
                <div className={styles.detail}>
                  <Phone size={16} />
                  <span>{doctor.phone}</span>
                </div>
              </div>
              <Link
                to={`/receptionist-dashboard/doctor/${doctor.id}`}
                className={styles.viewDetailsButton}
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
