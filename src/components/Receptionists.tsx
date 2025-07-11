
import { Header } from "@components/AdminHeader";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Search, Filter, MoreHorizontal, Edit, Trash2, Eye, Upload, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { AddReceptionistDialog } from "@components/AddReceptionistDialog";
import { CSVImportDialog } from "@components/CSVImportDialog";
import { EditReceptionistDialog } from "@components/EditReceptionistDialog";
import { ReceptionistDetailsDialog } from "@components/ReceptionistDetailsDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import { useToast } from "@hooks/use-toast";

const Receptionists = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const receptionistsData = [
    {
      id: "WNH-RC-001",
      name: "Sarah Johnson",
      department: "Front Desk",
      shift: "Morning Shift",
      totalAppointments: 250,
      todayAppointments: 18,
      status: "Available",
      avatar: "SJ",
      phone: "+1 555-234-5678",
      email: "sarah.johnson@wellnesthospital.com",
      hireDate: "2023-01-15",
      experience: "2 years"
    },
    {
      id: "WNH-RC-002",
      name: "Michael Chen",
      department: "Front Desk",
      shift: "Evening Shift",
      totalAppointments: 180,
      todayAppointments: 0,
      status: "Unavailable",
      avatar: "MC",
      phone: "+1 555-234-5679",
      email: "michael.chen@wellnesthospital.com",
      hireDate: "2023-03-20",
      experience: "1.5 years"
    },
    {
      id: "WNH-RC-003",
      name: "Emma Rodriguez",
      department: "Admissions",
      shift: "Morning Shift",
      totalAppointments: 220,
      todayAppointments: 15,
      status: "Available",
      avatar: "ER",
      phone: "+1 555-234-5680",
      email: "emma.rodriguez@wellnesthospital.com",
      hireDate: "2022-11-10",
      experience: "3 years"
    },
    {
      id: "WNH-RC-004",
      name: "David Wilson",
      department: "Patient Services",
      shift: "Night Shift",
      totalAppointments: 160,
      todayAppointments: 12,
      status: "Available",
      avatar: "DW",
      phone: "+1 555-234-5681",
      email: "david.wilson@wellnesthospital.com",
      hireDate: "2023-05-08",
      experience: "1 year"
    },
    {
      id: "WNH-RC-005",
      name: "Lisa Thompson",
      department: "Insurance Verification",
      shift: "Morning Shift",
      totalAppointments: 190,
      todayAppointments: 0,
      status: "On Break",
      avatar: "LT",
      phone: "+1 555-234-5682",
      email: "lisa.thompson@wellnesthospital.com",
      hireDate: "2022-08-22",
      experience: "2.5 years"
    },
    {
      id: "WNH-RC-006",
      name: "James Anderson",
      department: "Patient Services",
      shift: "Evening Shift",
      totalAppointments: 200,
      todayAppointments: 20,
      status: "Available",
      avatar: "JA",
      phone: "+1 555-234-5683",
      email: "james.anderson@wellnesthospital.com",
      hireDate: "2023-02-14",
      experience: "1.8 years"
    },
  ];

  const csvTemplateFields = ["Name", "Department", "Shift", "Phone", "Email", "Status"];
  const csvSampleData = [
    {
      Name: "John Smith",
      Department: "Front Desk", 
      Shift: "Morning Shift",
      Phone: "+1 555-123-4567",
      Email: "john.smith@hospital.com",
      Status: "Available"
    },
    {
      Name: "Jane Doe",
      Department: "Admissions",
      Shift: "Evening Shift",
      Phone: "+1 555-234-5678", 
      Email: "jane.doe@hospital.com",
      Status: "Available"
    }
  ];

  const handleCSVImport = (data) => {
    console.log("Importing receptionists:", data);
    return { success: false, message: "Import Failed: An unknown error occurred." };
  };

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

  const handleUpdateReceptionist = (updatedReceptionist) => {
    console.log("Receptionist updated:", updatedReceptionist);
  };

  const handleDeleteReceptionist = (receptionistId: string) => {
    console.log("Deleting receptionist:", receptionistId);
    toast({
      title: "Receptionist Deleted",
      description: "Receptionist has been successfully removed.",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[#EAE4E1]">
      <Header title="Receptionists" subtitle="Manage and view all receptionist information" />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#4D3C2D] mb-2">Reception Team</h1>
              <p className="text-[#4D3C2D]/70">Manage your hospital's reception staff</p>
            </div>
            <div className="flex gap-3">
              {/* <CSVImportDialog
                title="Receptionists"
                templateFields={csvTemplateFields}
                sampleData={csvSampleData}
                onImport={handleCSVImport}
                trigger={
                  <Button variant="outline" className="border-[#4D3C2D] text-[#4D3C2D] hover:bg-[#4D3C2D] hover:text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Receptionists
                  </Button>
                }
              /> */}
              <AddReceptionistDialog />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="bg-white/90 border-[#D9CAC2] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-[#4D3C2D] mb-1">6</div>
                    <div className="text-sm font-medium text-[#4D3C2D]/70">Total Receptionists</div>
                  </div>
                  <div className="w-12 h-12 bg-[#D9CAC2]/20 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-[#D9CAC2] rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 border-[#D9CAC2] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-green-600 mb-1">4</div>
                    <div className="text-sm font-medium text-[#4D3C2D]/70">Available Now</div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 border-[#D9CAC2] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-yellow-600 mb-1">1</div>
                    <div className="text-sm font-medium text-[#4D3C2D]/70">On Break</div>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 border-[#D9CAC2] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-[#4D3C2D] mb-1">65</div>
                    <div className="text-sm font-medium text-[#4D3C2D]/70">Today's Tasks</div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4D3C2D]/60 w-4 h-4" />
            <Input
              placeholder="Search name, ID, department..."
              className="pl-10 bg-white/80 border-[#D9CAC2] focus:border-[#4D3C2D]"
            />
          </div>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-[180px] bg-white/80 border-[#D9CAC2]">
                <Filter className="w-4 h-4 mr-2 text-[#4D3C2D]" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="front-desk">Front Desk</SelectItem>
                <SelectItem value="admissions">Admissions</SelectItem>
                <SelectItem value="patient-services">Patient Services</SelectItem>
                <SelectItem value="insurance">Insurance Verification</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px] bg-white/80 border-[#D9CAC2]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="on-break">On Break</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {receptionistsData.map((receptionist) => (
            <Card key={receptionist.id} className="bg-white/95 border-[#D9CAC2] hover:shadow-xl transition-all duration-300 hover:bg-white hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-14 h-14 border-2 border-[#D9CAC2]">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-[#D9CAC2] text-[#4D3C2D] font-semibold text-lg">
                        {receptionist.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-[#4D3C2D] text-lg">{receptionist.name}</h3>
                      <p className="text-sm text-[#4D3C2D]/60 font-medium">{receptionist.id}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-[#4D3C2D] hover:bg-[#D9CAC2]/20">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border-[#D9CAC2]">
                      <DropdownMenuItem asChild>
                        <ReceptionistDetailsDialog receptionist={receptionist} />
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <EditReceptionistDialog receptionist={receptionist} onUpdate={handleUpdateReceptionist} />
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <AlertDialog>
                          <AlertDialogTrigger className="w-full text-left px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer">
                            <div className="flex items-center">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </div>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Receptionist</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {receptionist.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteReceptionist(receptionist.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-[#4D3C2D]">{receptionist.department}</p>
                    <p className="text-sm text-[#4D3C2D]/60">{receptionist.shift}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-[#EAE4E1]/50 rounded-lg">
                      <div className="text-lg font-bold text-[#4D3C2D]">{receptionist.totalAppointments}</div>
                      <div className="text-xs text-[#4D3C2D]/70">Total Tasks</div>
                    </div>
                    <div className="text-center p-3 bg-[#EAE4E1]/50 rounded-lg">
                      <div className="text-lg font-bold text-[#4D3C2D]">{receptionist.todayAppointments}</div>
                      <div className="text-xs text-[#4D3C2D]/70">Today's Tasks</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    {getStatusBadge(receptionist.status)}
                    <ReceptionistDetailsDialog 
                      receptionist={receptionist}
                      trigger={
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-[#4D3C2D] text-[#4D3C2D] hover:bg-[#4D3C2D] hover:text-white"
                        >
                          View Profile
                        </Button>
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-8 p-4">
          <div className="text-sm text-[#4D3C2D]/70">
            Showing 6 out of 6 receptionists
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-[#D9CAC2] text-[#4D3C2D]">Previous</Button>
            <Button variant="outline" size="sm" className="bg-[#4D3C2D] text-white border-[#4D3C2D]">1</Button>
            <Button variant="outline" size="sm" className="border-[#D9CAC2] text-[#4D3C2D]">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receptionists;