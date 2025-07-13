import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@components/ui/button';
import { toast } from '@hooks/use-toast';
import {
    getPreparationStatus,
    handlePreParationStage,
    getInterventionStageStatus,
    completeInterventionStage,
    getPostInterventionStageStatus,  
    completePostInterventionStage 
} from '@api/doctorApi' // Make sure these are correctly imported from your API file
import { Check } from 'lucide-react';

// Định nghĩa các kiểu dữ liệu cần thiết
interface Stage {
    key: string;
    name: string;
}

interface UseTreatmentProgressProps {
    patientId: string | number; // Hoặc kiểu dữ liệu phù hợp
    onStageComplete?: (stageName: string, newStages: Record<string, boolean>) => void;
    showButtons?: boolean;
    initialStages?: Record<string, boolean>; // Ví dụ: { specialty: true, intervention: false }
}

// Đây là custom hook
export const useTreatmentProgress = ({
    patientId,
    onStageComplete,
    showButtons = false,
    initialStages = {},
}: UseTreatmentProgressProps) => {
    // Định nghĩa các giai đoạn cố định của tiến trình
    const stages: Stage[] = useMemo(() => [
        { key: 'preparation', name: 'Chuyên khoa' },
        { key: 'intervention', name: 'Can thiệp' },
        { key: 'postIntervention', name: 'Hậu can thiệp' },
    ], []);

    // State để lưu trạng thái hoàn thành của từng giai đoạn
    const [treatmentStages, setTreatmentStages] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        stages.forEach(stage => {
            initial[stage.key] = initialStages[stage.key] || false;
        });
        return initial;
    });
    const [isLoadingInitialStatus, setIsLoadingInitialStatus] = useState<boolean>(true);
    const [errorInitialStatus, setErrorInitialStatus] = useState<Error | null>(null);
    const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);

    // Initial fetch for preparation status
    useEffect(() => {
        const fetchAllStageStatuses = async () => {
            if (!patientId) {
                setIsLoadingInitialStatus(false);
                return;
            }
            setIsLoadingInitialStatus(true);
            setErrorInitialStatus(null);
            try {
                const id = String(patientId);

                // Fetch all statuses concurrently
                const [
                    preparationData,
                    interventionData,
                    postInterventionData
                ] = await Promise.all([
                    getPreparationStatus(id).catch(e => {
                        console.error("Failed to fetch preparation status:", e);
                        // Return a default status if API fails for this stage
                        return { status: "ERROR" };
                    }),
                    getInterventionStageStatus(id).catch(e => {
                        console.error("Failed to fetch intervention status:", e);
                        return { status: "ERROR" };
                    }),
                    getPostInterventionStageStatus(id).catch(e => {
                        console.error("Failed to fetch post-intervention status:", e);
                        return { status: "ERROR" };
                    })
                ]);

                setTreatmentStages(prev => {
                    const updated = {
                        ...prev,
                        preparation: preparationData.status === "COMPLETED",
                        // Assuming "COMPLETED" is the status for a finished stage
                        intervention: interventionData.status === "COMPLETED",
                        postIntervention: postInterventionData.status === "COMPLETED",
                    };

                    // Find the new currentStageIndex based on all fetched statuses
                    const newFirstIncompleteIndex = stages.findIndex(stage => !updated[stage.key]);
                    setCurrentStageIndex(newFirstIncompleteIndex === -1 ? stages.length : newFirstIncompleteIndex);
                    return updated;
                });

            } catch (error) {
                setErrorInitialStatus(error);
                toast({
                    title: "Lỗi tải trạng thái tiến trình",
                    description: `Không thể tải toàn bộ trạng thái tiến trình: ${error.message || 'Lỗi không xác định'}`,
                    variant: "destructive",
                });
            } finally {
                setIsLoadingInitialStatus(false);
            }
        };
        fetchAllStageStatuses();
    }, [patientId, toast, stages]); 

    // Calculate completed stages
    const completedStages = useMemo(() => {
        return Object.values(treatmentStages).filter(Boolean).length;
    }, [treatmentStages]);

    // Determine the index of the current active stage
    const currentStage = useMemo(() => {
        const firstIncompleteIndex = stages.findIndex(stage => !treatmentStages[stage.key]);
        return firstIncompleteIndex === -1 ? stages.length - 1 : firstIncompleteIndex;
    }, [stages, treatmentStages]);

    // Get the key of the current stage
    const currentStageKey = useMemo(() => {
        if (currentStageIndex >= 0 && currentStageIndex < stages.length) {
            return stages[currentStageIndex].key;
        }
        return null;
    }, [currentStageIndex, stages]);

    // Check if a stage is completed
    const isStageCompleted = useCallback((stageKey: string) => {
        return treatmentStages[stageKey] || false;
    }, [treatmentStages]);

    // Function to complete a stage with API integration
    const completeStage = useCallback(async (stageKey: string, stageName: string) => {
        if (isLoadingInitialStatus || currentStageKey !== stageKey || isStageCompleted(stageKey)) {
            toast({
                title: "Lỗi",
                description: `Không thể hoàn thành giai đoạn ${stageName} lúc này. Vui lòng hoàn thành các bước trước đó.`,
                variant: "destructive",
            });
            return;
        }

        try {
            // Convert patientId to string if your API expects it
            const id = String(patientId);

            if (stageKey === 'preparation') {
                await handlePreParationStage(id); // Call API for 'preparation'
                // No specific toast needed here, as the success toast below will cover it.
            } else if (stageKey === 'intervention') {
                await completeInterventionStage(id); // NEW: Call API for 'intervention'
            } else if (stageKey === 'postIntervention') {
                await completePostInterventionStage(id); // NEW: Call API for 'postIntervention'
            }
            // Add more else if conditions for other specific stages if needed

            // Update local state AFTER API call succeeds
            setTreatmentStages(prev => {
                const newStages = { ...prev, [stageKey]: true };
                const nextIndex = stages.findIndex(s => s.key === stageKey) + 1;
                setCurrentStageIndex(nextIndex < stages.length ? nextIndex : stages.length);

                onStageComplete?.(stageName, newStages);
                return newStages;
            });

            toast({
                title: "Thành công",
                description: `Đã hoàn thành giai đoạn ${stageName}`,
            });

        } catch (error) {
            console.error(`Lỗi khi hoàn thành giai đoạn ${stageName}:`, error);
            toast({
                title: "Lỗi",
                description: `Không thể hoàn thành giai đoạn ${stageName}: ${error.message || 'Lỗi không xác định'}`,
                variant: "destructive",
            });
        }

    }, [patientId, currentStageKey, isStageCompleted, onStageComplete, toast, stages, isLoadingInitialStatus]);

    // Component ProgressBar (UI)

    const ProgressBarComponent: React.FC = () => (
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Tiến trình điều trị</span>
                <span className="text-sm text-gray-500">
                    {completedStages}/{stages.length} giai đoạn hoàn thành
                </span>
            </div>

            <div className="flex items-center w-full">
                {stages.map((stage, index) => (
                    <React.Fragment key={stage.key}>
                        <div className="flex flex-col items-center flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 border-2
                                ${isStageCompleted(stage.key)
                                    ? 'bg-[#1B9C85] text-white border-[#1B9C85] shadow-lg'
                                    : currentStage === index
                                        ? 'bg-[#6C9BCF] text-white border-[#6C9BCF] shadow-md'
                                        : 'bg-white text-gray-600 border-gray-300'}`}
                            >
                                {isStageCompleted(stage.key) ? <Check className="w-4 h-4 text-white inline" /> : index + 1}
                            </div>
                            <span className={`text-xs mt-2 text-center font-medium max-w-20 leading-tight
                                ${isStageCompleted(stage.key)
                                    ? 'text-[#1B9C85]'
                                    : currentStage === index
                                        ? 'text-[#6C9BCF]'
                                        : 'text-gray-500'}`}
                            >
                                {stage.name}
                            </span>
                        </div>

                        {index < stages.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-4 transition-all duration-300
                                ${isStageCompleted(stage.key) ? 'bg-[#1B9C85]' : 'bg-gray-300'}`}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );

    // Component CompleteButton (UI)
    const CompleteButtonComponent: React.FC<{ stageKey: string; stageName: string }> = ({ stageKey, stageName }) => {
        if (!showButtons || isStageCompleted(stageKey)) {
            return null; // Don't render if not allowed or already completed
        }

        // Only show complete button for the current active stage (first incomplete one)
        const stageIndex = stages.findIndex(s => s.key === stageKey);
        if (stageIndex !== currentStageIndex) { // Use currentStageIndex from state
            return null;
        }

        return (
            <div className="flex justify-end pt-4">
                <Button
                    onClick={() => completeStage(stageKey, stageName)}
                    className="bg-[#1B9C85] hover:bg-[#21B297] text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 active:scale-95"
                >
                    Hoàn thành giai đoạn {stageName}
                </Button>
            </div>
        );
    };

    return {
        ProgressBar: ProgressBarComponent,
        CompleteButton: CompleteButtonComponent,
        isStageCompleted,
        completedStages,
        currentStage,
        treatmentStages,
        stages,
        completeStage,
        isLoadingInitialStatus, // Expose loading state
        errorInitialStatus,     // Expose error state
    };
};