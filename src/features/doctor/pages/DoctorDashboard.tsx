import { Sidebar } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AppointmentsContent } from '@components/AppointmentsContent'
import { PatientsContent } from '@components/PatientsContent'
import { DashboardContent } from '@components/DashboardContent'
import { SidebarProvider } from '@components/ui/sidebar';
import { DoctorSidebar } from '@components/DoctorSidebar'
import { getDoctorsStats } from '@api/doctorApi';
import Treatment from './Treatment'
interface DoctorDashBoardProps {
    activeTab: 'dashboard' | 'appointments' | 'patients';
    onTabChange: (tab: 'dashboard' | 'appointments' | 'patients') => void;
    onPatientSelect?: (patientId: string) => void;
}

export interface DoctorStats {
  todayAppointments: number;
  diffFromYesterday: number;
  activePatients: number;
  newThisWeek: number;
  completedTreatments: number;
  completedRateChangeFromLastMonth: number;
  successRateThisMonth: number;
  successRateChangeFromLastMonth: number;
  successRateByProtocol: {
    // Tùy thuộc vào việc bạn có dùng dữ liệu này không, giữ hoặc xóa
    additionalProp1?: number;
    additionalProp2?: number;
    additionalProp3?: number;
    // Nếu API trả về trực tiếp
    IVF?: number;
    IUI?: number;
  };
  treatmentDistribution: {
    // API của bạn trả về các key cụ thể này
    IVF: number;
    IUI: number;
    // Thêm các loại điều trị khác nếu API của bạn cung cấp
    // Ví dụ: "Other" nếu có
    Other?: number;
  };
}

const DoctorDashboard: React.FC<DoctorDashBoardProps> = ({
    onPatientSelect
}) => {
    const [stats, setStats] = useState<DoctorStats | null>(null);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'patients'>('dashboard');
    const [showPatientRecord, setShowPatientRecord] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDoctorsStats();
                setStats(data);
            } catch (error) {
                console.log('Failed to fetch doctor stats:', error);
            }
        };
        fetchStats();
    }, []);

    const handlePatientSelect = (patientId: string) => {
        setSelectedPatientId(patientId);
        setShowPatientRecord(true);
    };

    const handleBackToDashboard = () => {
        setShowPatientRecord(false);
        setSelectedPatientId(null);
    };
    const renderContent = () => {
        if (showPatientRecord && selectedPatientId) {
            return (
                <Treatment
                    onBackToDashboard={handleBackToDashboard}
                    patientId={selectedPatientId}
                />
            );
        }


        switch (activeTab) {
            case 'appointments':
                return <AppointmentsContent onPatientSelect={handlePatientSelect} />;
            case 'patients':
                return <PatientsContent onPatientSelect={handlePatientSelect} />;
            default:
                return stats ? (
                    <DashboardContent stats={stats} />
                ) : (
                    <div className="p-4 text-gray-500">Đang tải thống kê...</div>
                );
        }
    };

    return (
        <SidebarProvider>
            <div className='min-h-screen flex w-full theme-gradient-bg'>
                {!showPatientRecord && (
                    <DoctorSidebar activeTab={activeTab} onTabChange={setActiveTab} />
                )}

                <main className='flex-1'>
                    {renderContent()}
                </main>
            </div>
        </SidebarProvider>
    );
};
export default DoctorDashboard;