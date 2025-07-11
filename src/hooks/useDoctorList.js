// src/hooks/useDoctorList.js
import { useState, useEffect } from "react";
import { getDoctorList } from "@api/doctorApi";

export const useDoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorList = async () => {
      setLoading(true);
      try {
        const data = await getDoctorList();
        const mappedDoctors = data.map((doctor) => ({
          id: doctor.id, 
          name: doctor.doctorName, 
        }));
        setDoctors(mappedDoctors);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorList();
  }, []);

  return { doctors, loading, error };
};