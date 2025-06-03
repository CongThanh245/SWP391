import React from "react";
import { User, Calendar, Phone } from "lucide-react";
import styles from "./DoctorList.module.css";

const DoctorList = () => {
  const doctors = [
    {
      id: "D001",
      name: "BS. Nguyễn Văn Khoa",
      specialty: "Sản phụ khoa",
      phone: "0123456789",
      schedule: "Thứ 2, 4, 6"
    },
    {
      id: "D002",
      name: "BS. Trần Thị Mai",
      specialty: "Hiếm muộn",
      phone: "0987654321", 
      schedule: "Thứ 3, 5, 7"
    }
  ];

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
              <h3>{doctor.name}</h3>
              <p>{doctor.specialty}</p>
              <div className={styles.doctorDetails}>
                <div className={styles.detail}>
                  <Phone size={16} />
                  <span>{doctor.phone}</span>
                </div>
                <div className={styles.detail}>
                  <Calendar size={16} />
                  <span>{doctor.schedule}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;