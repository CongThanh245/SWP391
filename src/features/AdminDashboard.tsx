import React, { useState } from 'react';
import { SidebarProvider } from '@components/ui/sidebar';
import { AdminSidebar } from '@components/admin-sidebar';
import Dashboard from '@components/Dashboard';
import Doctors from '@components/AdminDoctors';
import Patients from '@components/AdminPatient';
import Receptionists  from '@components/Receptionists'

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'doctors' | 'patients' | 'receptionist'>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'doctors':
        return <Doctors />;
      case 'patients':
        return <Patients />;
      case 'receptionist':
        return <Receptionists />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-hidden">
          {renderContent()}
        </main>
        
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;