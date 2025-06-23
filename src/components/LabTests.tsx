// @components/LabTests.tsx

import React, { useState } from 'react';
import { Card } from '@components/ui/card';
import { Checkbox } from '@components/ui/checkbox';
import { Button } from '@components/ui/button';
import { FileText } from 'lucide-react';
import { Badge } from '@components/ui/badge';
import ResultDisplayModal from './TestResultDialog';
import { getDetailedTestResult } from '@api/doctorApi';

// ================================================================
// ĐỒNG BỘ INTERFACE LabTest (NHƯ TRONG Treatment.tsx)
// ================================================================
interface LabTest {
  id: string; // ID cục bộ duy nhất
  name: string;
  checked: boolean;
  status: 'ordered' | 'pending' | 'completed' | 'failed' | 'not-ordered';
  protocolId?: string; // PHẢI CÓ protocolId
  protocolType?: 'MEDICATION' | 'MONITORING'; // Đã đổi 'TEST' thành 'MONITORING' để đồng bộ
}

// ================================================================
// THÊM INTERFACE CHO DỮ LIỆU KẾT QUẢ CHI TIẾT (GIỐNG ResultDisplayModal)
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

interface LabTestsProps {
  title: string;
  tests: LabTest[];
  onTestsChange: React.Dispatch<React.SetStateAction<LabTest[]>>;
}

const LabTests: React.FC<LabTestsProps> = ({ title, tests, onTestsChange }) => {
  const [showResultModal, setShowResultModal] = useState(false);
  const [currentDetailedResult, setCurrentDetailedResult] = useState<DetailedTestResult | null>(null);
  const [isLoadingResult, setIsLoadingResult] = useState(false);

  // Đổi tên từ handleCheckboxChange thành handleTestChange để khớp với UI cũ bạn cung cấp
  const handleTestChange = (testId: string, checked: boolean) => {
    onTestsChange(prev =>
      prev.map(test =>
        test.id === testId
          ? { ...test, checked }
          : test
      )
    );
  };

  // ================================================================
  // Cập nhật hàm handleViewResult (BẤT ĐỒNG BỘ)
  // ================================================================
  const handleViewResult = async (test: LabTest) => {
    if (test.status === 'completed' && test.protocolId) {
      setIsLoadingResult(true);
      setShowResultModal(true);
      setCurrentDetailedResult(null); // Xóa dữ liệu cũ trong modal

      try {
        const result = await getDetailedTestResult(test.protocolId); // GỌI API MỚI
        setCurrentDetailedResult(result);
      } catch (error) {
        console.error('Failed to fetch detailed test result:', error);
        // Hiển thị thông báo lỗi trong modal
        setCurrentDetailedResult({
          testName: test.name,
          parameters: [{
            name: "Lỗi",
            targetValue: 0,
            currentValue: 0,
            measurementUnit: "",
            description: "Không thể tải kết quả chi tiết. Vui lòng thử lại."
          }]
        });
      } finally {
        setIsLoadingResult(false); // Kết thúc loading
      }
    } else if (test.status === 'completed' && !test.protocolId) {
        // Trường hợp completed nhưng thiếu protocolId (lỗi dữ liệu backend/đồng bộ)
        alert(`Không thể xem kết quả cho "${test.name}". Thiếu ID xét nghiệm (Protocol ID).`);
    } else {
      console.warn(`Kết quả của "${test.name}" chưa sẵn sàng. Trạng thái: ${test.status}`);
      // Có thể hiển thị toast hoặc cảnh báo nhỏ cho người dùng
      // Ví dụ: toast({ title: "Thông báo", description: "Kết quả chưa có sẵn." });
    }
  };


  const handleCloseResultModal = () => {
    setShowResultModal(false);
    setCurrentDetailedResult(null);
    setIsLoadingResult(false); // Reset loading state
  };

  // Helper để lấy Badge trạng thái (giữ nguyên từ bản cập nhật trước)
  const getStatusBadge = (status: LabTest['status']) => {
    switch (status) {
      case 'ordered':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Đã đặt</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Đang chờ</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Hoàn thành</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Thất bại</Badge>;
      case 'not-ordered':
      default:
        return null;
    }
  };


  return (
    <>
      <Card className="p-6 bg-white border border-[color:var(--card-border)]">
        <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-accent)]">
          {title} - Chỉ định và Kết quả xét nghiệm
        </h3>
        <div className="space-y-3">
          {tests.length > 0 ? (
            tests.map((test) => (
              <div key={test.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <Checkbox
                    id={test.id}
                    checked={test.checked}
                    onCheckedChange={(checked) => handleTestChange(test.id, !!checked)}
                    className="data-[state=checked]:bg-[color:var(--deep-taupe)] data-[state=checked]:border-[color:var(--deep-taupe)]"
                  />
                  <label
                    htmlFor={test.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                  >
                    {test.name}
                  </label>
                </div>
                {/* ================================================================ */}
                {/* LOGIC HIỂN THỊ NÚT "XEM KẾT QUẢ" CÓ ĐIỀU KIỆN - Cập nhật */}
                {/* ================================================================ */}
                <div className="flex items-center space-x-2"> {/* Thêm div để chứa badge và button */}
                    {getStatusBadge(test.status)} {/* Hiển thị badge trạng thái */}

                    <Button
                        onClick={() => handleViewResult(test)}
                        variant="outline"
                        size="sm"
                        className="ml-3 border-[color:var(--card-border)] text-[color:var(--text-secondary)] hover:bg-[color:var(--hover-accent)] hover:text-[color:var(--deep-taupe)]"
                        // Nút chỉ được kích hoạt nếu trạng thái là 'completed' VÀ CÓ protocolId
                        disabled={test.status !== 'completed' || !test.protocolId || isLoadingResult}
                    >
                        <FileText className="w-4 h-4 mr-1" />
                        {test.status === 'completed' && test.protocolId
                            ? 'Xem kết quả'
                            : 'Chưa có kết quả'}
                    </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[color:var(--text-secondary)]">
              Không có xét nghiệm nào trong danh sách.
            </p>
          )}
        </div>
        {/* The "Add" button and input section is completely removed here */}
      </Card>

      {/* ================================================================ */}
      {/* TRUYỀN DỮ LIỆU VÀ TRẠNG THÁI LOADING VÀO POPUP */}
      {/* ================================================================ */}
      <ResultDisplayModal
        isOpen={showResultModal}
        onClose={handleCloseResultModal}
        resultData={currentDetailedResult}
        isLoading={isLoadingResult}
      />
    </>
  );
};

export default LabTests;