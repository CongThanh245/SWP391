// src/features/doctor/hooks/useDoctors.js
import { fetchDoctors } from '@api/doctorApi';
import { useState, useEffect } from 'react';


export const useDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await fetchDoctors();
        const mappedData = data.map((doctor) => ({
          name: doctor.doctor_name,
          title: doctor.degree,
          specialty: doctor.specialization,
          image: doctor.image || '/assets/images/bacsi.png',
          yearsOfExperience: doctor.year_of_experience,
        }));
        setDoctors(mappedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadDoctors();
  }, []);

  return { doctors, loading, error };
};