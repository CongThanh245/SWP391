import React, { useState, useEffect } from 'react';
import { getAllPatientResults } from '@api/patientResultApi';

const PatientResultsPage = ({ patientId }) => {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getAllPatientResults(patientId);
        setResults(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load patient results');
        setLoading(false);
      }
    };
    fetchResults();
  }, [patientId]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  if (!results) return <div className="text-center p-4">No data available</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Patient Results</h1>

      {/* Giai đoạn Khám chuyên khoa */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Pre-Intervention (Khám chuyên khoa)</h2>
        <div className="border p-4 rounded">
          <h3 className="font-medium">Vital Signs</h3>
          <p>Wife: Height {results.preIntervention.vitalSigns.wife.wifeHeight} cm, Weight {results.preIntervention.vitalSigns.wife.wifeWeight} kg, BMI {results.preIntervention.vitalSigns.wife.wifeBmi}</p>
          <p>Husband: Height {results.preIntervention.vitalSigns.husband.husbandHeight} cm, Weight {results.preIntervention.vitalSigns.husband.husbandWeight} kg, BMI {results.preIntervention.vitalSigns.husband.husbandBmi}</p>
          <h3 className="font-medium mt-2">Preparation Notes</h3>
          <p>{results.preIntervention.preparationNotes.preparationNotes}</p>
          <h3 className="font-medium mt-2">Protocols</h3>
          {results.preIntervention.protocol.map((p, index) => (
            <p key={index}>{p.protocolName}: {p.currentValue}/{p.targetValue} (Evaluated: {p.evaluationDate})</p>
          ))}
        </div>
      </div>

      {/* Giai đoạn Can thiệp */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Intervention (Can thiệp)</h2>
        <div className="border p-4 rounded">
          <h3 className="font-medium">Follicular Monitoring</h3>
          {results.intervention.follicularMonitoring.map((f, index) => (
            <p key={f.id}>Date: {f.actionDate}, Follicle Count: {f.follicleCount}, Size: {f.follicleSize} mm, Status: {f.status}</p>
          ))}
          <h3 className="font-medium mt-2">Intrauterine Insemination</h3>
          <p>Status: {results.intervention.intrauterineInsemination.status}, Date: {results.intervention.intrauterineInsemination.actionDate}</p>
          <h3 className="font-medium mt-2">Oocyte Retrieval</h3>
          <p>Total Oocytes: {results.intervention.oocyteRetrieval.totalOocytesRetrieved}, Status: {results.intervention.oocyteRetrieval.status}</p>
          <h3 className="font-medium mt-2">Sperm Processing</h3>
          <p>Method: {results.intervention.spermProcessing.processingMethod}, Density: {results.intervention.spermProcessing.spermDensity}</p>
          <h3 className="font-medium mt-2">Ovulation Trigger</h3>
          <p>Status: {results.intervention.ovulationTrigger.status}, Start Date: {results.intervention.ovulationTrigger.startDate}</p>
          <h3 className="font-medium mt-2">Ovarian Stimulation</h3>
          <p>Status: {results.intervention.ovarianStimulation.status}, Start Date: {results.intervention.ovarianStimulation.startDate}</p>
          <h3 className="font-medium mt-2">Endometrial Preparation</h3>
          <p>Status: {results.intervention.endometrialPreparation.status}, Start Date: {results.intervention.endometrialPreparation.startDate}</p>
          <h3 className="font-medium mt-2">Embryo Transfer</h3>
          <p>Status: {results.intervention.embryoTransfer.status}, Date: {results.intervention.embryoTransfer.actionDate}</p>
        </div>
      </div>

      {/* Giai đoạn Hậu can thiệp */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Post-Intervention (Hậu can thiệp)</h2>
        <div className="border p-4 rounded">
          <h3 className="font-medium">Notes</h3>
          <p>{results.postIntervention.interventionStageNotes.notes}</p>
          <h3 className="font-medium mt-2">Post-Intervention Update</h3>
          <p>Beta hCG: {results.postIntervention.postInterventionUpdate.betaHcgResult}, Outcome: {results.postIntervention.postInterventionUpdate.evaluationOutcome}</p>
        </div>
      </div>
    </div>
  );
};

export default PatientResultsPage;