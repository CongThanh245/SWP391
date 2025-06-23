// @components/ResultDisplayModal.tsx

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@components/ui/dialog';
import { ScrollArea } from '@components/ui/scroll-area';

// ================================================================
// CẬP NHẬT INTERFACE CHO PROPS
// ================================================================
interface TestParameter {
  name: string;
  targetValue: number;
  currentValue: number;
  measurementUnit: string;
  description: string;
}

interface DetailedTestResult {
  testName: string;
  parameters: TestParameter[];
}

interface ResultDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  // testName: string; // Có thể lấy từ resultData.testName
  resultData: DetailedTestResult | null; // Dữ liệu kết quả chi tiết
  isLoading: boolean; // THÊM TRẠNG THÁI LOADING
}

const ResultDisplayModal: React.FC<ResultDisplayModalProps> = ({ isOpen, onClose, resultData, isLoading }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col"> {/* Tăng kích thước nếu cần */}
        <DialogHeader>
          <DialogTitle>
            {isLoading ? "Đang tải kết quả..." : `Kết quả xét nghiệm: ${resultData?.testName || 'N/A'}`}
          </DialogTitle>
          <DialogDescription>
            {isLoading ? "Vui lòng chờ." : "Chi tiết kết quả của xét nghiệm đã hoàn thành."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow p-4 border rounded-md mt-4 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">Đang tải...</p>
              {/* Thêm spinner hoặc loading animation nếu có */}
            </div>
          ) : resultData && resultData.parameters && resultData.parameters.length > 0 ? (
            <div className="space-y-4">
              {resultData.parameters.map((param, index) => (
                <div key={index} className="border-b pb-2 last:border-b-0">
                  <h4 className="font-semibold text-base text-[color:var(--text-accent)]">{param.name}</h4>
                  <p className="text-sm text-[color:var(--text-secondary)]">
                    <span className="font-medium">Giá trị hiện tại:</span> {param.currentValue} {param.measurementUnit}
                  </p>
                  <p className="text-sm text-[color:var(--text-secondary)]">
                    <span className="font-medium">Giá trị mục tiêu:</span> {param.targetValue} {param.measurementUnit}
                  </p>
                  {param.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {param.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Không có dữ liệu kết quả chi tiết.</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ResultDisplayModal;