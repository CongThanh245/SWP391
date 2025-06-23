import React, { useState } from 'react';
import { Card } from '@components/ui/card';
import { Checkbox } from '@components/ui/checkbox';
import { Button } from '@components/ui/button';
import { FileText } from 'lucide-react'; // Only FileText is needed
import TestResultDialog from './TestResultDialog';

// Re-using TestItem interface from Treatment.tsx for consistency
interface TestItem {
  id: string;
  name: string;
  checked: boolean;
  status: 'ordered' | 'pending' | 'completed' | 'failed' | 'not-ordered';
  resultData?: any; // This will hold the result URL or data from backend
  protocolId?: string;
  protocolType?: 'MEDICATION' | 'MONITORING';
}

// TestResult interface (if still used internally by TestResultDialog for display structure)
interface TestResult {
  testValue: string;
  unit: string;
  referenceRange: string;
  diagnosis: string;
}

interface LabTestsProps {
  title: string;
  tests: TestItem[]; // Use TestItem interface
  onTestsChange: React.Dispatch<React.SetStateAction<TestItem[]>>; // Use TestItem
}

const LabTests: React.FC<LabTestsProps> = ({ title, tests, onTestsChange }) => {
  const [selectedTest, setSelectedTest] = useState<{ id: string; name: string; resultData?: any } | null>(null);

  const handleTestChange = (testId: string, checked: boolean) => {
    // This function updates the 'checked' state in the parent component.
    // It remains active so the doctor can still check/uncheck tests
    // even if viewing results is tied to 'completed' status.
    onTestsChange(prev =>
      prev.map(test =>
        test.id === testId ? { ...test, checked } : test
      )
    );
  };

  const handleViewResult = (test: TestItem) => {
    // When viewing results, pass the entire test item, including resultData.
    // This function will only be called if the button is enabled (status === 'completed').
    setSelectedTest({ id: test.id, name: test.name, resultData: test.resultData });
  };

  const handleCloseDialog = () => {
    setSelectedTest(null);
  };

  return (
    <>
      <Card className="p-6 bg-white border border-[color:var(--card-border)]">
        <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-accent)]">
          {title} - Chỉ định và Kết quả xét nghiệm
        </h3>
        <div className="space-y-3">
          {tests.length > 0 ? ( // Display all tests
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
                <Button
                  onClick={() => handleViewResult(test)} // Pass the whole test object
                  variant="outline"
                  size="sm"
                  className="ml-3 border-[color:var(--card-border)] text-[color:var(--text-secondary)] hover:bg-[color:var(--hover-accent)] hover:text-[color:var(--deep-taupe)]"
                  // Button is only enabled if the test status is 'completed' AND has resultData
                  disabled={test.status !== 'completed' || !test.resultData}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  {test.status === 'completed' && test.resultData
                    ? 'Xem kết quả'
                    : 'Chưa có kết quả'}
                </Button>
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

      <TestResultDialog
        isOpen={selectedTest !== null}
        onClose={handleCloseDialog}
        testName={selectedTest?.name || ''}
        initialResultData={selectedTest?.resultData} // Pass backend data
      />
    </>
  );
};

export default LabTests;