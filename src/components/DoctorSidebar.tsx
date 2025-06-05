
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent
} from '@components/ui/sidebar';
import { Button } from '@components/ui/button';
import { BarChart3, Calendar, Users, LogOut, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DoctorSidebarProps {
  activeTab: 'dashboard' | 'appointments' | 'patients';
  onTabChange: (tab: 'dashboard' | 'appointments' | 'patients') => void;
}

const menuItems = [
  {
    title: 'Dashboard',
    icon: BarChart3,
    key: 'dashboard' as const,
  },
  {
    title: 'Appointments',
    icon: Calendar,
    key: 'appointments' as const,
  },
  {
    title: 'Patients',
    icon: Users,
    key: 'patients' as const,
  },
];

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({ activeTab, onTabChange }) => {
  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
  };

  return (
    <Sidebar className="w-64 border-r theme-primary-bg">
      <SidebarHeader className="p-6 border-b border-[#3a2a1f]">
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-semibold text-white">Bác sĩ Nguyễn Thanh Nam</h2>
          <p className="text-sm text-[#D9CAC2]">Khoa Hiếm Muộn</p>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-[#4D3C2D]">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link to="/">
                  <SidebarMenuButton
                    className="w-full justify-start text-white hover:bg-[#3a2a1f] transition-colors"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    <span>Trang chủ</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton 
                    onClick={() => onTabChange(item.key)}
                    isActive={activeTab === item.key}
                    className={`w-full justify-start text-white hover:bg-[#3a2a1f] transition-colors ${
                      activeTab === item.key 
                        ? 'bg-[#D9CAC2] text-[#4D3C2D] hover:bg-[#c9b8aa]' 
                        : 'hover:text-[#EAE4E1]'
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-[#4D3C2D] border-t border-[#3a2a1f]">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-[#EAE4E1] hover:text-white hover:bg-[#3a2a1f]"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
