// components/AppointmentFilters.jsx
import React from "react";
import styles from "./AppointmentFilters.module.css";

const AppointmentFilters = ({ filters, onFilterChange, appointmentsCount }) => {
  const statusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ xác nhận" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "completed", label: "Hoàn thành" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  const handleStatusFilterChange = (e) => {
    onFilterChange({ statusFilter: e.target.value });
  };

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersRow}>
        {/* Filter Icon và Label */}
        <div className={styles.filterLabel}>
          <span>Xem theo:</span>
        </div>

        {/* Status Filter */}
        <div className={styles.filterGroup}>
          <select
            className={styles.select}
            value={filters.statusFilter}
            onChange={handleStatusFilterChange}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {/* Results Count */}
        <div className={styles.resultsCount}>
          Bạn có <strong>{appointmentsCount}</strong> lịch hẹn
        </div>
      </div>
    </div>
  );
};

export default AppointmentFilters;
