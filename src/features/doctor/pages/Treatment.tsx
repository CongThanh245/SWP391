import React, { useState } from 'react';
import { useToast } from '@hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import GeneralInfo from '@components/GeneralInfo';
import LabTests from '@components/LabTests';
import { Card } from '@components/ui/card';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Button } from '@components/ui/button';
import { Checkbox } from '@components/ui/checkbox';
import AppointmentCalendar from '@components/AppointmentCalendar'
import PatientInfo from '@components/PatientInfo'
import InterventionWife from '@components/InterventionWife';
import InterventionHusband from '@components/InterventionHusband';
import PostIntervention from '@components/PostIntervention';

interface TreatmentProps {
  onBackToDashboard?: () => void;
}

const Treatment: React.FC<TreatmentProps> = ({ onBackToDashboard }) => {
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState('wife');
  const [activeInterventionTab, setActiveInterventionTab] = useState('wife');
  const [wifeDiagnosis, setWifeDiagnosis] = useState('');
  const [husbandDiagnosis, setHusbandDiagnosis] = useState('');
  const [generalDiagnosis, setGeneralDiagnosis] = useState('');
  const [treatmentMethods, setTreatmentMethods] = useState({
    iui: false,
    ivf: false,
    other: false
  });
  const patientData = {
    name: 'Nguyễn Thị Lan Anh',
    patientId: 'BN001234',
    gender: 'Nữ',
    birthYear: '1990',
    city: 'Hà Nội',
    email: 'lananh.nguyen@email.com',
    phone: '0987654321'
  };

  // Lab tests data for wife
  const wifeLabTests = [
    { id: 'cbc', name: 'Xét nghiệm máu toàn bộ (CBC)', checked: false },
    { id: 'amh', name: 'Đánh giá dự trữ buồng trứng (AMH)', checked: false },
    { id: 'thyroid', name: 'Xét nghiệm tuyến giáp (TSH, T3, FT4)', checked: false },
    { id: 'esr', name: 'Xét nghiệm tỉ lệ hồng cầu lắng (ESR)', checked: false },
    { id: 'chlamydia', name: 'Xét nghiệm Chlamydia', checked: false },
    { id: 'vdrl', name: 'Xét nghiệm VDRL', checked: false },
    { id: 'prolactin', name: 'Xét nghiệm nội tiết Prolactin', checked: false },
    { id: 'estrogen', name: 'Xét nghiệm nội tiết Estrogen', checked: false },
    { id: 'lh', name: 'Xét nghiệm nội tiết LH', checked: false },
    { id: 'fsh', name: 'Xét nghiệm nội tiết FSH', checked: false },
  ];

  const husbandLabTests = [
    { id: 'semen', name: 'Xét nghiệm tinh dịch đồ', checked: false },
    { id: 'hormone', name: 'Xét nghiệm nội tiết tố', checked: false },
    { id: 'genetic', name: 'Xét nghiệm di truyền', checked: false },
    { id: 'immune', name: 'Xét nghiệm miễn dịch', checked: false },
    { id: 'dna', name: 'Độ phân mảnh DNA tinh trùng (Halosperm Test)', checked: false },
  ];

  const handleSaveRecord = () => {
    toast({
      title: "Đã lưu hồ sơ thành công",
      description: `Hồ sơ bệnh nhân ${patientData.name} đã được cập nhật.`,
    });
  };

  const handleTreatmentMethodChange = (method: string, checked: boolean) => {
    setTreatmentMethods(prev => ({
      ...prev,
      [method]: checked
    }));
  };

  const renderSpecialtySubTabs = () => (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full grid-cols-3 bg-[color:var(--secondary-background)]">
          <TabsTrigger
            value="wife"
            className="data-[state=active]:bg-[color:var(--deep-taupe)] data-[state=active]:text-white"
          >
            Vợ
          </TabsTrigger>
          <TabsTrigger
            value="husband"
            className="data-[state=active]:bg-[color:var(--deep-taupe)] data-[state=active]:text-white"
          >
            Chồng
          </TabsTrigger>
          <TabsTrigger
            value="appointment"
            className="data-[state=active]:bg-[color:var(--deep-taupe)] data-[state=active]:text-white"
          >
            Hẹn tái khám
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wife" className="space-y-6">
          <GeneralInfo title="Vợ" includeVaccines={true} />
          <LabTests title="Vợ" tests={wifeLabTests} />

          {/* Chẩn đoán Vợ */}
          <Card className="p-6 bg-white border border-[color:var(--card-border)]">
            <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-accent)]">
              Chẩn đoán
            </h3>
            <div className="space-y-2">
              <Label htmlFor="wifeDiagnosis" className="text-sm font-medium text-[color:var(--text-secondary)]">
                Chẩn đoán chi tiết
              </Label>
              <Textarea
                id="wifeDiagnosis"
                value={wifeDiagnosis}
                onChange={(e) => setWifeDiagnosis(e.target.value)}
                placeholder="Nhập chẩn đoán cho vợ..."
                className="min-h-[100px] border-[color:var(--card-border)] focus:border-[color:var(--deep-taupe)]"
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="husband" className="space-y-6">
          <GeneralInfo title="Chồng" includeVaccines={false} />
          <LabTests title="Chồng" tests={husbandLabTests} />

          {/* Chẩn đoán Chồng */}
          <Card className="p-6 bg-white border border-[color:var(--card-border)]">
            <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-accent)]">
              Chẩn đoán
            </h3>
            <div className="space-y-2">
              <Label htmlFor="husbandDiagnosis" className="text-sm font-medium text-[color:var(--text-secondary)]">
                Chẩn đoán chi tiết
              </Label>
              <Textarea
                id="husbandDiagnosis"
                value={husbandDiagnosis}
                onChange={(e) => setHusbandDiagnosis(e.target.value)}
                placeholder="Nhập chẩn đoán cho chồng..."
                className="min-h-[100px] border-[color:var(--card-border)] focus:border-[color:var(--deep-taupe)]"
              />
            </div>
          </Card>

          {/* Chẩn đoán chung - Đề xuất từ bác sĩ */}
          <Card className="p-6 bg-white border border-[color:var(--card-border)]">
            <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-accent)]">
              Chẩn đoán chung - Đề xuất từ bác sĩ
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="generalDiagnosis" className="text-sm font-medium text-[color:var(--text-secondary)]">
                  Đề xuất điều trị
                </Label>
                <Textarea
                  id="generalDiagnosis"
                  value={generalDiagnosis}
                  onChange={(e) => setGeneralDiagnosis(e.target.value)}
                  placeholder="Nhập đề xuất điều trị từ bác sĩ..."
                  className="min-h-[100px] border-[color:var(--card-border)] focus:border-[color:var(--deep-taupe)]"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-[color:var(--text-secondary)]">
                  Phương pháp điều trị được đề xuất:
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="iui"
                      checked={treatmentMethods.iui}
                      onCheckedChange={(checked) => handleTreatmentMethodChange('iui', !!checked)}
                      className="data-[state=checked]:bg-[color:var(--deep-taupe)] data-[state=checked]:border-[color:var(--deep-taupe)]"
                    />
                    <label htmlFor="iui" className="text-sm font-medium">
                      IUI (Thụ tinh nhân tạo trong tử cung)
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="ivf"
                      checked={treatmentMethods.ivf}
                      onCheckedChange={(checked) => handleTreatmentMethodChange('ivf', !!checked)}
                      className="data-[state=checked]:bg-[color:var(--deep-taupe)] data-[state=checked]:border-[color:var(--deep-taupe)]"
                    />
                    <label htmlFor="ivf" className="text-sm font-medium">
                      IVF (Thụ tinh ống nghiệm)
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="other"
                      checked={treatmentMethods.other}
                      onCheckedChange={(checked) => handleTreatmentMethodChange('other', !!checked)}
                      className="data-[state=checked]:bg-[color:var(--deep-taupe)] data-[state=checked]:border-[color:var(--deep-taupe)]"
                    />
                    <label htmlFor="other" className="text-sm font-medium">
                      Khác
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="appointment">
          <AppointmentCalendar />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-6">
        <Button
          onClick={handleSaveRecord}
          className="bg-[color:var(--button-primary-bg)] hover:bg-[color:var(--button-hover-bg)] text-[color:var(--button-primary-text)] px-8 py-2"
        >
          Lưu hồ sơ
        </Button>
      </div>
    </div>
  );

  const renderInterventionSubTabs = () => (
    <div className="space-y-6">
      <Tabs value={activeInterventionTab} onValueChange={setActiveInterventionTab}>
        <TabsList className="grid w-full grid-cols-3 bg-[color:var(--secondary-background)]">
          <TabsTrigger
            value="wife"
            className="data-[state=active]:bg-[color:var(--deep-taupe)] data-[state=active]:text-white"
          >
            Vợ
          </TabsTrigger>
          <TabsTrigger
            value="husband"
            className="data-[state=active]:bg-[color:var(--deep-taupe)] data-[state=active]:text-white"
          >
            Chồng
          </TabsTrigger>
          <TabsTrigger
            value="appointment"
            className="data-[state=active]:bg-[color:var(--deep-taupe)] data-[state=active]:text-white"
          >
            Hẹn tái khám
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wife">
          <InterventionWife />
        </TabsContent>

        <TabsContent value="husband">
          <InterventionHusband />
        </TabsContent>

        <TabsContent value="appointment">
          <AppointmentCalendar />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-6">
        <Button
          onClick={handleSaveRecord}
          className="bg-[color:var(--button-primary-bg)] hover:bg-[color:var(--button-hover-bg)] text-[color:var(--button-primary-text)] px-8 py-2"
        >
          Lưu hồ sơ
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-full">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {onBackToDashboard && (
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={onBackToDashboard}
              className="mb-4"
            >
              ← Quay về Dashboard
            </Button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[color:var(--text-accent)]">
            Hồ sơ bệnh nhân
          </h1>
          <Button
            onClick={handleSaveRecord}
            className="bg-[color:var(--button-primary-bg)] hover:bg-[color:var(--button-hover-bg)] text-[color:var(--button-primary-text)] px-8 py-2"
          >
            Lưu hồ sơ
          </Button>
        </div>

        {/* Patient Info */}
       <PatientInfo patient={patientData} />

        {/* Tabs */}
        <Tabs defaultValue="specialty" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[color:var(--secondary-background)] mb-6">
            <TabsTrigger
              value="specialty"
              className="data-[state=active]:bg-[color:var(--deep-taupe)] data-[state=active]:text-white text-lg py-3"
            >
              Chuyên Khoa
            </TabsTrigger>
            <TabsTrigger
              value="intervention"
              className="data-[state=active]:bg-[color:var(--deep-taupe)] data-[state=active]:text-white text-lg py-3"
            >
              Can thiệp
            </TabsTrigger>
            <TabsTrigger
              value="post-intervention"
              className="data-[state=active]:bg-[color:var(--deep-taupe)] data-[state=active]:text-white text-lg py-3"
            >
              Hậu can thiệp
            </TabsTrigger>
          </TabsList>

          <TabsContent value="specialty">
            {renderSpecialtySubTabs()}
          </TabsContent>

          <TabsContent value="intervention">
            {renderInterventionSubTabs()}
          </TabsContent>

          <TabsContent value="post-intervention">
            <PostIntervention />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default Treatment;