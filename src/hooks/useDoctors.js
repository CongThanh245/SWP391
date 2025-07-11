// src/hooks/useDoctors.js
import { useState, useEffect } from "react";
import { getAdminDoctors, getDoctors } from "@api/doctorApi";

export const useDoctors = (params = {}) => {
  const [doctors, setDoctors] = useState([]);
  const [pagination, setPagination] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const data = await getDoctors(params);
        // Map API response data to component-friendly format
        const mappedDoctors = data.content.map((doctor) => ({
          id: doctor.doctorId,
          name: doctor.doctorName,
          specialization: doctor.specialization,
          phone: doctor.phone,
          yearOfExperience: doctor.yearOfExperience,
          degree: doctor.degree,
          licenseNumber: doctor.licenseNumber,
          gender: doctor.gender,
          address: doctor.doctorAddress,
          about: doctor.about,
        }));
        setDoctors(mappedDoctors);
        // Set pagination data
        setPagination({
          totalPages: data.totalPages || 1,
          totalElements: data.totalElements || 0,
          currentPage: data.number || 0,
          size: data.size || params.size || 10,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [JSON.stringify(params)]); // Re-run when params change

  return { doctors, pagination, loading, error }; // Include pagination in return
};

// src/hooks/useDoctors.js

export const useAdminDoctors = (params = {}) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const data = await getAdminDoctors(params);
        // Ánh xạ dữ liệu từ API response sang định dạng components sử dụng
        const mappedDoctors = data.content.map((doctor) => ({
          id: doctor.doctorId,
          name: doctor.doctorName, // Ánh xạ doctorName → name
          specialization: doctor.specialization,
          phone: doctor.phone,
          yearOfExperience: doctor.yearOfExperience, // Không phải yearsOfExperience
          degree: doctor.degree,
          licenseNumber: doctor.licenseNumber,
          gender: doctor.gender,
          address: doctor.doctorAddress, // Ánh xạ doctorAddress → address
          about: doctor.about,
        }));
        setDoctors(mappedDoctors);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [JSON.stringify(params)]); // Tái chạy khi params thay đổi

  return { doctors, loading, error };
};
