// src/components/TreatmentProgress.tsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@components/ui/button';
import { toast } from '@hooks/use-toast';
import { getPreparationStatus, handlePreParationStage  } from '@api/doctorApi'

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
    { key: 'preparation', name: 'Chuyên khoa'},
    { key: 'intervention', name: 'Can thiệp' },
    { key: 'postIntervention', name: 'Hậu can thiệp' },
  ], []);

  // State để lưu trạng thái hoàn thành của từng giai đoạn
  const [treatmentStages, setTreatmentStages] = useState<Record<string, boolean>>(() => {
    const initial = {};
    stages.forEach(stage => {
      initial[stage.key] = initialStages[stage.key] || false;
    });
    return initial;
  });
  const [isLoadingInitialStatus, setIsLoadingInitialStatus] = useState<boolean>(true);
  const [errorInitialStatus, setErrorInitialStatus] = useState<Error | null>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  useEffect(() => {
    const fetchPreparationStatus = async () => {
      if (!patientId) {
        setIsLoadingInitialStatus(false);
        return;
      }
      setIsLoadingInitialStatus(true);
      setErrorInitialStatus(null);
      try {
        const data = await getPreparationStatus(patientId);
        const isPreparationCompletedFromApi = data.status === "COMPLETED";
        console.log(isPreparationCompletedFromApi);

        setTreatmentStages(prev => {
          const updated = { ...prev, preparation: isPreparationCompletedFromApi };
          // Sau khi cập nhật preparation, tìm lại currentStageIndex
          const newFirstIncompleteIndex = stages.findIndex(stage => !updated[stage.key]);
          // Set currentStageIndex
          setCurrentStageIndex(newFirstIncompleteIndex === -1 ? stages.length : newFirstIncompleteIndex);
          return updated;
        });
      } catch (error: any) {
        setErrorInitialStatus(error);
        toast({
          title: "Lỗi tải trạng thái",
          description: `Không thể tải trạng thái giai đoạn Chuẩn bị: ${error.message || 'Lỗi không xác định'}`,
          variant: "destructive",
        });
      } finally {
        setIsLoadingInitialStatus(false);
      }
    };
    fetchPreparationStatus();
  }, [patientId, toast])

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

  //Lấy key của giai đoạn hiện tại
  const currentStageKey = useMemo(() => {
    if (currentStageIndex >= 0 && currentStageIndex < stages.length) {
      return stages[currentStageIndex].key;
    }
    return null;
  }, [currentStageIndex, stages])

  // Hàm kiểm tra một giai đoạn đã hoàn thành hay chưa
  const isStageCompleted = useCallback((stageKey: string) => {
    return treatmentStages[stageKey] || false;
  }, [treatmentStages]);

  // Hàm để hoàn thành một giai đoạn
  const completeStage = useCallback(async (stageKey: string, stageName: string) => {
    // Kiểm tra xem giai đoạn này có phải là giai đoạn hiện tại và chưa hoàn thành không
    // isLoadingInitialStatus cũng nên được kiểm tra để tránh hoàn thành khi chưa load xong
    if (isLoadingInitialStatus || currentStageKey !== stageKey || isStageCompleted(stageKey)) {
      toast({
        title: "Lỗi",
        description: `Không thể hoàn thành giai đoạn ${stageName} lúc này.`,
        variant: "destructive",
      });
      return;
    }
    try {
          if (stageKey === 'preparation') {
                // Gọi API để cập nhật trạng thái 'preparation' thành COMPLETED
                // Bạn cần một hàm API khác để set status từ "PLANNED" sang "COMPLETED"
                // Ví dụ: await updatePreparationStatusToCompleted(patientId);
                // Nếu không có API cụ thể cho việc này, thì bước này chỉ là cập nhật state
                // Giả sử có hàm API để cập nhật status:
                await handlePreParationStage(patientId); // Nếu hàm này làm thay đổi status lên COMPLETED
                toast({
                    title: "Lưu ý",
                    description: "Giai đoạn 'Chuyên khoa' (preparation) không có API hoàn thành riêng lẻ tại đây, vui lòng xem xét logic.",
                    variant: "default"
                });
              }
            // Thêm các điều kiện else if cho các giai đoạn khác nếu chúng có API riêng
            // else if (stageKey === 'specialty') {
            //     // await handleSpecialtyStageComplete(patientId); // Ví dụ API cho giai đoạn Chuyên khoa
            // }

            // Cập nhật trạng thái trong local state SAU KHI API thành công
            setTreatmentStages(prev => {
                const newStages = { ...prev, [stageKey]: true };
                // Sau khi hoàn thành một stage, cập nhật currentStageIndex lên stage tiếp theo
                const nextIndex = stages.findIndex(s => s.key === stageKey) + 1;
                setCurrentStageIndex(nextIndex < stages.length ? nextIndex : stages.length); // Move to next or 'completed' state

                onStageComplete?.(stageName, newStages); // Gọi callback nếu có
                return newStages;
            });

            // Hiển thị toast thành công
            toast({
                title: "Thành công",
                description: `Đã hoàn thành giai đoạn ${stageName}`,
            });

        } catch (error: any) {
            console.error(`Lỗi khi hoàn thành giai đoạn ${stageName}:`, error);
            // Hiển thị toast lỗi
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
      return false; // Không hiển thị nút nếu không cho phép hoặc đã hoàn thành
    }

    // Chỉ hiển thị nút complete cho giai đoạn hiện tại (hoặc giai đoạn chưa hoàn thành liền kề)
    const stageIndex = stages.findIndex(s => s.key === stageKey);
    if (stageIndex !== currentStage) {
      return false;
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