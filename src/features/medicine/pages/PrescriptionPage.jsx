import React, { useState, useEffect } from 'react';
import { getAllPrescriptions } from '@api/patientResultApi';

const PrescriptionsPage = ({ patientId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await getAllPrescriptions(patientId);
        setPrescriptions(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load prescriptions');
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [patientId]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  if (prescriptions.length === 0) return <div className="text-center p-4">No prescriptions available</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Patient Prescriptions</h1>
      {prescriptions.map((p, index) => (
        <div key={index} className="mb-6 border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">
            {p.type === 'ovulationTrigger' && 'Ovulation Trigger'}
            {p.type === 'ovarianStimulation' && 'Ovarian Stimulation'}
            {p.type === 'endometrialPreparation' && 'Endometrial Preparation'}
            {p.type === 'embryoTransfer' && 'Embryo Transfer'}
          </h2>
          <p>Date Issued: {p.prescription.dateIssued}</p>
          <p>Notes: {p.prescription.notes}</p>
          <h3 className="font-medium mt-2">Medications</h3>
          {p.prescription.items.map((item, i) => (
            <div key={i} className="ml-4">
              <p>Medication ID: {item.medicationId}</p>
              <p>Dosage: {item.dosage}</p>
              <p>Frequency: {item.frequency}</p>
              <p>Duration: {item.duration}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PrescriptionsPage;