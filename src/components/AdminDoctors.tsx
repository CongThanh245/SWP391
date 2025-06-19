"use client";

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
import { DoctorService } from '@services/doctorService';
// Removed: import { useToast } from "@components/ui/use-toast"; // This is removed
import React, { useState, useEffect, useCallback } from 'react';
import { UIDoctorData } from '@services/doctorService';
import { getDoctorStats } from '@api/adminApi';


// Interface for pagination information
interface PaginatedDoctorsInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

const Doctors = () => {
  // Removed: const { toast } = useToast(); // This line is removed

  const [doctorsData, setDoctorsData] = useState<UIDoctorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    availableDoctors: 0,
    unavailableDoctors: 0,
    todayAppointments: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [paginationInfo, setPaginationInfo] = useState<PaginatedDoctorsInfo>({
    page: 0,
    size: pageSize,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });

  const getInitials = useCallback((name: string) => {
    if (!name || typeof name !== 'string') {
      return 'DR';
    }
    const parts = name.trim().split(' ').filter(part => part.length > 0);
    if (parts.length === 0) {
      return 'DR';
    }
    return parts
      .map(part => part[0]?.toUpperCase() || '')
      .join('')
      .substring(0, 3);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const doctorsResult = await DoctorService.getAllDoctors(
        currentPage,
        pageSize,
        searchQuery,
        selectedSpecialization === 'all' ? '' : selectedSpecialization,
        selectedStatus === 'all' ? '' : selectedStatus
      );

      if (!doctorsResult.doctors || !Array.isArray(doctorsResult.doctors)) {
        console.warn('No doctors data received or invalid format from DoctorService.getAllDoctors');
        setDoctorsData([]);
      } else {
        const doctorsDataFormatted: UIDoctorData[] = doctorsResult.doctors.map((doctor, index) => ({
          id: doctor.doctorId || `DOCTOR-${index}`,
          name: doctor.doctorName || 'Unknown Doctor',
          department: 'Ferticare',
          specialist: doctor.specialization || 'General',
          totalPatients: doctor.totalPatients ?? 0,
          todayAppointments: doctor.todayAppointments ?? 0,
          status: doctor.available && doctor.active ? 'Available' : 'Unavailable',
          avatar: getInitials(doctor.doctorName || 'Unknown Doctor'),
          phone: doctor.phone || '',
          email: doctor.doctorEmail || '',
          degree: doctor.degree || '',
          experience: doctor.yearOfExperience ?? 0,
          about: doctor.about || '',
          address: doctor.doctorAddress || '',
          joinDate: doctor.joinDate || '',
        }));
        setDoctorsData(doctorsDataFormatted);
      }

      setPaginationInfo({
        page: doctorsResult.page,
        size: doctorsResult.size,
        totalElements: doctorsResult.totalElements,
        totalPages: doctorsResult.totalPages,
        first: doctorsResult.first,
        last: doctorsResult.last,
      });

      const statsResult = await getDoctorStats();
      setStats(statsResult);

    } catch (error) {
      console.error('Failed to fetch data:', error);
      setDoctorsData([]);
      setStats({ totalDoctors: 0, availableDoctors: 0, unavailableDoctors: 0, todayAppointments: 0 });
      // Changed to alert for feedback
      alert("Error: Failed to load doctor data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    searchQuery,
    selectedSpecialization,
    selectedStatus,
    getInitials,
    // Removed toast from dependencies
  ]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [fetchData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  const handleSpecializationChange = (value: string) => {
    setSelectedSpecialization(value);
    setCurrentPage(0);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(0);
  };

  const csvTemplateFields = [
    "Email", "Name", "Specialization", "Phone", "License Number",
    "Degree", "Address", "Date of Birth", "Gender", "Is Available", "Year Of Experience"
  ];
  const csvSampleData = [
    {
      "Email": "doctor@gmail.com", "Name": "Dr. Long Dinh", "Specialization": "IVF_SPECIALIST",
      "Phone": "0123456789", "License Number": "LIC123456", "Degree": "MD",
      "Address": "123 Clinic Street", "Date of Birth": "1980-05-20", "Gender": "MALE",
      "Is Available": "true", "Year Of Experience": "6",
    },
    {
      "Email": "doctor2@gmail.com", "Name": "Dr. Long Hoang Dinh", "Specialization": "IUI_SPECIALIST",
      "Phone": "0123456789", "License Number": "LIC1234568", "Degree": "MD",
      "Address": "123 Clinic Street", "Date of Birth": "1980-05-20", "Gender": "MALE",
      "Is Available": "true", "Year Of Experience": "5"
    }
  ];

  const handleCSVImport = async (data: any[]) => {
    setLoading(true);
    const result = await DoctorService.importFromCSV(data);
    setLoading(false);

    if (result.success) {
      alert("Import Successful! " + result.message); // Using alert for success
      fetchData();
    } else {
      alert("Import Failed: " + result.message); // Using alert for failure
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
    // Implement navigation or modal display for doctor details here
  };

  const handleNextPage = () => {
    if (!paginationInfo.last) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (!paginationInfo.first) {
      setCurrentPage(prev => prev - 1);
    }
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
                    <div className="text-3xl font-bold text-[#4D3C2D] mb-1">{stats.totalDoctors}</div>
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
                    <div className="text-3xl font-bold text-green-600 mb-1">{stats.availableDoctors}</div>
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
                    <div className="text-3xl font-bold text-red-600 mb-1">{stats.unavailableDoctors}</div>
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
                    <div className="text-3xl font-bold text-[#4D3C2D] mb-1">{stats.todayAppointments}</div>
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
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedSpecialization} onValueChange={handleSpecializationChange}>
              <SelectTrigger className="w-[180px] bg-white/80 border-[#D9CAC2]">
                <Filter className="w-4 h-4 mr-2 text-[#4D3C2D]" />
                <SelectValue placeholder="Treatment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Treatment Type</SelectItem>
                <SelectItem value="IUI_SPECIALIST">IUI Specialist</SelectItem>
                <SelectItem value="IVF_SPECIALIST">IVF Specialist</SelectItem>
                <SelectItem value="GENERAL">General</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px] bg-white/80 border-[#D9CAC2]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Doctors Grid Display */}
        {loading ? (
          <div className="text-center py-8 text-[#4D3C2D]/70">Loading doctors and stats...</div>
        ) : doctorsData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No doctors found matching your criteria.</div>
        ) : (
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
        )}

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-8 p-4">
          <div className="text-sm text-[#4D3C2D]/70">
            Showing {doctorsData.length} of {paginationInfo.totalElements} doctors
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#D9CAC2] text-[#4D3C2D]"
              onClick={handlePrevPage}
              disabled={paginationInfo.first || loading}
            >
              Previous
            </Button>
            {/* MODIFIED: Display current page and total pages */}
            <Button
              variant="outline"
              size="sm"
              className="bg-[#4D3C2D] text-white border-[#4D3C2D]"
              disabled
            >
              Page {paginationInfo.page + 1} of {paginationInfo.totalPages}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#D9CAC2] text-[#4D3C2D]"
              onClick={handleNextPage}
              disabled={paginationInfo.last || loading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;