// DoctorsPage.jsx
import React, { useState, useMemo } from "react";
import DoctorCard from "@features/doctor/components/DoctorCard/DoctorCard";
import styles from "./DoctorPage.module.css";
import { useDoctors } from "@hooks/useDoctors";

const DoctorsPage = () => {
  const { doctors, loading, error } = useDoctors();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const activeDoctors = useMemo(() => {
    return doctors.filter((doctor) => doctor.active === true);
  }, [doctors]);

  // Lọc theo chuyên khoa và tìm kiếm
  const filteredDoctors = useMemo(() => {
    let filtered = activeDoctors;

    // Lọc theo chuyên khoa
    if (selectedFilter !== "all") {
      filtered = filtered.filter((doctor) =>
        doctor.specialization
          ?.toLowerCase()
          .includes(selectedFilter.toLowerCase())
      );
    }

    // Tìm kiếm theo tên
    if (searchTerm) {
      filtered = filtered.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [activeDoctors, selectedFilter, searchTerm]);

  // Lấy danh sách chuyên khoa unique
  const specializations = useMemo(() => {
    const specs = activeDoctors
      .map((doctor) => doctor.specialization)
      .filter(Boolean);
    return [...new Set(specs)];
  }, [activeDoctors]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Đang tải thông tin bác sĩ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Có lỗi xảy ra</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div className={styles.titleContainer}>
          <h1 className={styles.pageTitle}>Đội Ngũ Chuyên Gia</h1>
          <p className={styles.pageSubtitle}>
            Đội ngũ bác sĩ giàu kinh nghiệm, tận tâm chăm sóc sức khỏe sinh sản
            của bạn
          </p>
        </div>

        {/* Statistics */}
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{activeDoctors.length}</span>
            <span className={styles.statLabel}>Bác sĩ</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {activeDoctors.reduce(
                (sum, doctor) => sum + (doctor.yearsOfExperience || 0),
                0
              )}
              +
            </span>
            <span className={styles.statLabel}>Năm kinh nghiệm</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{specializations.length}</span>
            <span className={styles.statLabel}>Chuyên khoa</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className={styles.filterSection}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm bác sĩ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4d3c2d"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-search-icon lucide-search"
            className={styles.searchIcon}
          >
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
        </div>

        <div className={styles.filterContainer}>
          <button
            className={`${styles.filterButton} ${
              selectedFilter === "all" ? styles.active : ""
            }`}
            onClick={() => setSelectedFilter("all")}
          >
            Tất cả
          </button>
          {specializations.map((spec, index) => (
            <button
              key={index}
              className={`${styles.filterButton} ${
                selectedFilter === spec ? styles.active : ""
              }`}
              onClick={() => setSelectedFilter(spec)}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className={styles.resultsInfo}>
        <p>
          Hiển thị {filteredDoctors.length} bác sĩ
          {searchTerm && ` cho "${searchTerm}"`}
        </p>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length > 0 ? (
        <div className={styles.doctorsGrid}>
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>👨‍⚕️</div>
          <h3>Không tìm thấy bác sĩ</h3>
          <p>
            {searchTerm
              ? `Không tìm thấy bác sĩ nào với tên "${searchTerm}"`
              : "Không có bác sĩ nào trong chuyên khoa này"}
          </p>
          <button
            className={styles.clearButton}
            onClick={() => {
              setSearchTerm("");
              setSelectedFilter("all");
            }}
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;
