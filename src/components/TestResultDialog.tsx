// @components/ResultDisplayModal.tsx

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@components/ui/dialog';
import { ScrollArea } from '@components/ui/scroll-area';
import {Button} from '@components/ui/button';
import { CircleDotDashed, XCircle } from 'lucide-react';

// ================================================================
// CẬP NHẬT INTERFACE CHO PROPS
// ================================================================
interface TestParameter {
  name: string;
  targetValue: number | null;
  currentValue: number;
  measurementUnit: string;
  description: string;
}

interface DetailedTestResult {
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
   const testNameForTitle = isLoading
    ? "Đang tải..."
    : resultData && resultData.parameters.length > 0
      ? resultData.parameters[0].name // Lấy tên từ parameter đầu tiên
      : "N/A"; // Nếu không có dữ liệu hoặc parameters rỗng
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col bg-white p-6 rounded-lg shadow-xl border border-[color:var(--card-border)]"> {/* Thêm style giống card */}
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-2 text-[color:var(--text-accent)]">
            Kết quả xét nghiệm: {testNameForTitle}
          </DialogTitle>
          <DialogDescription className="text-[color:var(--text-secondary)]">
            Chi tiết kết quả của xét nghiệm đã hoàn thành.
          </DialogDescription>
        </DialogHeader>

        {/* ================================================================ */}
        {/* NỘI DUNG CHÍNH CỦA MODAL VỚI TRANG TRÍ */}
        {/* ================================================================ */}
        <ScrollArea className="flex-grow p-4 mt-4 -mx-4"> {/* Đã điều chỉnh padding và margin âm */}
          <div className="space-y-4 px-4"> {/* Thêm padding ngang vào đây */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-40 text-[color:var(--text-secondary)]">
                <CircleDotDashed className="w-8 h-8 animate-spin text-[color:var(--deep-taupe)] mb-3" />
                <p>Đang tải kết quả...</p>
              </div>
            ) : resultData && Array.isArray(resultData.parameters) && resultData.parameters.length > 0 ? (
              // Hiển thị từng thông số xét nghiệm
              resultData.parameters.map((param, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md border border-gray-200"> {/* Mỗi thông số trong một "card" nhỏ */}
                  <h4 className="font-semibold text-base mb-2 text-[color:var(--text-accent)]">{param.name}</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-[color:var(--text-secondary)]">
                      <span className="font-medium">Giá trị hiện tại:</span>{' '}
                      {param.currentValue !== null ? `${param.currentValue} ${param.measurementUnit}` : 'N/A'}
                    </p>
                    <p className="text-[color:var(--text-secondary)]">
                      <span className="font-medium">Giá trị mục tiêu:</span>{' '}
                      {param.targetValue !== null ? `${param.targetValue} ${param.measurementUnit}` : 'N/A'}
                    </p>
                    {param.description && (
                      <p className="text-xs text-gray-500 mt-2 italic">
                        {param.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // Trường hợp không có dữ liệu
              <div className="flex flex-col items-center justify-center h-40 text-red-500">
                <XCircle className="w-8 h-8 mb-3" />
                <p className="text-center">
                  {resultData && Array.isArray(resultData.parameters) && resultData.parameters.length === 0
                    ? "Không có thông số chi tiết nào cho xét nghiệm này."
                    : "Không có dữ liệu kết quả chi tiết."
                  }
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Nút Đóng */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={onClose}
            className="bg-[color:var(--button-primary-bg)] hover:bg-[color:var(--button-hover-bg)] text-[color:var(--button-primary-text)] px-6 py-2 rounded-md"
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultDisplayModal;