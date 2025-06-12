// AppointmentSchedulePage.jsx
import React, { useState, useMemo } from "react";
import { useAppointments } from "@hooks/useAppointments";
import AppointmentFilters from "@features/appointment/components/AppointmentFilters/AppointmentFilters";
import AppointmentListPatient from "@features/appointment/components/AppointmentListPatient/AppointmentListPatient";
import styles from "./AppointmentSchedulePage.module.css";

const AppointmentSchedulePage = ({ patientId }) => {
  const { appointments, isLoading, error } = useAppointments({
    filterByPatientId: patientId,
  });

  const [filters, setFilters] = useState({
    statusFilter: "all",
  });

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      if (filters.statusFilter !== "all" && appointment.status !== filters.statusFilter) {
        return false;
      }
      return true;
    });
  }, [appointments, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠️</span>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Lịch hẹn của tôi</h1>
      </header>

      <AppointmentFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        appointmentsCount={filteredAppointments.length}
      />

      <main className={styles.content}>
        <div className={styles.contentHeader}>
          <h2 className={styles.sectionTitle}>Lịch hẹn - Tất cả</h2>
        </div>

        <AppointmentListPatient
          appointments={filteredAppointments}
          isLoading={isLoading}
          activeTab={filters.statusFilter}
        />
      </main>
    </div>
  );
};

export default AppointmentSchedulePage;