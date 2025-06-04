import React, { useState } from "react";
import { Search, User, Phone, Calendar } from "lucide-react";
import styles from "./PatientList.module.css";

const PatientList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const patients = [
    {
      id: "P001",
      name: "Nguyễn Văn A",
      phone: "0123456789",
      lastVisit: "2024-12-01",
      status: "active"
    },
    {
      id: "P002", 
      name: "Trần Thị B",
      phone: "0987654321",
      lastVisit: "2024-11-28",
      status: "inactive"
    }
  ];

  return (
    <div className={styles.patientListPage}>
      <div className={styles.pageHeader}>
        <h2>Danh sách Bệnh nhân</h2>
        <p>Quản lý thông tin bệnh nhân</p>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchBox}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm bệnh nhân..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.patientGrid}>
        {patients.map((patient) => (
          <div key={patient.id} className={`${styles.patientCard} ${styles[patient.status]}`}>
            <div className={`${styles.statusBadge} ${styles[patient.status]}`}>
              {patient.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
            </div>
            <div className={styles.patientInfo}>
              <User size={24} />
              <div>
                <h4>{patient.name}</h4>
                <p>ID: {patient.id}</p>
              </div>
            </div>
            <div className={styles.patientDetails}>
              <div className={styles.detail}>
                <Phone size={16} />
                <span>{patient.phone}</span>
              </div>
              <div className={styles.detail}>
                <Calendar size={16} />
                <span>Lần cuối: {patient.lastVisit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientList;