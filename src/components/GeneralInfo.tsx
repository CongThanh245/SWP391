
import React from 'react';
import { Card } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';

interface GeneralInfoProps {
  title: string;
  includeVaccines?: boolean;
  initialData: GeneralInfoData;
  onDataChange: (data: GeneralInfoData) => void;
}

export interface GeneralInfoData {
  height: number | null;
  weight: number | null;
  bloodPressure: string;
  bmi: number | null;
  pulse: number | null;
  breathing: number | null;
  temperature: number | null;
  vaccines?: string;
}

const GeneralInfo: React.FC<GeneralInfoProps> = ({ title, includeVaccines = false, initialData, onDataChange}) => {
  const handleChange = (field: keyof GeneralInfoData, value: string) => {
    const parsedValue =
      field === 'bloodPressure' || field === 'vaccines'
        ? value
        : value === ''
        ? null
        : parseFloat(value);
    onDataChange({
      ...initialData,
      [field]: parsedValue,
    });
  };
  return (
    <Card className="p-6 mb-6 bg-white border border-[color:var(--card-border)]">
      <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-accent)]">
        {title} - Thông tin chung
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm text-[color:var(--text-secondary)]">
            Chiều cao (cm)
          </Label>
          <Input 
            id="height" 
            type="number" 
            value={initialData.height ?? ''}
            onChange={(e) => handleChange('height', e.target.value)}
            placeholder="165"
            className="border-[color:var(--card-border)] focus:border-[color:var(--deep-taupe)]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight" className="text-sm text-[color:var(--text-secondary)]">
            Cân nặng (kg)
          </Label>
          <Input 
            id="weight" 
            type="number" 
            placeholder="55"
            value={initialData.weight ?? ''}
            onChange={(e) => handleChange('weight', e.target.value)}
            className="border-[color:var(--card-border)] focus:border-[color:var(--deep-taupe)]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bloodPressure" className="text-sm text-[color:var(--text-secondary)]">
            Huyết áp (mmHg)
          </Label>
          <Input 
            id="bloodPressure" 
            placeholder="120/80"
            value={initialData.bloodPressure}
            onChange={(e) => handleChange('bloodPressure', e.target.value)}
            className="border-[color:var(--card-border)] focus:border-[color:var(--deep-taupe)]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bmi" className="text-sm text-[color:var(--text-secondary)]">
            BMI
          </Label>
          <Input 
            id="bmi" 
            type="number" 
            placeholder="20.2"
            value={initialData.bmi ?? ''}
            onChange={(e) => handleChange('bmi', e.target.value)}
            className="border-[color:var(--card-border)] focus:border-[color:var(--deep-taupe)]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pulse" className="text-sm text-[color:var(--text-secondary)]">
            Mạch (lần/phút)
          </Label>
          <Input 
            id="pulse" 
            type="number" 
            placeholder="72"
            value={initialData.pulse ?? ''}
            onChange={(e) => handleChange('pulse', e.target.value)}
            className="border-[color:var(--card-border)] focus:border-[color:var(--deep-taupe)]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="breathing" className="text-sm text-[color:var(--text-secondary)]">
            Nhịp thở (lần/phút)
          </Label>
          <Input 
            id="breathing" 
            type="number" 
            placeholder="18"
            value={initialData.breathing ?? ''}
            onChange={(e) => handleChange('breathing', e.target.value)}
            className="border-[color:var(--card-border)] focus:border-[color:var(--deep-taupe)]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="temperature" className="text-sm text-[color:var(--text-secondary)]">
            Nhiệt độ (°C)
          </Label>
          <Input 
            id="temperature" 
            type="number" 
            step="0.1"
            placeholder="36.5"
            value={initialData.temperature ?? ''}
            onChange={(e) => handleChange('temperature', e.target.value)}
            className="border-[color:var(--card-border)] focus:border-[color:var(--deep-taupe)]"
          />
        </div>
        {includeVaccines && (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="vaccines" className="text-sm text-[color:var(--text-secondary)]">
              Các loại vắc xin đã tiêm
            </Label>
            <Input 
              id="vaccines" 
              placeholder="Covid-19, Viêm gan B..."
              value={initialData.vaccines ?? ''}
              onChange={(e) => handleChange('vaccines', e.target.value)}
              className="border-[color:var(--card-border)] focus:border-[color:var(--deep-taupe)]"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default GeneralInfo;
