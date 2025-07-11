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
  }, [JSON.stringify(params)]); 

  return { doctors, pagination, loading, error }; 
};



export const useAdminDoctors = (params = {}) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const data = await getAdminDoctors(params);
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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [JSON.stringify(params)]); 

  return { doctors, loading, error };
};
