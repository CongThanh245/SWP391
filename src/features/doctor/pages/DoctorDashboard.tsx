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
                // Pass selectedPatientId if needed: patientId={selectedPatientId}
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