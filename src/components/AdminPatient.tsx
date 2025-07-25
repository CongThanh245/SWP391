

import { Header } from "@components/AdminHeader";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@components/ui/pagination";
import { Search, MoreHorizontal, Eye, Trash2, Calendar, Phone, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getPatients, deletePatient } from '@api/adminApi';
import { formatDate } from '@utils/format';
import { PatientDetailsDialog } from '@components/PatientDetailsDialog';
import { DeletePatientsDialog } from '@components/DeletePatientsDialog';
import { useToast } from "@hooks/use-toast";

interface Patient {
  id: string;
  patientId: string;
  patientName: string;
  email: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  patientAddress?: string | null;
  patientPhone?: string;
  emergencyContact?: string | null;
  joinDate?: string;
  dateOfBirth?: string;
  maritalStatus?: string | null;
  marriageDate?: string | null;
  profileCompleted?: boolean;
  spousePatientName?: string | null;
  spousePatientAddress?: string | null;
  spousePatientPhone?: string | null;
  spouseEmergencyContact?: string | null;
  spouseDateOfBirth?: string | null;
  spouseGender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' | null;
  age?: number;
  phone?: string;
  doctorName?: string;
  lastVisit?: string;
  nextAppointment?: string;
  status?: 'PLANNED' | 'ACTIVE' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

interface ApiResponse {
  content: Patient[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

const Patients = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [patientsData, setPatientsData] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = {
      page: String(currentPage),
      size: String(pageSize),
    };

    try {
      const response: ApiResponse = await getPatients(params);
      const mappedPatients = response.content.map((patient) => ({
        id: patient.id,
        patientId: patient.patientId,
        patientName: patient.patientName,
        email: patient.email,
        gender: patient.gender,
        age: patient.age,
        phone: patient.phone,
        doctorName: patient.doctorName,
        lastVisit: patient.lastVisit,
        nextAppointment: patient.nextAppointment,
        status: patient.status,
        patientAddress: null,
        patientPhone: patient.phone,
        emergencyContact: null,
        joinDate: undefined,
        dateOfBirth: undefined,
        maritalStatus: null,
        marriageDate: null,
        profileCompleted: false,
        spousePatientName: null,
        spousePatientAddress: null,
        spousePatientPhone: null,
        spouseEmergencyContact: null,
        spouseDateOfBirth: null,
        spouseGender: null,
      }));
      setPatientsData(mappedPatients);
      setFilteredPatients(mappedPatients); // Initialize filtered list
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
      setCurrentPage(response.number);
      setPageSize(response.size);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Đã xảy ra lỗi khi tải danh sách bệnh nhân.';
      setError(message);
      toast({
        title: "Lỗi tìm kiếm",
        description: message,
        variant: "destructive",
      });
      console.error("Lỗi khi lấy danh sách bệnh nhân:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, toast]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    // Client-side filtering based on searchQuery
    const filtered = patientsData.filter(
      (patient) =>
        patient.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (patient.phone && patient.phone.includes(searchQuery))
    );
    setFilteredPatients(filtered);
    setCurrentPage(0); // Reset to first page on search
  }, [searchQuery, patientsData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };

  const renderPaginationLinks = () => {
    const links = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (startPage > 0) {
      links.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 1) {
        links.push(<PaginationItem key="ellipsis-start"><PaginationEllipsis /></PaginationItem>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => handlePageChange(i + 1)} isActive={currentPage === i}>
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        links.push(<PaginationItem key="ellipsis-end"><PaginationEllipsis /></PaginationItem>);
      }
      links.push(
        <PaginationItem key={totalPages - 1}>
          <PaginationLink onClick={() => handlePageChange(totalPages)}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }
    return links;
  };

  const handleDeletePatients = async (patientIds: string[]) => {
    try {
      await deletePatient(patientIds);
      setPatientsData((prevData) => prevData.filter((patient) => !patientIds.includes(patient.id)));
      setFilteredPatients((prevData) => prevData.filter((patient) => !patientIds.includes(patient.id)));
      setSelectedPatients([]);
      fetchPatients(); // Refresh data from API
      toast({
        title: "Xóa bệnh nhân thành công",
        description: `${patientIds.length} bệnh nhân đã được xóa.`,
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa bệnh nhân. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatients((prev) =>
      prev.includes(patientId)
        ? prev.filter((id) => id !== patientId)
        : [...prev, patientId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPatients.length === filteredPatients.length) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(filteredPatients.map((patient) => patient.id));
    }
  };

  const formatGender = (gender: 'MALE' | 'FEMALE' | 'PREFER_NOT_TO_SAY' | 'OTHER' | null): string => {
    switch (gender) {
      case 'MALE':
        return 'Nam';
      case 'FEMALE':
        return 'Nữ';
      case 'PREFER_NOT_TO_SAY':
        return 'Không muốn tiết lộ';
      case 'OTHER':
        return 'Khác';
      default:
        return 'Không xác định';
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Đang điều trị</Badge>;
      case 'IN_PROGRESS':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Đang điều trị</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Đã hoàn tất điều trị</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Điều trị đã hủy</Badge>;
      default:
        return <Badge variant="secondary">Chưa bắt đầu điều trị</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải danh sách bệnh nhân...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">Lỗi: {error}</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-[#EAE4E1]">
      <Header title="Bệnh nhân" subtitle="Quản lý hồ sơ và thông tin y tế của bệnh nhân" />
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="all" className="space-y-6">
          <Card className="bg-white/90 border-[#D9CAC2] mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4D3C2D]/60 w-4 h-4" />
                  <Input
                    key="search-input"
                    ref={searchInputRef}
                    placeholder="Tìm kiếm theo tên hoặc sđt"
                    className="pl-10 bg-white/80 border-[#D9CAC2] focus:border-[#4D3C2D]"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                {selectedPatients.length > 0 && (
                  <DeletePatientsDialog
                    patientIds={selectedPatients}
                    patientNames={selectedPatients.map((id) =>
                      filteredPatients.find((p) => p.id === id)?.patientName || ''
                    )}
                    onDelete={handleDeletePatients}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <TabsContent value="all">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedPatients.length === filteredPatients.length}
                          onChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Thông tin bệnh nhân</TableHead>
                      <TableHead>Liên hệ</TableHead>
                      <TableHead>Bác sĩ</TableHead>
                      <TableHead>Lần khám gần nhất</TableHead>
                      <TableHead>Cuộc hẹn tiếp theo</TableHead>
                      <TableHead>Trạng thái điều trị</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id} className="hover:bg-muted/50">
                        <TableCell>
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={selectedPatients.includes(patient.id)}
                            onChange={() => handleSelectPatient(patient.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback className="text-sm font-medium">
                                {patient.patientName.split(' ').map((n) => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{patient.patientName}</div>
                              <div className="text-sm text-muted-foreground">{patient.patientId}</div>
                              <div className="text-sm text-muted-foreground">
                                {patient.age ? `${patient.age} tuổi, ` : ''}{formatGender(patient.gender)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3 h-3 text-muted-foreground" />
                              <span className="font-mono">{patient.phone || 'Chưa cung cấp'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              <span>{patient.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{patient.doctorName || 'Chưa cung cấp'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{patient.lastVisit ? formatDate(patient.lastVisit) : 'Chưa cung cấp'}</div>
                        </TableCell>
                        <TableCell>
                          {patient.nextAppointment ? (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-medium">{formatDate(patient.nextAppointment)}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">Chưa đặt lịch</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(patient.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="hover:bg-muted">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover">
                              <DropdownMenuItem asChild>
                                <PatientDetailsDialog patient={patient}>
                                  <Button variant="ghost" size="sm" className="justify-start w-full">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Xem chi tiết
                                  </Button>
                                </PatientDetailsDialog>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <DeletePatientsDialog
                                  patientIds={[patient.id]}
                                  patientNames={[patient.patientName]}
                                  onDelete={handleDeletePatients}
                                  trigger={
                                    <Button variant="ghost" size="sm" className="justify-start w-full">
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Xóa bệnh nhân
                                    </Button>
                                  }
                                />
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex items-center justify-between p-6 border-t border-border bg-muted/20">
                  <div className="text-sm text-muted-foreground font-medium">
                    Hiển thị {filteredPatients.length} trên tổng số {totalElements} bệnh nhân
                    {selectedPatients.length > 0 && (
                      <span className="ml-2 text-primary">
                        ({selectedPatients.length} được chọn)
                      </span>
                    )}
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={handlePreviousPage}
                          className={currentPage === 0 ? 'pointer-events-none opacity-50' : ''}
                        >
                          Trước
                        </PaginationPrevious>
                      </PaginationItem>
                      {renderPaginationLinks()}
                      <PaginationItem>
                        <PaginationNext
                          onClick={handleNextPage}
                          className={currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : ''}
                        >
                          Tiếp
                        </PaginationNext>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Bệnh nhân đang điều trị</h3>
                  <p className="text-muted-foreground">Bệnh nhân đang nhận điều trị</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treatment">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Bệnh nhân trong quá trình điều trị</h3>
                  <p className="text-muted-foreground">Bệnh nhân đang thực hiện các phác đồ điều trị tích cực</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Điều trị hoàn tất</h3>
                  <p className="text-muted-foreground">Bệnh nhân đã hoàn thành điều trị thành công</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Patients;
