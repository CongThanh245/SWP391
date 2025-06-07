import { Sidebar } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AppointmentsContent } from '@components/AppointmentsContent'
import { PatientsContent } from '@components/PatientsContent'
import { DashboardContent } from '@components/DashboardContent'
import { SidebarProvider } from '@components/ui/sidebar';
import { DoctorSidebar } from '@components/DoctorSidebar'
import { getDoctorsStats } from '@api/doctorApi';
interface DoctorDashBoardProps {
    activeTab: 'dashboard' | 'appointments' | 'patients';
    onTabChange: (tab: 'dashboard' | 'appointments' | 'patients') => void;
    onPatientSelect?: (patientId: string) => void;
}

interface DoctorStats {
    ivfThisMonth: number;
    iuiThisMonth: number;
    completedTreatments: number;
    totalPatients: number;
    activePatients: number;
    todayAppointments: number;
}

const DoctorDashboard: React.FC<DoctorDashBoardProps> = ({
    onPatientSelect
}) => {
    const [stats, setStats] = useState<DoctorStats | null>(null);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'patients'>('dashboard');

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
    const renderContent = () => {
        switch (activeTab) {
            case 'appointments':
                return <AppointmentsContent onPatientSelect={onPatientSelect} />;
            case 'patients':
                return <PatientsContent onPatientSelect={onPatientSelect} />;
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
                <DoctorSidebar activeTab={activeTab} onTabChange={setActiveTab} />
                <main className='flex-1'>
                    {renderContent()}
                </main>
            </div>
        </SidebarProvider>
    );
};
export default DoctorDashboard;