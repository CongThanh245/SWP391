// components/InterventionWife/InterventionWife.tsx
import React, { useEffect, useState } from 'react';
import { getPatientInterventionType } from '@api/doctorInterventionApi';
import { Loader2 } from 'lucide-react'; // Assuming you use Loader2 icon
import OvarianStimulationProtocolCard from './InterventionWife/OvarianStimulationProtocolCard';
import FollicularMonitoringCard from './InterventionWife/FollicularMonitoringCard'

// ... (other imports)

interface InterventionWifeProps {
    patientId: string;
}

const InterventionWife: React.FC<InterventionWifeProps> = ({ patientId }) => {
    const [interventionType, setInterventionType] = useState<string | null>(null);
    const [isLoadingInterventionType, setIsLoadingInterventionType] = useState(true);
    const [errorInterventionType, setErrorInterventionType] = useState<string | null>(null);

    useEffect(() => {
        const fetchInterventionType = async () => {
            setIsLoadingInterventionType(true);
            setErrorInterventionType(null);
            try {
                const type = await getPatientInterventionType(patientId);
                setInterventionType(type);
            } catch (error) {
                console.error("Failed to fetch intervention type:", error);
                setErrorInterventionType("Không thể tải loại can thiệp.");
                setInterventionType('None'); // Fallback
            } finally {
                setIsLoadingInterventionType(false);
            }
        };

        // Ensure patientId exists before fetching
        if (patientId) {
            fetchInterventionType();
        }

        // DEPENDENCY ARRAY: This effect should ONLY re-run if patientId changes.
        // It should NOT re-run when interventionType state changes, as that's its own output.
    }, [patientId]); // <--- This is the key fix!

    return (
        <div className="space-y-6">
            {isLoadingInterventionType ? (
                <div className="text-center text-[color:var(--text-secondary)] py-4">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-[color:var(--deep-taupe)] mb-2" />
                    Đang tải loại can thiệp...
                </div>
            ) : errorInterventionType ? (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 text-center rounded-lg mb-4">
                    Lỗi: {errorInterventionType}
                </div>
            ) : (
                <>
                    {interventionType === 'IVF' && (
                        <>
                          
                        </>
                    )}
                    {interventionType === 'IUI' && (
                        <>
                             { <OvarianStimulationProtocolCard patientId={patientId} />}
                             { <FollicularMonitoringCard patientId={patientId} />}
                        </>
                    )}
                    {interventionType === 'None' && (
                        <p className="text-center text-[color:var(--text-secondary)]">
                            Chưa có loại can thiệp nào được xác định cho bệnh nhân này.
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

export default InterventionWife;