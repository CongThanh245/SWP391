import React, { useEffect, useState } from 'react';
import { useToast } from '@hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import GeneralInfo from '@components/GeneralInfo';
import LabTests from '@components/LabTests';
import { Card } from '@components/ui/card';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Button } from '@components/ui/button';
// Import RadioGroup and RadioGroupItem
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group';
import AppointmentCalendar from '@components/AppointmentCalendar';
import PatientInfo from '@components/PatientInfo';
import InterventionWife from '@components/InterventionWife';
import InterventionHusband from '@components/InterventionHusband';
import PostIntervention from '@components/PostIntervention';
import { getWifeProfile, getWifeVital, getHusbandVital, getProtocolList, getPreparation_notes } from '@api/doctorApi';
import { formatValue } from '@utils/format';
import apiClient from '@api/axiosConfig';

interface TreatmentProps {
  onBackToDashboard?: () => void;
  patientId: string;
}

interface GeneralInfoData {
  height: number | null;
  weight: number | null;
  bloodPressure: string;
  bmi: number | null;
  pulse: number | null;
  breathing: number | null;
  temperature: number | null;
  vaccines?: string;
}

interface LabTestItem {
  name: string;
  protocolType: 'MEDICATION' | 'TEST';
}

interface TestItem {
  id: string;
  name: string;
  checked: boolean;
  status: 'ordered' | 'pending' | 'completed' | 'failed' | 'not-ordered';
  resultData?: any;
  protocolId?: string; // Add protocol ID for tracking
}

interface PatientData {
  name: string;
  patientId: string;
  gender: string;
  birthYear: string;
  city: string;
  email: string;
  phone: string;
}

type TreatmentMethod = 'iui' | 'ivf' | 'other' | 'none';

interface WifeVitalResponse {
  wifeHeight: number;
  wifeWeight: number;
  wifeBloodPressure: string;
  wifeBmi: number;
  wifeHeartRate: number;
  wifeBreathingRate: number;
  wifeTemperature: number;
  wifeVaccinations: string;
}

interface HusbandVitalResponse {
  husbandHeight: number;
  husbandWeight: number;
  husbandBloodPressure: string;
  husbandBmi: number;
  husbandHeartRate: number;
  husbandBreathingRate: number;
  husbandTemperature: number;
}

interface WifeProfileResponse {
  patientName: string;
  patientId: string;
  gender: string;
  dateOfBirth: string;
  patientAddress: string;
  email: string;
  patientPhone: string;
}

interface ProtocolResponse {
  protocolId: string;
  name: string;
  targetSubject: 'WIFE' | 'HUSBAND';
  protocolType: 'MEDICATION' | 'TEST';
  visibleToUI: boolean;
  status?: 'ordered' | 'pending' | 'completed' | 'failed';
  resultUrl?: string;
}

interface PreparationNotesResponse {
  preparationNotes: string;
  suggestIUI: boolean;
  suggestIVF: boolean;
  suggestOther: boolean;
}

interface APIPayload {
  preparationNotes: string;
  suggestIUI: boolean;
  suggestIVF: boolean;
  suggestOther: boolean;
  wifeHeight: number;
  wifeWeight: number;
  wifeBmi: number;
  wifeTemperature: number;
  wifeHeartRate: number;
  wifeBreathingRate: number;
  wifeBloodPressure: string;
  wifeVaccinations: string;
  husbandHeight: number;
  husbandWeight: number;
  husbandBmi: number;
  husbandTemperature: number;
  husbandHeartRate: number;
  husbandBreathingRate: number;
  husbandBloodPressure: string;
}

interface ProtocolPayload {
  wifeProtocols: LabTestItem[];
  husbandProtocols: LabTestItem[];
  stageId: string;
}

