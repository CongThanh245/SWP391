import { Sidebar } from 'lucide-react';
import React from 'react';
import {AppointmentsContent} from '@components/AppointmentsContent'
import {PatientsContent} from '@components/PatientsContent'
import {DashboardContent} from '@components/DashboardContent'
import { SidebarProvider } from '@components/ui/sidebar';
import {DoctorSidebar} from '@components/DoctorSidebar'
interface DoctorDashBoardProps {
    activeTab: 'dashboard' | 'appointments' | 'patients';
    onTabChange: (tab: 'dashboard' | 'appointments' | 'patients') => void;
    onPatientSelect?: (patientId: string) => void;
}

const DoctorDashboard: React.FC<DoctorDashBoardProps> = ({
    activeTab,
    onTabChange,
    onPatientSelect
}) => {
    const renderContent = () => {
        switch (activeTab) {
            case 'appointments':
                return <AppointmentsContent onPatientSelect={onPatientSelect} />;
            case 'patients':
                return <PatientsContent onPatientSelect={onPatientSelect} />;
            default:
                return <DashboardContent />;
        }
    };

    return (
        <SidebarProvider>
            <div className='min-h-screen flex w-full theme-gradient-bg'>
                <DoctorSidebar activeTab={activeTab} onTabChange={onTabChange} />
                <main className='flex-1'>
                    {renderContent()}
                </main>
            </div>
        </SidebarProvider>
    );
};
export default DoctorDashboard;