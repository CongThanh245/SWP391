import { SidebarTrigger } from "@components/ui/sidebar";
import { Bell, Search, Settings } from "lucide-react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-6 bg-background border-b border-border">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search anything"
            className="pl-10 w-80"
          />
        </div>
        
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </Button>
        
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>AW</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <div className="font-medium">Alfredo Westervelt</div>
            <div className="text-muted-foreground">Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}