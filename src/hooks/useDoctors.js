import { getDoctors } from '@api/doctorApi';
import { useState, useEffect } from 'react';

export const useDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await getDoctors();
        const mappedData = data.map((doctor) => ({
          id: doctor.doctor_id,
          name: doctor.doctor_name,
          phone: doctor.phone,
          licenseNumber: doctor.license_number,
          degree: doctor.degree,
          specialization: doctor.specialization,
          about: doctor.about,
          address: doctor.doctor_address,
          gender: doctor.gender,
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