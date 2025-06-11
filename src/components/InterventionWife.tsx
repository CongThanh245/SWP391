
import React, { useState } from 'react';
import { Card } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Plus, Calendar } from 'lucide-react';

const InterventionWife: React.FC = () => {
  const [treatmentType, setTreatmentType] = useState<'IUI' | 'IVF' | null>(null);
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [stimulationProtocols, setStimulationProtocols] = useState<any[]>([{ id: 1 }]);
  const [injectionDays, setInjectionDays] = useState<{ [key: number]: number }>({});

  const addFollowUp = () => {
    setFollowUps([...followUps, {
      id: Date.now(),
      date: '',
      follicleCount: '',
      follicleSize: '',
      endometrialThickness: ''
    }]);
  };

  const addStimulationProtocol = () => {
    const newId = stimulationProtocols.length + 1;
    setStimulationProtocols([...stimulationProtocols, { id: newId }]);
  };

  const handleDaysChange = (protocolId: number, days: string) => {
    const numDays = parseInt(days) || 0;
    setInjectionDays(prev => ({ ...prev, [protocolId]: numDays }));
  };

  const renderTreatmentTypeSelector = () => (
    <Card className="p-6 bg-white border border-[color:var(--card-border)]">
      <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-accent)]">
        Chọn phương pháp điều trị
      </h3>
      <div className="flex gap-4">
        <Button
          onClick={() => setTreatmentType('IUI')}
          variant={treatmentType === 'IUI' ? 'default' : 'outline'}
          className={treatmentType === 'IUI' ? 
            'bg-[color:var(--deep-taupe)] text-white' : 
            'border-[color:var(--card-border)] text-[color:var(--text-secondary)]'
          }
        >
          IUI
        </Button>
        <Button
          onClick={() => setTreatmentType('IVF')}
          variant={treatmentType === 'IVF' ? 'default' : 'outline'}
          className={treatmentType === 'IVF' ? 
            'bg-[color:var(--deep-taupe)] text-white' : 
            'border-[color:var(--card-border)] text-[color:var(--text-secondary)]'
          }
        >
          IVF
        </Button>
      </div>
    </Card>
  );

  const renderStimulationProtocol = (protocolId: number, title: string) => (
    <Card key={protocolId} className="p-6 bg-white border border-[color:var(--card-border)]">
      <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-accent)]">
        {title} {protocolId > 1 && `(Lần ${protocolId})`}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Label>Loại thuốc</Label>
          <Input placeholder="Nhập loại thuốc..." className="border-[color:var(--card-border)]" />
        </div>
        <div className="space-y-2">
          <Label>Liều</Label>
          <Input placeholder="Nhập liều thuốc..." className="border-[color:var(--card-border)]" />
        </div>
        <div className="space-y-2">
          <Label>Số ngày</Label>
          <Input 
            type="number"
            placeholder="Nhập số ngày..." 
            className="border-[color:var(--card-border)]"
            onChange={(e) => handleDaysChange(protocolId, e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Ngày bắt đầu</Label>
          <Input type="date" className="border-[color:var(--card-border)]" />
        </div>
        <div className="space-y-2">
          <Label>Đáp ứng thuốc</Label>
          <Select>
            <SelectTrigger className="border-[color:var(--card-border)]">
              <SelectValue placeholder="Chọn đáp ứng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="good">Tốt</SelectItem>
              <SelectItem value="average">Trung bình</SelectItem>
              <SelectItem value="poor">Kém</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {injectionDays[protocolId] > 0 && (
        <div className="space-y-3">
          <Label>Ngày tiêm</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Array.from({ length: injectionDays[protocolId] }, (_, index) => (
              <div key={index} className="space-y-2">
                <Label>Ngày {index + 1}</Label>
                <Input type="date" className="border-[color:var(--card-border)]" />
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );

  const renderFollicleMonitoring = () => (
    <Card className="p-6 bg-white border border-[color:var(--card-border)]">
      <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-accent)]">
        Siêu âm theo dõi nang noãn
      </h3>
      
      {followUps.map((followUp, index) => (
        <div key={followUp.id} className="mb-4 p-4 border rounded-lg border-[color:var(--card-border)]">
          <h4 className="font-medium mb-3">Lần theo dõi {index + 1}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ngày siêu âm</Label>
              <Input type="date" className="border-[color:var(--card-border)]" />
            </div>
            <div className="space-y-2">
              <Label>Số lượng nang</Label>
              <Input placeholder="Nhập số lượng..." className="border-[color:var(--card-border)]" />
            </div>
            <div className="space-y-2">
              <Label>Kích thước nang</Label>
              <Input placeholder="Nhập kích thước..." className="border-[color:var(--card-border)]" />
            </div>
            <div className="space-y-2">
              <Label>Độ dày niêm mạc</Label>
              <Input placeholder="Nhập độ dày..." className="border-[color:var(--card-border)]" />
            </div>
          </div>
        </div>
      ))}

      <Button
        onClick={addFollowUp}
        variant="outline"
        className="border-[color:var(--card-border)] text-[color:var(--text-secondary)]"
      >
        <Plus className="w-4 h-4 mr-2" />
        Thêm lần theo dõi
      </Button>
    </Card>
  );

  const renderIUISpecificSteps = () => (
    <>
      <Card className="p-6 bg-white border border-[color:var(--card-border)]">
        <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-accent)]">
          Bơm tinh trùng vào tử cung
        </h3>
        <div className="space-y-2">
          <Label>Ngày bơm</Label>
          <Input type="date" className="border-[color:var(--card-border)]" />
        </div>
      </Card>
      
      <Card className="p-6 bg-white border border-[color:var(--card-border)]">
        <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-accent)]">
          Ghi chú bổ sung
        </h3>
        <Textarea
          placeholder="Nhập ghi chú..."
          className="min-h-[100px] border-[color:var(--card-border)]"
        />
        <Button
          variant="outline"
          className="mt-3 border-[color:var(--card-border)] text-[color:var(--text-secondary)]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm
        </Button>
      </Card>
    </>
  );

  const renderIVFSpecificSteps = () => (
    <>
      <Card className="p-6 bg-white border border-[color:var(--card-border)]">
        <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-accent)]">
          Chọc hút trứng
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Ngày thực hiện</Label>
            <Input type="date" className="border-[color:var(--card-border)]" />
          </div>
          <div className="space-y-2">
            <Label>Số trứng hút được</Label>
            <Input placeholder="Nhập số trứng..." className="border-[color:var(--card-border)]" />
          </div>
          <div className="space-y-2">
            <Label>Số trứng trưởng thành</Label>
            <Input placeholder="Nhập số trứng..." className="border-[color:var(--card-border)]" />
          </div>
          <div className="space-y-2">
            <Label>Số trứng trữ đông</Label>
            <Input placeholder="Nhập số trứng..." className="border-[color:var(--card-border)]" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white border border-[color:var(--card-border)]">
        <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-accent)]">
          Chuẩn bị niêm mạc
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Loại thuốc</Label>
            <Input placeholder="Nhập loại thuốc..." className="border-[color:var(--card-border)]" />
          </div>
          <div className="space-y-2">
            <Label>Liều</Label>
            <Input placeholder="Nhập liều thuốc..." className="border-[color:var(--card-border)]" />
          </div>
          <div className="space-y-2">
            <Label>Số ngày</Label>
            <Input placeholder="Nhập số ngày..." className="border-[color:var(--card-border)]" />
          </div>
          <div className="space-y-2">
            <Label>Ngày bắt đầu</Label>
            <Input type="date" className="border-[color:var(--card-border)]" />
          </div>
          <div className="space-y-2">
            <Label>Đáp ứng thuốc</Label>
            <Select>
              <SelectTrigger className="border-[color:var(--card-border)]">
                <SelectValue placeholder="Chọn đáp ứng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="good">Tốt</SelectItem>
                <SelectItem value="average">Trung bình</SelectItem>
                <SelectItem value="poor">Kém</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white border border-[color:var(--card-border)]">
        <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-accent)]">
          Chuyển phôi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Ngày thực hiện</Label>
            <Input type="date" className="border-[color:var(--card-border)]" />
          </div>
          <div className="space-y-2">
            <Label>Loại thuốc nội tiết</Label>
            <Input placeholder="Nhập loại thuốc..." className="border-[color:var(--card-border)]" />
          </div>
          <div className="space-y-2">
            <Label>Tên thuốc</Label>
            <Input placeholder="Nhập tên thuốc..." className="border-[color:var(--card-border)]" />
          </div>
        </div>
      </Card>
    </>
  );

  return (
    <div className="space-y-6">
      {renderTreatmentTypeSelector()}
      
      {treatmentType && (
        <>
          {/* Phác đồ kích thích buồng trứng / Tiêm kích trứng */}
          <div className="space-y-4">
            {stimulationProtocols.map((protocol) => 
              renderStimulationProtocol(
                protocol.id, 
                treatmentType === 'IUI' ? 'Phác đồ kích thích buồng trứng' : 'Tiêm kích trứng'
              )
            )}
            <Button
              onClick={addStimulationProtocol}
              variant="outline"
              className="border-[color:var(--card-border)] text-[color:var(--text-secondary)]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Bổ sung phác đồ
            </Button>
          </div>

          {/* Theo dõi nang noãn */}
          {renderFollicleMonitoring()}

          {/* Treatment-specific steps */}
          {treatmentType === 'IUI' && renderIUISpecificSteps()}
          {treatmentType === 'IVF' && renderIVFSpecificSteps()}
        </>
      )}
    </div>
  );
};

export default InterventionWife;
