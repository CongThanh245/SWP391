import React from "react";
import styles from "./AppointmentFilterTabs.module.css";

const AppointmentFilterTabs = ({ activeTab, onTabChange, appointmentCounts }) => {
  const tabs = [
    {
      key: 'pending',
      label: 'Chờ xác nhận',
      count: appointmentCounts.pending,
      color: 'blue',
    },
    {
      key: 'confirmed',
      label: 'Đã xác nhận',
      count: appointmentCounts.confirmed,
      color: 'green',
    },
    {
      key: 'completed',
      label: 'Đã hoàn thành',
      count: appointmentCounts.completed,
      color: 'purple',
    },
    {
      key: 'cancelled',
      label: 'Đã hủy',
      count: appointmentCounts.cancelled,
      color: 'red',
    },
  ];

  return (
    <div className={styles.filterTabs}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`${styles.tab} ${activeTab === tab.key ? styles.active : ''} ${styles[tab.color]}`}
          onClick={() => onTabChange(tab.key)}
        >
          <span className={styles.tabLabel}>{tab.label}</span>
          <span className={styles.tabCount}>({tab.count})</span>
        </button>
      ))}
    </div>
  );
};

export default AppointmentFilterTabs;