// components/InterventionWife/InterventionWife.tsx
import React, { useEffect, useState } from 'react';
import { getPatientInterventionType } from '@api/doctorInterventionApi';
import { Loader2 } from 'lucide-react'; // Assuming you use Loader2 icon
import OvarianStimulationProtocolCard from './InterventionWife/OvarianStimulationProtocolCard';
import FollicularMonitoringCard from './InterventionWife/FollicularMonitoringCard'
import IntraUterineInseminationProcessCard from './InterventionWife/IntraUterineInseminationProcessCard'
import OvulationTriggerInjectionCard from './InterventionWife/OvulationTriggerInjectionCard'
import EndometrialPreparationCard from './InterventionWife/EndometrialPreparationCard'
import EmbryoTransferCard from './InterventionWife/EmbryoTransferCard'
import OocyteRetrievalProcedureCard from './InterventionWife/OocyteRetrievalProcedureCard'
import { getInterventionStageNotes, updateInterventionStageNotes } from '@api/doctorInterventionApi'
import { Button } from '@components/ui/button';

// ... (other imports)

interface InterventionWifeProps {
    patientId: string;
}

const InterventionWife: React.FC<InterventionWifeProps> = ({ patientId }) => {
    const [interventionType, setInterventionType] = useState<string | null>(null);
    const [isLoadingInterventionType, setIsLoadingInterventionType] = useState(true);
    const [errorInterventionType, setErrorInterventionType] = useState<string | null>(null);

    const [followUpNotes, setFollowUpNotes] = useState<string>('');
    const [isLoadingSaveNotes, setIsLoadingSaveNotes] = useState(false);
    const [errorSaveNotes, setErrorSaveNotes] = useState<string | null>(null);
    const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchInterventionType = async () => {
            setIsLoadingInterventionType(true);
            setErrorInterventionType(null);
            try {
                const type = await getPatientInterventionType(patientId);
                setInterventionType(type);
                const notesString: string = await getInterventionStageNotes(patientId);
                setFollowUpNotes(notesString || '');
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

    const handleSaveNotes = async () => {
        setIsLoadingSaveNotes(true);
        setErrorSaveNotes(null);
        setSaveSuccessMessage(null);
        try {
            await updateInterventionStageNotes(patientId, followUpNotes);
            setSaveSuccessMessage("Ghi chú đã được lưu thành công!");
            // Optionally, clear the success message after a few seconds
            setTimeout(() => setSaveSuccessMessage(null), 3000);
        } catch (error) {
            console.error("Failed to save notes:", error);
            setErrorSaveNotes("Lỗi khi lưu ghi chú. Vui lòng thử lại.");
        } finally {
            setIsLoadingSaveNotes(false);
        }
    };



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
                            {<OvulationTriggerInjectionCard patientId={patientId} />}
                            {<FollicularMonitoringCard patientId={patientId} />}
                            {<EndometrialPreparationCard patientId={patientId} />}
                            {<OocyteRetrievalProcedureCard patientId={patientId} />}
                            {<EmbryoTransferCard patientId={patientId} />}

                        </>
                    )}
                    {interventionType === 'IUI' && (
                        <>
                            {<OvarianStimulationProtocolCard patientId={patientId} />}
                            {<FollicularMonitoringCard patientId={patientId} />}
                            {<IntraUterineInseminationProcessCard patientId={patientId} />}

                            <div className="bg-[color:var(--card-background)] p-6 rounded-lg shadow-sm border border-[color:var(--card-border)]">
                                <label htmlFor="followUpNotes" className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">
                                    Ghi chú thêm cho bệnh nhân:
                                </label>
                                <textarea
                                    id="followUpNotes" // Add an ID for accessibility
                                    value={followUpNotes}
                                    onChange={(e) => setFollowUpNotes(e.target.value)}
                                    className="w-full p-3 border border-[color:var(--card-border)] rounded-md resize-none focus:border-[color:var(--deep-taupe)] focus:outline-none text-[color:var(--text-primary)] bg-[color:var(--input-background)]"
                                    rows={3}
                                    placeholder="Ví dụ: Cần nhịn ăn 8 tiếng trước khi tái khám, mang theo kết quả xét nghiệm..."
                                />
                                <div className="mt-4 flex flex-col sm:flex-row items-center justify-end gap-2">
                                    {isLoadingSaveNotes && (
                                        <div className="flex items-center text-[color:var(--text-secondary)]">
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Đang lưu...
                                        </div>
                                    )}
                                    {errorSaveNotes && (
                                        <p className="text-red-500 text-sm">{errorSaveNotes}</p>
                                    )}
                                    {saveSuccessMessage && (
                                        <p className="text-green-500 text-sm">{saveSuccessMessage}</p>
                                    )}
                                    <Button
                                        onClick={handleSaveNotes}
                                        disabled={isLoadingSaveNotes} // Disable button while saving
                                        className="bg-[color:var(--button-primary-bg)] hover:bg-[color:var(--button-hover-bg)] text-[color:var(--button-primary-text)] px-8 py-2"

                                    >
                                        {isLoadingSaveNotes ? 'Đang lưu...' : 'Lưu Ghi Chú'}
                                    </Button>
                                </div>
                            </div>
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