import React, { useState, useMemo, useEffect } from "react";
import { useAppointments } from "@hooks/useAppointments";
import AppointmentFilters from "@features/appointment/components/AppointmentFilters/AppointmentFilters";
import AppointmentTable from "@features/appointment/components/AppointmentTable/AppointmentTable";
import { updateAppointmentStatus } from "@api/appointmentApi";
import styles from "./AppointmentSchedulePage.module.css";

const AppointmentSchedulePage = () => {
  const [filters, setFilters] = useState({
    dateFilter: "all",
    fromDate: "",
    toDate: "",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [showNoteModal, setShowNoteModal] = useState({
    open: false,
    content: "",
  });

  const { appointments, isLoading, error, refetchAppointments } = useAppointments({
    filters,
    role: "patient",
  });
  const [localAppointments, setLocalAppointments] = useState(appointments);

  useEffect(() => {
    setLocalAppointments(appointments);
  }, [appointments]);

  const dateFilterOptions = [
    { value: "all", label: "Tất cả" },
    { value: "today", label: "Hôm nay" },
    { value: "week", label: "7 ngày tới" },
    { value: "month", label: "30 ngày tới" },
    { value: "custom", label: "Tùy chọn" },
  ];

  const statusTabs = [
    { value: "all", label: "Tất cả", count: appointments.length },
    {
      value: "pending",
      label: "Chờ xác nhận",
      count: appointments.filter((a) => a.status === "pending").length,
    },
    {
      value: "confirmed",
      label: "Đã xác nhận",
      count: appointments.filter((a) => a.status === "confirmed").length,
    },
    {
      value: "cancelled",
      label: "Đã hủy",
      count: appointments.filter((a) => a.status === "cancelled").length,
    },
  ];

  const isDateInRange = (appointmentDate, filterType, fromDate, toDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const apptDate = new Date(appointmentDate);
    apptDate.setHours(0, 0, 0, 0);

    switch (filterType) {
      case "today":
        return apptDate.getTime() === today.getTime();
      case "week":
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        return apptDate >= today && apptDate <= nextWeek;
      case "month":
        const nextMonth = new Date(today);
        nextMonth.setDate(today.getDate() + 30);
        return apptDate >= today && apptDate <= nextMonth;
      case "custom":
        if (!fromDate && !toDate) return true;
        const from = fromDate ? new Date(fromDate) : new Date("1900-01-01");
        const to = toDate ? new Date(toDate) : new Date("2099-12-31");
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        return apptDate >= from && apptDate <= to;
      default:
        return true;
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      if (filters.dateFilter !== "all") {
        const appointmentDate = appointment.rawDateTime
          ? new Date(appointment.rawDateTime)
          : new Date(`${appointment.date}T${appointment.time || "00:00"}`);

        if (
          !isDateInRange(
            appointmentDate,
            filters.dateFilter,
            filters.fromDate,
            filters.toDate
          )
        ) {
          return false;
        }
      }
      return true;
    });
  }, [appointments, filters]);

  const filteredByTab =
    activeTab === "all"
      ? filteredAppointments
      : filteredAppointments.filter((a) => a.status === activeTab);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      setLocalAppointments((prevAppointments) =>
        prevAppointments.map((appt) =>
          appt.id === appointmentId ? { ...appt, status: "cancelled" } : appt
        )
      );
      await updateAppointmentStatus(appointmentId);
      await refetchAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      setLocalAppointments(appointments);
      throw error;
    }
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
        <p className={styles.subtitle}>
          Quản lý và theo dõi tất cả các cuộc hẹn của bạn
        </p>
      </header>

      <div className={styles.tabsContainer}>
        <div className={styles.tabsWrapper}>
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              className={`${styles.tabButton} ${
                activeTab === tab.value ? styles.tabActive : ""
              }`}
              onClick={() => setActiveTab(tab.value)}
              style={{
                "--tab-color":
                  statusConfig[tab.value]?.color || "var(--deep-taupe)",
              }}
            >
              <span className={styles.tabLabel}>{tab.label}</span>
              <span className={styles.tabCount}>{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filtersWrapper}>
        <AppointmentFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          appointmentsCount={filteredByTab.length}
          showDateFilters={true}
        />
      </div>

      <main className={styles.content}>
        <div className={styles.contentHeader}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Danh sách lịch hẹn</h2>
          </div>
          <p className={styles.resultsSummary}>
            {filteredByTab.length > 0
              ? `Hiển thị ${filteredByTab.length} lịch hẹn`
              : "Không có lịch hẹn nào"}
          </p>
        </div>

        <div className={styles.contentWrapper}>
          <AppointmentTable
            appointments={filteredByTab}
            isLoading={isLoading}
            onCancelAppointment={handleCancelAppointment}
            setShowNoteModal={setShowNoteModal}
          />
        </div>
      </main>

      {showNoteModal.open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Ghi chú đầy đủ</h3>
            <p className={styles.modalText}>{showNoteModal.content}</p>
            <button
              className={styles.modalCloseButton}
              onClick={() => setShowNoteModal({ open: false, content: "" })}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const statusConfig = {
  pending: { label: "Chờ xác nhận", color: "#f59e0b" },
  confirmed: { label: "Đã xác nhận", color: "#10b981" },
  cancelled: { label: "Đã hủy", color: "#ef4444" },
};

export default AppointmentSchedulePage;