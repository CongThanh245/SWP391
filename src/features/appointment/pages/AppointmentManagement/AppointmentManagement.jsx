import React, { useState, useMemo } from "react";
import styles from "./AppointmentManagement.module.css";
import AppointmentFilterTabs from "../../components/AppointmentFilterTabs/AppointmentFilterTabs";
import AppointmentList from "../../components/AppointmentList/AppointmentList";

const AppointmentManagement = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  // Sample data - trong thực tế sẽ fetch từ API
  const allAppointments = [
    {
      id: "A001",
      patientName: "Nguyễn Văn A",
      phone: "0123456789",
      date: "2024-12-15",
      time: "14:30",
      status: "upcoming"
    },
    {
      id: "A002",
      patientName: "Trần Thị B",
      phone: "0987654321",
      date: "2024-12-15",
      time: "15:00",
      status: "upcoming"
    },
    {
      id: "A003",
      patientName: "Lê Văn C",
      phone: "0912345678",
      date: "2024-12-14",
      time: "10:00",
      status: "completed"
    },
    {
      id: "A004",
      patientName: "Phạm Thị D",
      phone: "0908765432",
      date: "2024-12-13",
      time: "16:30",
      status: "completed"
    },
    {
      id: "A005",
      patientName: "Hoàng Văn E",
      phone: "0934567890",
      date: "2024-12-12",
      time: "09:00",
      status: "cancelled"
    }
  ];

  // Filtered appointments based on active tab
  const filteredAppointments = useMemo(() => {
    return allAppointments.filter(appointment => appointment.status === activeTab);
  }, [activeTab, allAppointments]);

  // Count appointments by status
  const appointmentCounts = useMemo(() => {
    return {
      upcoming: allAppointments.filter(app => app.status === 'upcoming').length,
      completed: allAppointments.filter(app => app.status === 'completed').length,
      cancelled: allAppointments.filter(app => app.status === 'cancelled').length
    };
  }, [allAppointments]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  return (
    <div className={styles.appointmentPage}>
      <div className={styles.pageHeader}>
        <h2>Quản lý bệnh nhân đặt lịch</h2>
        <p>Xem và quản lý tất cả lịch hẹn theo trạng thái</p>
      </div>
      
      <AppointmentFilterTabs 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        appointmentCounts={appointmentCounts}
      />
      
      <AppointmentList 
        appointments={filteredAppointments}
        activeTab={activeTab}
      />
    </div>
  );
};

export default AppointmentManagement;