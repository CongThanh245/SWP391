import {useState, useMemo, useEffect } from "react"; // Add useEffect
import { Link, useParams, useNavigate } from "react-router-dom";
import DoctorCard from "@features/doctor/components/DoctorCard/DoctorCard";
import DoctorDetails from "@features/doctor/components/DoctorDetails/DoctorDetails";
import styles from "./DoctorPage.module.css";
import { useDoctors } from "@hooks/useDoctors";

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.modalCloseButton} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

const DoctorsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [page, setPage] = useState(0);
  const size = 10;
  const [allSpecializations, setAllSpecializations] = useState([]); // New state for all specializations

  const { doctors, pagination, loading, error } = useDoctors({
    search: searchTerm || undefined,
    specialization: selectedFilter !== "all" ? selectedFilter : undefined,
    page,
    size,
  });

  // Populate allSpecializations when doctors data is first loaded (no filters)
  useEffect(() => {
    if (doctors && selectedFilter === "all" && !searchTerm) {
      const specs = doctors?.map((doctor) => doctor.specialization).filter(Boolean) || [];
      const uniqueSpecs = [...new Set(specs)];
      // Only update if allSpecializations is empty or different
      if (
        allSpecializations.length === 0 ||
        JSON.stringify(allSpecializations) !== JSON.stringify(uniqueSpecs)
      ) {
        setAllSpecializations(uniqueSpecs);
      }
    }
  }, [doctors, selectedFilter, searchTerm, allSpecializations]);

  // Remove the dynamic specializations memo since we'll use allSpecializations
  // const specializations = useMemo(() => {
  //   const specs = doctors?.map((doctor) => doctor.specialization).filter(Boolean) || [];
  //   return [...new Set(specs)];
  // }, [doctors]);

  const handleCloseModal = () => {
    navigate("/doctors");
  };

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
          Hiển thị {doctors.length} bác sĩ
          {searchTerm && ` cho "${searchTerm}"`}
        </p>
      </div>

      {/* Doctors Grid */}
      {doctors.length > 0 ? (
        <div className={styles.doctorsGrid}>
          {doctors.map((doctor) => (
            <Link
              key={doctor.id}
              to={`/doctors/${doctor.id}`}
              className={styles.doctorCardLink}
            >
              <DoctorCard doctor={doctor} />
            </Link>
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

      {id && (
        <Modal isOpen={!!id} onClose={handleCloseModal}>
          <DoctorDetails onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default DoctorsPage;