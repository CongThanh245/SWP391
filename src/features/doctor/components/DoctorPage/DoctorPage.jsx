import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DoctorCard from "@features/doctor/components/DoctorCard/DoctorCard";
import styles from "./DoctorPage.module.css";
import { useDoctors } from "@hooks/useDoctors";
import useDebounce from "@hooks/useDebounce";

const DoctorsPage = () => {
  const [inputValue, setInputValue] = useState("");
  const debouncedSearchTerm = useDebounce(inputValue, 500);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [page, setPage] = useState(0);
  const size = 10;
  const [allSpecializations, setAllSpecializations] = useState([]);

  const { doctors, pagination, loading, error } = useDoctors({
    search: debouncedSearchTerm || undefined,
    specialization: selectedFilter !== "all" ? selectedFilter : undefined,
    page,
    size,
  });

  const updateSpecializations = () => {
    if (!doctors || selectedFilter !== "all" || debouncedSearchTerm) return;

    const specializations = doctors
      .map((doctor) => doctor.specialization)
      .filter(Boolean);
    const uniqueSpecializations = [...new Set(specializations)];

    if (
      allSpecializations.length === 0 ||
      JSON.stringify(allSpecializations) !==
        JSON.stringify(uniqueSpecializations)
    ) {
      setAllSpecializations(uniqueSpecializations);
    }
  };

  useEffect(() => {
    updateSpecializations();
  }, [doctors, selectedFilter, debouncedSearchTerm, allSpecializations]);

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div className={styles.titleContainer}>
          <h1 className={styles.pageTitle}>Đội Ngũ Chuyên Gia</h1>
          <p className={styles.pageSubtitle}>
            Đội ngũ bác sĩ giàu kinh nghiệm, tận tâm
          </p>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className={styles.filterSection}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm bác sĩ..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={styles.searchInput}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4d3c2d"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
          {allSpecializations.map((spec, index) => (
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
          Hiện có {doctors.length} bác sĩ
          {debouncedSearchTerm && ` cho "${debouncedSearchTerm}"`}
        </p>
      </div>

      <div className={styles.contentSection}>
        {(() => {
          if (loading) {
            return (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Đang tải thông tin bác sĩ...</p>
              </div>
            );
          } else if (doctors.length > 0) {
            return (
              <div className={styles.doctorsGrid}>
                {doctors.map((doctor) => (
                    <DoctorCard doctor={doctor} />
                ))}
              </div>
            );
          } else {
            return (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>👨‍⚕️</div>
                <h3>Không tìm thấy bác sĩ</h3>
                <p>
                  {debouncedSearchTerm
                    ? `Không tìm thấy bác sĩ nào với tên "${debouncedSearchTerm}"`
                    : "Không có bác sĩ nào trong chuyên khoa này"}
                </p>
              </div>
            );
          }
        })()}
      </div>

      {/* Pagination */}
      {pagination?.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className={styles.pageButton}
          >
            Trước
          </button>
          <span>
            Trang {page + 1} / {pagination?.totalPages || 1}
          </span>
          <button
            disabled={page === (pagination?.totalPages || 1) - 1}
            onClick={() => setPage(page + 1)}
            className={styles.pageButton}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;
