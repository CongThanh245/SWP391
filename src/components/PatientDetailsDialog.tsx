
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
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Separator } from "@components/ui/separator";
import { Eye, Phone, Mail, MapPin, Calendar, User, FileText, AlertCircle } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  lastVisit: string;
  nextAppointment: string;
  doctor: string;
  status: string;
  condition: string;
  treatmentPlan: string;
  medicalHistory: string;
  allergies: string;
  emergencyContact: string;
}

interface PatientDetailsDialogProps {
  patient: Patient;
}

export const PatientDetailsDialog = ({ patient }: PatientDetailsDialogProps) => {
  const [open, setOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
      case "In Treatment":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">In Treatment</Badge>;
      case "Completed":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Completed</Badge>;
      case "Inactive":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>
            Complete patient information and medical history
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Patient Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-20 h-20 mb-3">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-lg">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{patient.name}</h3>
                <p className="text-sm text-muted-foreground">{patient.id}</p>
                <div className="mt-2">{getStatusBadge(patient.status)}</div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Age & Gender</p>
                  <p className="text-sm text-muted-foreground">{patient.age} years, {patient.gender}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{patient.phone}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{patient.email}</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{patient.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Assigned Doctor</p>
                <p className="text-sm text-muted-foreground">{patient.doctor}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Current Condition</p>
                <p className="text-sm text-muted-foreground">{patient.condition}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Treatment Plan</p>
                <p className="text-sm text-muted-foreground">{patient.treatmentPlan}</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium mb-1">Medical History</p>
                <p className="text-sm text-muted-foreground">{patient.medicalHistory}</p>
              </div>
              
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Allergies</p>
                  <p className="text-sm text-muted-foreground">{patient.allergies}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Emergency Contact</p>
                <p className="text-sm text-muted-foreground">{patient.emergencyContact}</p>
              </div>
            </CardContent>
          </Card>

          {/* Appointment History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Appointment History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm font-medium">Last Visit</p>
                <p className="text-sm text-muted-foreground">{patient.lastVisit}</p>
              </div>
              
              {patient.nextAppointment && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-800">Next Appointment</p>
                  <p className="text-sm text-blue-600">{patient.nextAppointment}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Recent Visits</p>
                <div className="space-y-2">
                  <div className="border rounded-lg p-2">
                    <p className="text-xs font-medium">Jan 15, 2024</p>
                    <p className="text-xs text-muted-foreground">Routine Check-up</p>
                  </div>
                  <div className="border rounded-lg p-2">
                    <p className="text-xs font-medium">Dec 28, 2023</p>
                    <p className="text-xs text-muted-foreground">Follow-up Visit</p>
                  </div>
                  <div className="border rounded-lg p-2">
                    <p className="text-xs font-medium">Dec 10, 2023</p>
                    <p className="text-xs text-muted-foreground">Initial Consultation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};