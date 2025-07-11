
import { useState } from "react";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Separator } from "@components/ui/separator";
import { Eye, Phone, Mail, Calendar, Clock, Building2, User } from "lucide-react";

interface Receptionist {
  id: string;
  name: string;
  department: string;
  shift: string;
  totalAppointments: number;
  todayAppointments: number;
  status: string;
  avatar: string;
  phone: string;
  email: string;
  hireDate: string;
  experience: string;
}

interface ReceptionistDetailsDialogProps {
  receptionist: Receptionist;
  trigger?: React.ReactNode;
}

export const ReceptionistDetailsDialog = ({ receptionist, trigger }: ReceptionistDetailsDialogProps) => {
  const [open, setOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Available</Badge>;
      case "On Break":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">On Break</Badge>;
      case "Unavailable":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Unavailable</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm">
      <Eye className="w-4 h-4 mr-2" />
      View Details
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Receptionist Details</DialogTitle>
          <DialogDescription>
            Complete information about {receptionist.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-[#D9CAC2]">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-[#D9CAC2] text-[#4D3C2D] font-semibold text-xl">
                {receptionist.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-[#4D3C2D]">{receptionist.name}</h3>
              <p className="text-sm text-[#4D3C2D]/60 font-medium">{receptionist.id}</p>
              <div className="mt-2">
                {getStatusBadge(receptionist.status)}
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[#4D3C2D] flex items-center gap-2">
              <User className="w-4 h-4" />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#4D3C2D]/60" />
                <span className="text-sm">{receptionist.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#4D3C2D]/60" />
                <span className="text-sm">{receptionist.email}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Work Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[#4D3C2D] flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Work Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-[#4D3C2D]/70">Department</p>
                <p className="text-sm font-semibold">{receptionist.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#4D3C2D]/70">Shift</p>
                <p className="text-sm font-semibold">{receptionist.shift}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#4D3C2D]/70">Hire Date</p>
                <p className="text-sm font-semibold">{receptionist.hireDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#4D3C2D]/70">Experience</p>
                <p className="text-sm font-semibold">{receptionist.experience}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Performance Stats */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[#4D3C2D] flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Performance Statistics
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-[#EAE4E1]/30 rounded-lg">
                <div className="text-2xl font-bold text-[#4D3C2D]">{receptionist.totalAppointments}</div>
                <div className="text-xs text-[#4D3C2D]/70">Total Tasks Handled</div>
              </div>
              <div className="text-center p-4 bg-[#EAE4E1]/30 rounded-lg">
                <div className="text-2xl font-bold text-[#4D3C2D]">{receptionist.todayAppointments}</div>
                <div className="text-xs text-[#4D3C2D]/70">Today's Tasks</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};