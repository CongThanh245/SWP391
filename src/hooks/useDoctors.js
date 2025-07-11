// src/hooks/useDoctors.js
import { useState, useEffect } from "react";
import { getAdminDoctors, getDoctorDetails, getDoctors } from "@api/doctorApi";

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

export const useDoctorDetails = (doctorId) => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (!doctorId) return;
      setLoading(true);
      try {
        const data = await getDoctorDetails(doctorId);
        const mappedDoctor = {
          id: data.doctorId,
          name: data.doctorName,
          specialization: data.specialization,
          phone: data.phone,
          yearOfExperience: data.yearOfExperience,
          degree: data.degree,
          licenseNumber: data.licenseNumber,
          gender: data.gender,
          address: data.doctorAddress,
          about: data.about,
          image: data.imageProfile,
        };
        setDoctor(mappedDoctor);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  return { doctor, loading, error };
};