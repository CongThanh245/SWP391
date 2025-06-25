import React, { useState, useMemo } from 'react';
import styles from './AppointmentManagement.module.css';
import AppointmentFilterTabs from '@features/appointment/components/AppointmentFilterTabs/AppointmentFilterTabs';
import AppointmentListReceptionist from '@features/appointment/components/AppointmentListReceptionist/AppointmentListReceptionist';
import { useAppointments } from '@hooks/useAppointments';

const AppointmentManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');


  const filters = useMemo(
    () => ({
      dateFilter: 'all',
      fromDate: '',
      toDate: '',
    }),
    [],
  );

  const { appointments, isLoading, error, refetchAppointments } = useAppointments({ filters });

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => appointment.status === activeTab);
  }, [activeTab, appointments]);

  const appointmentCounts = useMemo(() => {
    return {
      pending: appointments.filter((app) => app.status === 'pending').length,
      confirmed: appointments.filter((app) => app.status === 'confirmed').length,
      completed: appointments.filter((app) => app.status === 'completed').length,
      cancelled: appointments.filter((app) => app.status === 'cancelled').length,
    };
  }, [appointments]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  return (
    <div className={styles.appointmentPage}>
      <div className={styles.pageHeader}>
        <h2>Quản lý bệnh nhân đặt lịch</h2>
        <p>Xem và quản lý tất cả lịch hẹn theo trạng thái</p>
      </div>

      {isLoading && <p>Đang tải...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <AppointmentFilterTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        appointmentCounts={appointmentCounts}
      />

      <AppointmentListReceptionist
        appointments={filteredAppointments}
        isLoading={isLoading}
        activeTab={activeTab}
        refetchAppointments={refetchAppointments}
      />
    </div>
  );
};

export default AppointmentManagement;