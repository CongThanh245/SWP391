import React from "react";
import { Filter, Calendar, RotateCcw } from "lucide-react";
import styles from "./AppointmentFilters.module.css";

const AppointmentFilters = ({ 
  filters, 
  onFilterChange, 
  appointmentsCount, 
  showDateFilters = false 
}) => {
  const dateFilterOptions = [
    { value: "all", label: "Tất cả" },
    { value: "today", label: "Hôm nay" },
    { value: "week", label: "7 ngày tới" },
    { value: "month", label: "30 ngày tới" },
    { value: "custom", label: "Tùy chọn" },
  ];

  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "CONFIRMED", label: "Đã xác nhận" },
    { value: "PENDING", label: "Chờ xác nhận" },
    { value: "COMPLETED", label: "Đã hoàn thành" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

  const handleDateFilterChange = (e) => {
    const newDateFilter = e.target.value;
    onFilterChange({ 
      dateFilter: newDateFilter,
      ...(newDateFilter !== "custom" && { fromDate: "", toDate: "" })
    });
  };

  const handleFromDateChange = (e) => {
    onFilterChange({ fromDate: e.target.value });
  };

  const handleToDateChange = (e) => {
    onFilterChange({ toDate: e.target.value });
  };

  const handleNearestDateChange = (e) => {
    onFilterChange({ nearestDate: e.target.checked });
  };

  const handleStatusChange = (e) => {
    onFilterChange({ status: e.target.value });
  };

  const handleDateChange = (e) => {
    onFilterChange({ date: e.target.value });
  };

  const handleResetFilters = () => {
    onFilterChange({
      dateFilter: "all",
      fromDate: "",
      toDate: "",
      nearestDate: false,
      status: "",
      date: "",
    });
  };

  const hasActiveFilters = filters.dateFilter !== "all" || filters.fromDate || filters.toDate || filters.nearestDate || filters.status || filters.date;

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

        <div className={styles.filterGroup}>
          <select
            className={styles.select}
            value={filters.status}
            onChange={handleStatusChange}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.nearestDate || false}
              onChange={handleNearestDateChange}
            />
            <span>Ngày gần nhất</span>
          </label>
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.dateInputGroup}>
            <label className={styles.dateLabel}>Ngày nhất định:</label>
            <input
              type="date"
              className={styles.dateInput}
              value={filters.date || ""}
              onChange={handleDateChange}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            className={styles.resetButton}
            onClick={handleResetFilters}
          >
            <RotateCcw size={14} />
            Đặt lại
          </button>
        )}

        {(filters.dateFilter !== "all" || filters.status || filters.nearestDate || filters.date) && (
          <span className={styles.activeFilter}>
            Đang lọc: {filters.dateFilter !== "all" && dateFilterOptions.find(opt => opt.value === filters.dateFilter)?.label} 
            {filters.status && `, ${statusOptions.find(opt => opt.value === filters.status)?.label}`} 
            {filters.nearestDate && ", Ngày gần nhất"} 
            {filters.date && `, Ngày ${filters.date}`}
          </span>
        )}

        <div className={styles.resultsCount}>
          Tìm thấy <strong>{appointmentsCount}</strong> lịch hẹn
        </div>
      </div>

      {showDateFilters && filters.dateFilter === "custom" && (
        <div className={styles.customDateRow}>
          <div className={styles.dateInputGroup}>
            <label className={styles.dateLabel}>Từ ngày:</label>
            <input
              type="date"
              className={styles.dateInput}
              value={filters.fromDate}
              onChange={handleFromDateChange}
            />
          </div>
          <div className={styles.dateInputGroup}>
            <label className={styles.dateLabel}>Đến ngày:</label>
            <input
              type="date"
              className={styles.dateInput}
              value={filters.toDate}
              onChange={handleToDateChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentFilters;