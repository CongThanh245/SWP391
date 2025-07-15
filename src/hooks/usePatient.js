import { useState, useEffect } from "react";

const usePatient = () => {
  const [patientId, setPatientId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkPatientId = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const id = user?.id;
      if (id) {
        setPatientId(id);
        setError("");
      } else {
      }
    };

    const timer = setTimeout(checkPatientId, 100);
    return () => clearTimeout(timer);
  }, []);

  return { patientId, error };
};

export default usePatient;