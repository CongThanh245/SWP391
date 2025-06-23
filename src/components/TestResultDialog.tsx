// TestResultDialog.tsx (Example - your actual implementation might differ)
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@components/ui/dialog';
import { Label } from '@components/ui/label';
import { Input } from '@components/ui/input';
// Assuming you have a component to display PDF/image if resultData is a URL
import { Separator } from '@components/ui/separator';
import {Button} from '@components/ui/button'

interface TestResult {
  testValue: string;
  unit: string;
  referenceRange: string;
  diagnosis: string;
}

interface TestResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  testName: string;
  initialResultData?: string; // Could be a URL or a JSON string/object
  // onSave?: (results: TestResult) => void; // Removed if no longer saving
}

const TestResultDialog: React.FC<TestResultDialogProps> = ({ isOpen, onClose, testName, initialResultData }) => {
  const [displayedResult, setDisplayedResult] = useState<TestResult | null>(null);
  const [loadingResult, setLoadingResult] = useState(false);
  const [errorResult, setErrorResult] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && initialResultData) {
      setLoadingResult(true);
      setErrorResult(null);
      // Example: If initialResultData is a URL to a JSON, fetch it
      // If it's directly a JSON string/object, parse it.
      try {
        // Assume initialResultData is a URL to a JSON file for this example
        // In a real app, you might fetch a PDF/image or structured JSON
        fetch(initialResultData)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch result data');
            }
            return response.json(); // Or response.blob() for files
          })
          .then(data => {
            setDisplayedResult(data); // Assuming data matches TestResult structure
            setLoadingResult(false);
          })
          .catch(err => {
            console.error("Error fetching test result:", err);
            setErrorResult("Không thể tải kết quả xét nghiệm.");
            setLoadingResult(false);
          });
      } catch (e) {
        setErrorResult("Dữ liệu kết quả không hợp lệ.");
        setLoadingResult(false);
      }
    } else if (!isOpen) {
      setDisplayedResult(null); // Clear data when dialog closes
      setLoadingResult(false);
      setErrorResult(null);
    }
  }, [isOpen, initialResultData]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Kết quả xét nghiệm: {testName}</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về kết quả xét nghiệm này.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {loadingResult && <p>Đang tải kết quả...</p>}
          {errorResult && <p className="text-red-500">{errorResult}</p>}
          {displayedResult && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="testValue" className="text-right">
                  Giá trị
                </Label>
                <Input id="testValue" value={displayedResult.testValue} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit" className="text-right">
                  Đơn vị
                </Label>
                <Input id="unit" value={displayedResult.unit} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="referenceRange" className="text-right">
                  Khoảng tham chiếu
                </Label>
                <Input id="referenceRange" value={displayedResult.referenceRange} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="diagnosis" className="text-right">
                  Chẩn đoán
                </Label>
                <Input id="diagnosis" value={displayedResult.diagnosis} readOnly className="col-span-3" />
              </div>
              {/* If resultData can be a URL to a PDF/image, you'd render an iframe or img here */}
              {initialResultData && initialResultData.startsWith('http') && (
                  <div className="mt-4">
                      <Separator className="my-4" />
                      <h4 className="text-md font-semibold mb-2">Tài liệu đính kèm:</h4>
                      {/* Render based on file type. Example for PDF: */}
                      <iframe src={initialResultData} className="w-full h-96 border rounded" title="Test Result Document"></iframe>
                      {/* Or for image: <img src={initialResultData} alt="Result" className="max-w-full h-auto" /> */}
                      <p className="text-sm text-gray-500 mt-2">Xem tài liệu gốc tại đây.</p>
                  </div>
              )}
            </>
          )}
          {!initialResultData && !loadingResult && !errorResult && (
              <p className="text-center text-gray-500">Không có dữ liệu kết quả nào được cung cấp cho xét nghiệm này.</p>
          )}
        </div>
        <DialogFooter>
          {/* Removed save button */}
          <Button onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestResultDialog;