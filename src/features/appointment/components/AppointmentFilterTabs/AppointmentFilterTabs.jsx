import React from "react";
import styles from "./AppointmentFilterTabs.module.css";

const AppointmentFilterTabs = ({ activeTab, onTabChange, appointmentCounts }) => {
  const tabs = [
    { 
      key: 'upcoming', 
      label: 'Sắp tới', 
      count: appointmentCounts.upcoming,
      color: 'blue'
    },
    { 
      key: 'completed', 
      label: 'Hoàn thành', 
      count: appointmentCounts.completed,
      color: 'green'
    },
    { 
      key: 'cancelled', 
      label: 'Đã hủy', 
      count: appointmentCounts.cancelled,
      color: 'red'
    }
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