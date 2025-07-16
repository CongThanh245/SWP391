import { useState, useEffect, useRef } from "react";
import DoctorCard from "@features/doctor/components/DoctorCard/DoctorCard";
import styles from "./DoctorPage.module.css";
import { useDoctors } from "@hooks/useDoctors";
import useDebounce from "@hooks/useDebounce";

const DoctorsPage = () => {
  const [inputValue, setInputValue] = useState("");
  const debouncedSearchTerm = useDebounce(inputValue, 500);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [page, setPage] = useState(0);
  const size = 5;
  const allSpecializations = ["IUI_SPECIALIST", "IVF_SPECIALIST"];
  const contentSectionRef = useRef(null);

  const { doctors, pagination, loading, error } = useDoctors({
    search: debouncedSearchTerm || undefined,
    specialization: selectedFilter !== "all" ? selectedFilter : undefined,
    page,
    size,
  });

  // Cuộn đến contentSection khi page thay đổi
  useEffect(() => {
    if (contentSectionRef.current) {
      contentSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [page]);

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

      {/* Doctors Section */}
      <div className={styles.contentSection} ref={contentSectionRef}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Đang tải thông tin bác sĩ...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p>Lỗi: {error}</p>
          </div>
        ) : doctors.length > 0 ? (
          <div className={styles.doctorsGrid}>
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>👨‍⚕️</div>
            <h3>Không tìm thấy bác sĩ</h3>
            <p>
              {debouncedSearchTerm
                ? `Không tìm thấy bác sĩ nào với tên "${debouncedSearchTerm}"`
                : "Không có bác sĩ nào trong chuyên khoa này"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className={`${styles.pageButton} ${
              page === 0 ? styles.disabled : ""
            }`}
          >
            Trước
          </button>
          <div className={styles.pageNumbers}>
            {Array.from({ length: pagination.totalPages }, (_, index) => (
              <button
                key={index}
                className={`${styles.pageNumber} ${
                  page === index ? styles.active : ""
                }`}
                onClick={() => setPage(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            disabled={page === pagination.totalPages - 1}
            onClick={() => setPage(page + 1)}
            className={`${styles.pageButton} ${
              page === pagination.totalPages - 1 ? styles.disabled : ""
            }`}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;
