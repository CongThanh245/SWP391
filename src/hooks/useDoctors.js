// src/hooks/useDoctors.js
import { useState, useEffect } from 'react';
import { getAdminDoctors, getDoctors } from '@api/doctorApi';

export const useDoctors = (params = {}) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const data = await getDoctors(params);
        // Ánh xạ dữ liệu từ API response sang định dạng components sử dụng
        const mappedDoctors = data.content.map(doctor => ({
          id: doctor.doctorId,
          name: doctor.doctorName,           // Ánh xạ doctorName → name
          specialization: doctor.specialization,
          phone: doctor.phone,
          yearOfExperience: doctor.yearOfExperience, // Không phải yearsOfExperience
          degree: doctor.degree,
          licenseNumber: doctor.licenseNumber,
          gender: doctor.gender,
          address: doctor.doctorAddress,     // Ánh xạ doctorAddress → address
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
        const mappedDoctors = data.content.map(doctor => ({
          id: doctor.doctorId,
          name: doctor.doctorName,           // Ánh xạ doctorName → name
          specialization: doctor.specialization,
          phone: doctor.phone,
          yearOfExperience: doctor.yearOfExperience, // Không phải yearsOfExperience
          degree: doctor.degree,
          licenseNumber: doctor.licenseNumber,
          gender: doctor.gender,
          address: doctor.doctorAddress,     // Ánh xạ doctorAddress → address
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