import {
  Calendar,
  Users,
  UserCheck,
  ClipboardList,
  BarChart3,
  FileText,
  Settings,
  Stethoscope,
  CalendarDays,
  Heart,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@components/ui/sidebar";
import { Button } from '@components/ui/button';
import { logout } from '@utils/authUtils';
import { useNavigate } from 'react-router-dom';
interface AdminSidebarProps {
  activeTab: 'dashboard' | 'doctors' | 'patients';
  onTabChange: (tab: AdminSidebarProps['activeTab']) => void;
}

const menuItems: { title: string; key: AdminSidebarProps['activeTab']; icon: React.ElementType }[] = [
  { title: "Dashboard", key: "dashboard", icon: BarChart3 },
  { title: "Doctors", key: "doctors", icon: UserCheck },
  { title: "Patients", key: "patients", icon: Users },
];

const managementItems = [
  { title: "Documents", icon: FileText },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  return (
    <Sidebar className="w-64 border-r theme-primary-bg">
      <SidebarHeader className="p-6 border-b border-[#3a2a1f]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-white">WellNest</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#4D3C2D] text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-sm font-semibold text-[#D9CAC2]">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.key)}
                    isActive={activeTab === item.key}
                    className={`w-full justify-start hover:bg-[#3a2a1f] transition-colors ${
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

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-sm font-semibold text-[#D9CAC2]">Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    disabled
                    className="w-full justify-start text-[#EAE4E1]/50 cursor-not-allowed"
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

      <SidebarFooter className="p-6 bg-[#4D3C2D] border-t border-[#3a2a1f] text-[#EAE4E1] text-xs">
        <Button
          variant="ghost"
          className="w-full justify-start text-[#EAE4E1] hover:text-white hover:bg-[#3a2a1f]"
          onClick={() => logout(navigate)}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
        © 2024 WellNest Hospital
      </SidebarFooter>
    </Sidebar>
  );
};