const Treatment: React.FC<TreatmentProps> = ({ onBackToDashboard, patientId }) => {
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState('wife');
  const [activeInterventionTab, setActiveInterventionTab] = useState('wife');

  const [generalDiagnosis, setGeneralDiagnosis] = useState('');
  const [selectedTreatmentMethod, setSelectedTreatmentMethod] = useState<TreatmentMethod>('none');

  const [wifeGeneralInfo, setWifeGeneralInfo] = useState<GeneralInfoData>({
    height: null,
    weight: null,
    bloodPressure: '',
    bmi: null,
    pulse: null,
    breathing: null,
    temperature: null,
    vaccines: '',
  });

  const [husbandGeneralInfo, setHusbandGeneralInfo] = useState<GeneralInfoData>({
    height: null,
    weight: null,
    bloodPressure: '',
    bmi: null,
    pulse: null,
    breathing: null,
    temperature: null,
  });

  // Track original lab tests state to identify changes
  const [originalWifeLabTests, setOriginalWifeLabTests] = useState<TestItem[]>([]);
  const [originalHusbandLabTests, setOriginalHusbandLabTests] = useState<TestItem[]>([]);

  const [wifeLabTests, setWifeLabTests] = useState<TestItem[]>([
    { id: 'cbc', name: 'Xét nghiệm máu toàn bộ (CBC)', checked: false, status: 'not-ordered' },
    { id: 'amh', name: 'Đánh giá dự trữ buồng trứng (AMH)', checked: false, status: 'not-ordered' },
    { id: 'thyroid', name: 'Xét nghiệm tuyến giáp (TSH, T3, FT4)', checked: false, status: 'not-ordered' },
    { id: 'esr', name: 'Xét nghiệm tỉ lệ hồng cầu lắng (ESR)', checked: false, status: 'not-ordered' },
    { id: 'chlamydia', name: 'Xét nghiệm Chlamydia', checked: false, status: 'not-ordered' },
    { id: 'vdrl', name: 'Xét nghiệm VDRL', checked: false, status: 'not-ordered' },
    { id: 'prolactin', name: 'Xét nghiệm nội tiết Prolactin', checked: false, status: 'not-ordered' },
    { id: 'estrogen', name: 'Xét nghiệm nội tiết Estrogen', checked: false, status: 'not-ordered' },
    { id: 'lh', name: 'Xét nghiệm nội tiết LH', checked: false, status: 'not-ordered' },
    { id: 'fsh', name: 'Xét nghiệm nội tiết FSH', checked: false, status: 'not-ordered' },
  ]);

  const [husbandLabTests, setHusbandLabTests] = useState<TestItem[]>([
    { id: 'semen', name: 'Xét nghiệm tinh dịch đồ', checked: false, status: 'not-ordered' },
    { id: 'hormone', name: 'Xét nghiệm nội tiết tố', checked: false, status: 'not-ordered' },
    { id: 'genetic', name: 'Xét nghiệm di truyền', checked: false, status: 'not-ordered' },
    { id: 'immune', name: 'Xét nghiệm miễn dịch', checked: false, status: 'not-ordered' },
    { id: 'dna', name: 'Độ phân mảnh DNA tinh trùng (Halosperm Test)', checked: false, status: 'not-ordered' },
  ]);

  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState<Date | null>(null);
  const [appointmentNotes, setAppointmentNotes] = useState('');

  const [patientData, setPatientData] = useState<PatientData>({
    name: 'Nguyễn Thị Lan Anh',
    patientId: 'BN001234',
    gender: 'Nữ',
    birthYear: '1990',
    city: 'Hà Nội',
    email: 'lananh.nguyen@email.com',
    phone: '0987654321',
  });

  // Fetch wife vital data
  useEffect(() => {
    const fetchWifeVitalData = async () => {
      try {
        const data: WifeVitalResponse = await getWifeVital(patientId);
        setWifeGeneralInfo({
          height: data.wifeHeight,
          weight: data.wifeWeight,
          bloodPressure: data.wifeBloodPressure,
          bmi: data.wifeBmi,
          pulse: data.wifeHeartRate,
          breathing: data.wifeBreathingRate,
          temperature: data.wifeTemperature,
          vaccines: data.wifeVaccinations,
        });
      } catch (error) {
        console.error('Error fetching wife vital data:', error);
      }
    };

    if (patientId) {
      fetchWifeVitalData();
    }
  }, [patientId]);

  // Fetch husband vital data
  useEffect(() => {
    const fetchHusbandVitalData = async () => {
      try {
        const data: HusbandVitalResponse = await getHusbandVital(patientId);
        setHusbandGeneralInfo({
          height: data.husbandHeight,
          weight: data.husbandWeight,
          bloodPressure: data.husbandBloodPressure,
          bmi: data.husbandBmi,
          pulse: data.husbandHeartRate,
          breathing: data.husbandBreathingRate,
          temperature: data.husbandTemperature,
        });
      } catch (error) {
        console.error('Error fetching husband vital data:', error);
      }
    };

    if (patientId) {
      fetchHusbandVitalData();
    }
  }, [patientId]);

  // Fetch wife profile data
  useEffect(() => {
    const fetchWifeProfileData = async () => {
      try {
        const data: WifeProfileResponse = await getWifeProfile(patientId);
        setPatientData({
          name: data.patientName,
          patientId: data.patientId,
          gender: data.gender,
          birthYear: data.dateOfBirth,
          city: formatValue(data.patientAddress),
          email: data.email,
          phone: data.patientPhone,
        });
      } catch (error) {
        console.error('Error fetching wife profile data:', error);
      }
    };

    if (patientId) {
      fetchWifeProfileData();
    }
  }, [patientId]);

  // Fixed: Fetch protocol list and update lab tests with proper status logic
  useEffect(() => {
    const fetchProtocolData = async () => {
      try {
        const data: ProtocolResponse[] = await getProtocolList(patientId);
        console.log('Fetched protocol data:', data);

        const updateLabTests = (prevTests: TestItem[], protocols: ProtocolResponse[], targetSubject: 'WIFE' | 'HUSBAND') => {
          const newTestsMap = new Map(prevTests.map(test => [test.name, { ...test }]));

          protocols
            .filter(protocol => protocol.targetSubject === targetSubject && protocol.visibleToUI)
            .forEach(protocol => {
              const existingTest = newTestsMap.get(protocol.name);
              if (existingTest) {
                // Update existing test with backend data
                newTestsMap.set(protocol.name, {
                  ...existingTest,
                  checked: true, // If protocol exists in backend, it should be checked
                  status: protocol.status || 'pending', // Use backend status or default to pending
                  resultData: protocol.resultUrl || existingTest.resultData,
                  protocolId: protocol.protocolId, // Store protocol ID for reference
                });
              } else {
                // Add new protocol if it doesn't exist in the default list
                newTestsMap.set(protocol.name, {
                  id: protocol.protocolId,
                  name: protocol.name,
                  checked: true,
                  status: protocol.status || 'pending',
                  resultData: protocol.resultUrl,
                  protocolId: protocol.protocolId,
                });
              }
            });

          return Array.from(newTestsMap.values());
        };

        const updatedWifeTests = updateLabTests(wifeLabTests, data, 'WIFE');
        const updatedHusbandTests = updateLabTests(husbandLabTests, data, 'HUSBAND');

        setWifeLabTests(updatedWifeTests);
        setHusbandLabTests(updatedHusbandTests);

        // Store original state for comparison
        setOriginalWifeLabTests(JSON.parse(JSON.stringify(updatedWifeTests)));
        setOriginalHusbandLabTests(JSON.parse(JSON.stringify(updatedHusbandTests)));

      } catch (error) {
        console.error('Error fetching protocol data:', error);
      }
    };

    if (patientId) {
      fetchProtocolData();
    }
  }, [patientId]);

  // Fetch preparation notes and set treatment method
  useEffect(() => {
    const fetchPreparationNotes = async () => {
      try {
        const data: PreparationNotesResponse = await getPreparation_notes(patientId);
        setGeneralDiagnosis(data.preparationNotes);

        if (data.suggestIUI) {
          setSelectedTreatmentMethod('iui');
        } else if (data.suggestIVF) {
          setSelectedTreatmentMethod('ivf');
        } else if (data.suggestOther) {
          setSelectedTreatmentMethod('other');
        } else {
          setSelectedTreatmentMethod('none');
        }
      } catch (error) {
        console.error('Error fetching preparation notes:', error);
      }
    };

    if (patientId) {
      fetchPreparationNotes();
    }
  }, [patientId]);

  // Fixed: Helper function to identify which tests have changed
  const getChangedTests = (currentTests: TestItem[], originalTests: TestItem[]) => {
    const originalMap = new Map(originalTests.map(test => [test.name, test]));

    return currentTests.filter(currentTest => {
      const originalTest = originalMap.get(currentTest.name);

      if (!originalTest) {
        // New test that was added
        return currentTest.checked && currentTest.status === 'not-ordered';
      }

      // Check if checked status or status changed
      return (
        currentTest.checked !== originalTest.checked ||
        (currentTest.checked && currentTest.status !== originalTest.status)
      );
    });
  };

  const saveGeneralInfo = async (): Promise<void> => {
    const payload: APIPayload = {
      preparationNotes: generalDiagnosis,
      suggestIUI: selectedTreatmentMethod === 'iui',
      suggestIVF: selectedTreatmentMethod === 'ivf',
      suggestOther: selectedTreatmentMethod === 'other',
      wifeHeight: wifeGeneralInfo.height || 0,
      wifeWeight: wifeGeneralInfo.weight || 0,
      wifeBmi: wifeGeneralInfo.bmi || 0,
      wifeTemperature: wifeGeneralInfo.temperature || 0,
      wifeHeartRate: wifeGeneralInfo.pulse || 0,
      wifeBreathingRate: wifeGeneralInfo.breathing || 0,
      wifeBloodPressure: wifeGeneralInfo.bloodPressure || '',
      wifeVaccinations: wifeGeneralInfo.vaccines || '',
      husbandHeight: husbandGeneralInfo.height || 0,
      husbandWeight: husbandGeneralInfo.weight || 0,
      husbandBmi: husbandGeneralInfo.bmi || 0,
      husbandTemperature: husbandGeneralInfo.temperature || 0,
      husbandHeartRate: husbandGeneralInfo.pulse || 0,
      husbandBreathingRate: husbandGeneralInfo.breathing || 0,
      husbandBloodPressure: husbandGeneralInfo.bloodPressure || '',
    };

    try {
      const response = await apiClient.patch(`/doctors/save-treatment-profile?patientId=${patientId}`, payload);
      console.log('General Info Payload:', payload);
      console.log('API Response:', response.data);
      toast({
        title: 'Đã lưu thông tin chung',
        description: 'Thông tin chung đã được cập nhật thành công.',
      });
    } catch (error) {
      console.error('Error saving general info:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu thông tin chung.',
        variant: 'destructive',
      });
    }
  };

  // Fixed: Save only changed protocols
  const saveProtocols = async (): Promise<void> => {
    const changedWifeTests = getChangedTests(wifeLabTests, originalWifeLabTests);
    const changedHusbandTests = getChangedTests(husbandLabTests, originalHusbandLabTests);

    // Only include newly checked tests (newly ordered)
    const wifeProtocols: LabTestItem[] = changedWifeTests
      .filter(test => test.checked && !originalWifeLabTests.find(orig => orig.name === test.name && orig.checked))
      .map(test => ({
        name: test.name,
        protocolType: 'MEDICATION' as const,
      }));

    const husbandProtocols: LabTestItem[] = changedHusbandTests
      .filter(test => test.checked && !originalHusbandLabTests.find(orig => orig.name === test.name && orig.checked))
      .map(test => ({
        name: test.name,
        protocolType: 'MEDICATION' as const,
      }));

    // Only send API call if there are actual changes
    if (wifeProtocols.length === 0 && husbandProtocols.length === 0) {
      console.log('No protocol changes detected');
      return;
    }

    const payload: ProtocolPayload = {
      wifeProtocols,
      husbandProtocols,
      stageId: '3555beb0-6221-4237-be0b-0dca4e59ca5c',
    };

    try {
      // Update the tests status to 'ordered' when sending to backend
      const updatedWifeTests = wifeLabTests.map(test => {
        const isNewlyOrdered = wifeProtocols.some(protocol => protocol.name === test.name);
        return isNewlyOrdered ? { ...test, status: 'ordered' as const } : test;
      });

      const updatedHusbandTests = husbandLabTests.map(test => {
        const isNewlyOrdered = husbandProtocols.some(protocol => protocol.name === test.name);
        return isNewlyOrdered ? { ...test, status: 'ordered' as const } : test;
      });

      setWifeLabTests(updatedWifeTests);
      setHusbandLabTests(updatedHusbandTests);

      console.log('Protocols Payload:', payload);

      // Uncomment when you have the actual API endpoint
      await apiClient.post(`/doctors/treatment-profile/create-protocols`, payload);

      toast({
        title: 'Đã lưu xét nghiệm',
        description: 'Danh sách xét nghiệm đã được cập nhật.',
      });

      // Update original state after successful save
      setOriginalWifeLabTests(JSON.parse(JSON.stringify(updatedWifeTests)));
      setOriginalHusbandLabTests(JSON.parse(JSON.stringify(updatedHusbandTests)));

    } catch (error) {
      console.error('Error saving protocols:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu danh sách xét nghiệm.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveRecord = async (): Promise<void> => {
    await saveGeneralInfo();
    await saveProtocols();

    if (selectedAppointmentDate) {
      console.log('Appointment:', {
        date: selectedAppointmentDate,
        notes: appointmentNotes,
      });
    }
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
          <GeneralInfo
            title="Vợ"
            includeVaccines={true}
            initialData={wifeGeneralInfo}
            onDataChange={setWifeGeneralInfo}
          />
          <LabTests
            title="Vợ"
            tests={wifeLabTests}
            onTestsChange={setWifeLabTests}
          />
        </TabsContent>

        <TabsContent value="husband" className="space-y-6">
          <GeneralInfo
            title="Chồng"
            includeVaccines={false}
            initialData={husbandGeneralInfo}
            onDataChange={setHusbandGeneralInfo}
          />
          <LabTests
            title="Chồng"
            tests={husbandLabTests}
            onTestsChange={setHusbandLabTests}
          />

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
                {/* Use RadioGroup for treatment methods */}
                <RadioGroup
                  value={selectedTreatmentMethod}
                  onValueChange={(value: TreatmentMethod) => setSelectedTreatmentMethod(value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="iui"
                      id="iui-radio"
                      className="data-[state=checked]:bg-[color:var(--deep-taupe)] data-[state=checked]:border-[color:var(--deep-taupe)]"
                    />
                    <Label htmlFor="iui-radio" className="text-sm font-medium">
                      IUI (Thụ tinh nhân tạo trong tử cung)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="ivf"
                      id="ivf-radio"
                      className="data-[state=checked]:bg-[color:var(--deep-taupe)] data-[state=checked]:border-[color:var(--deep-taupe)]"
                    />
                    <Label htmlFor="ivf-radio" className="text-sm font-medium">
                      IVF (Thụ tinh ống nghiệm)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="other"
                      id="other-radio"
                      className="data-[state=checked]:bg-[color:var(--deep-taupe)] data-[state=checked]:border-[color:var(--deep-taupe)]"
                    />
                    <Label htmlFor="other-radio" className="text-sm font-medium">
                      Khác
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="none"
                      id="none-radio"
                      className="data-[state=checked]:bg-[color:var(--deep-taupe)] data-[state=checked]:border-[color:var(--deep-taupe)]"
                    />
                    <Label htmlFor="none-radio" className="text-sm font-medium">
                      Chưa có khuyến nghị cụ thể
                    </Label>
                  </div>
                </RadioGroup>

                <Button
                  onClick={handleSaveRecord}
                  className="bg-[color:var(--button-primary-bg)] hover:bg-[color:var(--button-hover-bg)] text-[color:var(--button-primary-text)] px-8 py-2"
                >
                  Hoàn thành giai đoạn chuyên khoa
                </Button>
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
            <Button variant="outline" onClick={onBackToDashboard} className="mb-4">
              ← Quay về Dashboard
            </Button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[color:var(--text-accent)]">Hồ sơ bệnh nhân</h1>

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

          <TabsContent value="specialty">{renderSpecialtySubTabs()}</TabsContent>

          <TabsContent value="intervention">{renderInterventionSubTabs()}</TabsContent>

          <TabsContent value="post-intervention">
            <PostIntervention />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Treatment;