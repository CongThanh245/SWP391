import React, { useState } from 'react';
import styles from '../../../pages/guest/ServicesPage.module.css';

const ServiceInfo = ({ service }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'process', label: 'Quy trình' },
    { id: 'preparation', label: 'Chuẩn bị' },
    { id: 'notes', label: 'Lưu ý' }
  ];

  return (
    <div className={styles.serviceSection}>
      <div className={styles.serviceHeader}>
        <div className={styles.serviceIcon}>
          {service.icon}
        </div>
        <div className={styles.serviceTitleGroup}>
          <h2 className={styles.serviceTitle}>{service.title}</h2>
          <p className={styles.serviceShortDesc}>{service.shortDescription}</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsNav}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'overview' && (
            <div className={styles.tabPanel}>
              <h3 className={styles.contentTitle}>Định nghĩa và ứng dụng</h3>
              <p className={styles.contentText}>{service.definition}</p>
              <h4 className={styles.contentSubtitle}>Chỉ định điều trị:</h4>
              <ul className={styles.contentList}>
                {service.indications.map((indication, index) => (
                  <li key={index} className={styles.listItem}>{indication}</li>
                ))}
              </ul>
              <h4 className={styles.contentSubtitle}>Ưu điểm:</h4>
              <ul className={styles.contentList}>
                {service.advantages.map((advantage, index) => (
                  <li key={index} className={styles.listItem}>{advantage}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'process' && (
            <div className={styles.tabPanel}>
              <h3 className={styles.contentTitle}>Quy trình thực hiện</h3>
              <div className={styles.processSteps}>
                {service.process.map((step, index) => (
                  <div key={index} className={styles.processStep}>
                    <div className={styles.stepNumber}>{index + 1}</div>
                    <div className={styles.stepContent}>
                      <h4 className={styles.stepTitle}>{step.title}</h4>
                      <p className={styles.stepDescription}>{step.description}</p>
                      {step.duration && (
                        <span className={styles.stepDuration}>{step.duration}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preparation' && (
            <div className={styles.tabPanel}>
              <h3 className={styles.contentTitle}>Chuẩn bị trước điều trị</h3>
              <div className={styles.preparationGrid}>
                <div className={styles.preparationCard}>
                  <h4 className={styles.preparationTitle}>Cho nữ giới</h4>
                  <ul className={styles.preparationList}>
                    {service.preparation.female.map((item, index) => (
                      <li key={index} className={styles.preparationItem}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.preparationCard}>
                  <h4 className={styles.preparationTitle}>Cho nam giới</h4>
                  <ul className={styles.preparationList}>
                    {service.preparation.male.map((item, index) => (
                      <li key={index} className={styles.preparationItem}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className={styles.preparationCard}>
                <h4 className={styles.preparationTitle}>Giấy tờ cần thiết</h4>
                <ul className={styles.preparationList}>
                  {service.preparation.documents.map((doc, index) => (
                    <li key={index} className={styles.preparationItem}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className={styles.tabPanel}>
              <h3 className={styles.contentTitle}>Lưu ý quan trọng</h3>
              <div className={styles.notesGrid}>
                <div className={styles.noteCard}>
                  <h4 className={styles.noteTitle}>Trước điều trị</h4>
                  <ul className={styles.notesList}>
                    {service.notes.before.map((note, index) => (
                      <li key={index} className={styles.noteItem}>{note}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.noteCard}>
                  <h4 className={styles.noteTitle}>Trong quá trình</h4>
                  <ul className={styles.notesList}>
                    {service.notes.during.map((note, index) => (
                      <li key={index} className={styles.noteItem}>{note}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.noteCard}>
                  <h4 className={styles.noteTitle}>Sau điều trị</h4>
                  <ul className={styles.notesList}>
                    {service.notes.after.map((note, index) => (
                      <li key={index} className={styles.noteItem}>{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceInfo;