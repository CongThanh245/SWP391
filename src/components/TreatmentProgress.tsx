// src/components/TreatmentProgress.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@components/ui/button';

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
  initialStages = { specialty: false, intervention: false, postIntervention: false },
}: UseTreatmentProgressProps) => {
  // Định nghĩa các giai đoạn cố định của tiến trình
  const stages: Stage[] = useMemo(() => [
    { key: 'specialty', name: 'Chuyên Khoa' },
    { key: 'intervention', name: 'Can thiệp' },
    { key: 'postIntervention', name: 'Hậu can thiệp' },
  ], []);

  // State để lưu trạng thái hoàn thành của từng giai đoạn
  const [treatmentStages, setTreatmentStages] = useState<Record<string, boolean>>(initialStages);

  // Tính toán số giai đoạn đã hoàn thành
  const completedStages = useMemo(() => {
    return Object.values(treatmentStages).filter(Boolean).length;
  }, [treatmentStages]);

  // Xác định index của giai đoạn hiện tại (active stage)
  const currentStage = useMemo(() => {
    // Tìm giai đoạn chưa hoàn thành đầu tiên
    const firstIncompleteIndex = stages.findIndex(stage => !treatmentStages[stage.key]);
    // Nếu tất cả đã hoàn thành, thì currentStage có thể là index cuối cùng + 1,
    // hoặc bạn có thể định nghĩa một trạng thái "hoàn tất".
    return firstIncompleteIndex === -1 ? stages.length - 1 : firstIncompleteIndex;
  }, [stages, treatmentStages]);


  // Hàm kiểm tra một giai đoạn đã hoàn thành hay chưa
  const isStageCompleted = useCallback((stageKey: string) => {
    return treatmentStages[stageKey] || false;
  }, [treatmentStages]);

  // Hàm để hoàn thành một giai đoạn
  const completeStage = useCallback((stageKey: string, stageName: string) => {
    setTreatmentStages(prev => {
      const newStages = { ...prev, [stageKey]: true };
      onStageComplete?.(stageName, newStages); // Gọi callback nếu có
      return newStages;
    });
  }, [onStageComplete]);

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
                    ? 'bg-green-500 text-white border-green-500 shadow-lg' 
                    : currentStage === index 
                      ? 'bg-blue-500 text-white border-blue-500 shadow-md' 
                      : 'bg-white text-gray-600 border-gray-300'}`}
              >
                {isStageCompleted(stage.key) ? '✓' : index + 1}
              </div>
              <span className={`text-xs mt-2 text-center font-medium max-w-20 leading-tight
                  ${isStageCompleted(stage.key) 
                    ? 'text-green-600' 
                    : currentStage === index 
                      ? 'text-blue-600' 
                      : 'text-gray-500'}`}
              >
                {stage.name}
              </span>
            </div>
            
            {index < stages.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 transition-all duration-300
                  ${isStageCompleted(stage.key) ? 'bg-green-500' : 'bg-gray-300'}`} 
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
      return null; // Không hiển thị nút nếu không cho phép hoặc đã hoàn thành
    }

    // Chỉ hiển thị nút complete cho giai đoạn hiện tại (hoặc giai đoạn chưa hoàn thành liền kề)
    const stageIndex = stages.findIndex(s => s.key === stageKey);
    if (stageIndex !== currentStage) {
        return null;
    }

    return (
      <div className="flex justify-end pt-4">
        <Button
          onClick={() => completeStage(stageKey, stageName)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
        >
          Hoàn thành giai đoạn {stageName}
        </Button>
      </div>
    );
  };

  return {
    ProgressBar: ProgressBarComponent, // Trả về component UI
    CompleteButton: CompleteButtonComponent, // Trả về component UI
    isStageCompleted,
    completedStages,
    currentStage,
    treatmentStages, // Trạng thái của các stage
    stages, // Danh sách các stage
    completeStage // Hàm để cập nhật stage
  };
};