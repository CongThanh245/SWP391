import React from "react";
import { Filter, RotateCcw } from "lucide-react";
import styles from "./AppointmentFilters.module.css";

const AppointmentFilters = ({ 
  filters, 
  onFilterChange, 
  appointmentsCount, 
  showDateFilters = false 
}) => {
  const dateFilterOptions = [
    { value: "all", label: "Tất cả cả lịch hẹn" },
    { value: "today", label: "Lịch hẹn hôm nay" },
    { value: "specific", label: "Chọn ngày cụ thể" },
  ];

  const handleDateFilterChange = (e) => {
    const newDateFilter = e.target.value;
    onFilterChange({ 
      dateFilter: newDateFilter,
      ...(newDateFilter !== "specific" && { specificDate: "" })
    });
  };

  const handleSpecificDateChange = (e) => {
    onFilterChange({ specificDate: e.target.value });
  };

  const handleResetFilters = () => {
    onFilterChange({
      dateFilter: "all",
      specificDate: "",
    });
  };

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersRow}>
        <div className={styles.filterLabel}>
          <Filter className={styles.filterIcon} size={16} />
          <span>Lọc theo:</span>
        </div>

        {showDateFilters && (
          <div className={styles.filterGroup}>
            <select
              className={styles.select}
              value={filters.dateFilter}
              onChange={handleDateFilterChange}
            >
              {dateFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {showDateFilters && filters.dateFilter === "specific" && (
          <div className={styles.filterGroup}>
            <div className={styles.dateInputGroup}>
              <label className={styles.dateLabel}>Chọn ngày:</label>
              <input
                type="date"
                className={styles.dateInput}
                value={filters.specificDate || ""}
                onChange={handleSpecificDateChange}
              />
            </div>
          </div>
        )}


        <div className={styles.resultsCount}>
          Tìm thấy <strong>{appointmentsCount}</strong> lịch hẹn
        </div>
      </div>
    </div>
  );
};

export default AppointmentFilters;