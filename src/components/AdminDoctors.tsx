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
import { AddDoctorDialog } from "@components/AddDoctorDialog";
import { CSVImportDialog } from "@components/CSVImportDialog";
import { DoctorService} from '@services/doctorService'
import { Toast } from '@components/ui/toast'



const Doctors = () => {

  const doctorsData = [
    {
      id: "WNH-GM-001",
      name: "Dr. Petra Winsbury",
      department: "General Medicine",
      specialist: "Routine Check-Ups",
      totalPatients: 150,
      todayAppointments: 10,
      status: "Available",
      avatar: "PW",
      phone: "+1 555-234-5678",
      email: "petra.wins@wellnesthospital.com"
    },
    {
      id: "WNH-CD-001",
      name: "Dr. Olivia Martinez",
      department: "Cardiology",
      specialist: "Heart Specialist",
      totalPatients: 200,
      todayAppointments: 0,
      status: "Unavailable",
      avatar: "OM",
      phone: "+1 555-234-5679",
      email: "olivia.martinez@wellnesthospital.com"
    },
    {
      id: "WNH-PD-001",
      name: "Dr. Damian Sanchez",
      department: "Pediatrics",
      specialist: "Child Health",
      totalPatients: 180,
      todayAppointments: 12,
      status: "Available",
      avatar: "DS",
      phone: "+1 555-234-5680",
      email: "damian.sanchez@wellnesthospital.com"
    },
    {
      id: "WNH-DM-001",
      name: "Dr. Chloe Harrington",
      department: "Dermatology",
      specialist: "Skin Specialist",
      totalPatients: 120,
      todayAppointments: 8,
      status: "Available",
      avatar: "CH",
      phone: "+1 555-234-5681",
      email: "chloe.harrington@wellnesthospital.com"
    },
    {
      id: "WNH-GM-002",
      name: "Dr. Emily Smith",
      department: "General Medicine",
      specialist: "Routine Check-Ups",
      totalPatients: 160,
      todayAppointments: 0,
      status: "Unavailable",
      avatar: "ES",
      phone: "+1 555-234-5682",
      email: "emily.smith@wellnesthospital.com"
    },
    {
      id: "WNH-CD-002",
      name: "Dr. Samuel Thompson",
      department: "Cardiology",
      specialist: "Heart Specialist",
      totalPatients: 210,
      todayAppointments: 14,
      status: "Available",
      avatar: "ST",
      phone: "+1 555-234-5683",
      email: "samuel.thompson@wellnesthospital.com"
    },
  ];

  const csvTemplateFields = [
    "Email",
    "Name",
    "Specialization",
    "Phone",
    "License Number",
    "Degree",
    "Address",
    "Date of Birth",
    "Gender",
    "Is Available",
    "Year Of Experience"
  ];
  const csvSampleData = [
    {
      "Email": "doctor@gmail.com",
      "Name": "Dr. Long Dinh",
      "Specialization": "IVF_SPECIALIST",
      "Phone": "0123456789",
      "License Number": "LIC123456",
      "Degree": "MD",
      "Address": "123 Clinic Street",
      "Date of Birth": "1980-05-20",
      "Gender": "MALE",
      "Is Available": "true",
      "Year Of Experience": "6",
    },
    {
      "Email": "doctor2@gmail.com",
      "Name": "Dr. Long Hoang Dinh",
      "Specialization": "IUI_SPECIALIST",
      "Phone": "0123456789",
      "License Number": "LIC1234568",
      "Degree": "MD",
      "Address": "123 Clinic Street",
      "Date of Birth": "1980-05-20",
      "Gender": "MALE",
      "Is Available": "true",
      "Year Of Experience": "5"
    }
  ];

  const handleCSVImport = async (data) => {
    const result = await DoctorService.importFromCSV(data);

    if (!result.success) {
      console.log('fail');
      return;
    }


  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Available</Badge>;
      case "Busy":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Busy</Badge>;
      case "Unavailable":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Unavailable</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleViewDetails = (doctorId: string) => {
    console.log("Viewing details for:", doctorId);
    // Optionally open a modal or setDoctorDetailView here
  };

  return (
    <div className="flex flex-col h-screen bg-[#EAE4E1]">
      <Header title="Doctors" subtitle="Manage and view all doctor information" />

      <div className="flex-1 overflow-auto p-6">
        {/* Enhanced Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#4D3C2D] mb-2">Medical Team</h1>
              <p className="text-[#4D3C2D]/70">Manage your hospital's medical professionals</p>
            </div>
            <div className="flex gap-3">
              <CSVImportDialog
                title="Doctors"
                templateFields={csvTemplateFields}
                sampleData={csvSampleData}
                onImport={handleCSVImport}
                trigger={
                  <Button variant="outline" className="border-[#4D3C2D] text-[#4D3C2D] hover:bg-[#4D3C2D] hover:text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Doctors
                  </Button>
                }
              />
              <AddDoctorDialog />
            </div>
          </div>

          {/* Enhanced Stats Cards with better visual hierarchy */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="bg-white/90 border-[#D9CAC2] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-[#4D3C2D] mb-1">6</div>
                    <div className="text-sm font-medium text-[#4D3C2D]/70">Total Doctors</div>
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
                    <div className="text-3xl font-bold text-red-600 mb-1">2</div>
                    <div className="text-sm font-medium text-[#4D3C2D]/70">Unavailable</div>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 border-[#D9CAC2] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-[#4D3C2D] mb-1">44</div>
                    <div className="text-sm font-medium text-[#4D3C2D]/70">Today's Appointments</div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filter and Search Bar */}
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
                <SelectValue placeholder="Treatment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Treatment Type</SelectItem>
                <SelectItem value="general">IUI</SelectItem>
                <SelectItem value="cardiology">IVF</SelectItem>
                <SelectItem value="pediatrics">Pediatrics</SelectItem>
                <SelectItem value="dermatology">Dermatology</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px] bg-white/80 border-[#D9CAC2]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Enhanced Doctors Grid - 3 columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {doctorsData.map((doctor) => (
            <Card key={doctor.id} className="bg-white/95 border-[#D9CAC2] hover:shadow-xl transition-all duration-300 hover:bg-white hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-14 h-14 border-2 border-[#D9CAC2]">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-[#D9CAC2] text-[#4D3C2D] font-semibold text-lg">
                        {doctor.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-[#4D3C2D] text-lg">{doctor.name}</h3>
                      <p className="text-sm text-[#4D3C2D]/60 font-medium">{doctor.id}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-[#4D3C2D] hover:bg-[#D9CAC2]/20">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border-[#D9CAC2]">
                      <DropdownMenuItem onClick={() => handleViewDetails(doctor.id)} className="text-[#4D3C2D]">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[#4D3C2D]">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-[#4D3C2D]">{doctor.department}</p>
                    <p className="text-sm text-[#4D3C2D]/60">{doctor.specialist}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-[#EAE4E1]/50 rounded-lg">
                      <div className="text-lg font-bold text-[#4D3C2D]">{doctor.totalPatients}</div>
                      <div className="text-xs text-[#4D3C2D]/70">Total Patients</div>
                    </div>
                    <div className="text-center p-3 bg-[#EAE4E1]/50 rounded-lg">
                      <div className="text-lg font-bold text-[#4D3C2D]">{doctor.todayAppointments}</div>
                      <div className="text-xs text-[#4D3C2D]/70">Today's Appts</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    {getStatusBadge(doctor.status)}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(doctor.id)}
                      className="border-[#4D3C2D] text-[#4D3C2D] hover:bg-[#4D3C2D] hover:text-white"
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8 p-4">
          <div className="text-sm text-[#4D3C2D]/70">
            Showing 6 out of 6 doctors
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

export default Doctors;