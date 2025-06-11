
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { Label } from '@components/ui/label';

interface TestResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  testName: string;
  onSave: (results: TestResult) => void;
}

interface TestResult {
  testValue: string;
  unit: string;
  referenceRange: string;
  diagnosis: string;
}

const TestResultDialog: React.FC<TestResultDialogProps> = ({
  isOpen,
  onClose,
  testName,
  onSave,
}) => {
  const [testValue, setTestValue] = useState('');
  const [unit, setUnit] = useState('');
  const [referenceRange, setReferenceRange] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  const handleSave = () => {
    const results: TestResult = {
      testValue,
      unit,
      referenceRange,
      diagnosis,
    };
    onSave(results);
    handleClose();
  };

  const handleClose = () => {
    setTestValue('');
    setUnit('');
    setReferenceRange('');
    setDiagnosis('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border border-[color:var(--card-border)]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[color:var(--text-accent)]">
            Kết quả xét nghiệm: {testName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testValue" className="text-sm font-medium text-[color:var(--text-secondary)]">
                Chỉ số
              </Label>
              <Input
                id="testValue"
                value={testValue}
                onChange={(e) => setTestValue(e.target.value)}
                placeholder="Nhập chỉ số..."
                className="border-[color:var(--card-border)] focus:border-[color:var(--deep-taupe)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-sm font-medium text-[color:var(--text-secondary)]">
                Đơn vị
              </Label>
              <Input
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Đơn vị đo..."
                className="border-[color:var(--card-border)] focus:border-[color:var(--deep-taupe)]"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="referenceRange" className="text-sm font-medium text-[color:var(--text-secondary)]">
              Giá trị tham chiếu
            </Label>
            <Input
              id="referenceRange"
              value={referenceRange}
              onChange={(e) => setReferenceRange(e.target.value)}
              placeholder="Khoảng giá trị bình thường..."
              className="border-[color:var(--card-border)] focus:border-[color:var(--deep-taupe)]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="diagnosis" className="text-sm font-medium text-[color:var(--text-secondary)]">
              Chẩn đoán sơ bộ
            </Label>
            <Textarea
              id="diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Nhập chẩn đoán sơ bộ..."
              className="min-h-[100px] border-[color:var(--card-border)] focus:border-[color:var(--deep-taupe)]"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-[color:var(--card-border)] text-[color:var(--text-secondary)]"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[color:var(--button-primary-bg)] hover:bg-[color:var(--button-hover-bg)] text-[color:var(--button-primary-text)]"
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestResultDialog;
