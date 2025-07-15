
import { Header } from "@components/AdminHeader";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { useToast } from "@hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Upload,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { AddDoctorDialog } from "@components/AddDoctorDialog";
import { CSVImportDialog } from "@components/CSVImportDialog";
import { DoctorService } from "@services/doctorService";
import React, { useState, useEffect, useCallback } from "react";
import { UIDoctorData } from "@services/doctorService";
import { getDoctorStats, deleteDoctor } from "@api/adminApi";
import { useNavigate } from "react-router-dom";
import DoctorAdminDetails from "@components/DoctorAdminDetails";
import { EditDoctorDialog } from "@components/EditDoctorDialog";
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
  const navigate = useNavigate();
  const [finalImportStatus, setFinalImportStatus] = useState<
    "success" | "failed" | null
  >(null);
  const [finalImportMessage, setFinalImportMessage] = useState<string>("");
  const [showImportDialog, setShowImportDialog] = useState(false);

  const [doctorsData, setDoctorsData] = useState<UIDoctorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    availableDoctors: 0,
    unavailableDoctors: 0,
    todayAppointments: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
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

  const [showDoctorDetails, setShowDoctorDetails] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const getInitials = useCallback((name: string) => {
    if (!name || typeof name !== "string") {
      return "BS";
    }
    const parts = name
      .trim()
      .split(" ")
      .filter((part) => part.length > 0);
    if (parts.length === 0) {
      return "BS";
    }
    return parts
      .map((part) => part[0]?.toUpperCase() || "")
      .join("")
      .substring(0, 3);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const doctorsResult = await DoctorService.getAllDoctors(
        currentPage,
        pageSize,
        searchQuery,
        selectedSpecialization === "all" ? "" : selectedSpecialization,
        selectedStatus === "all" ? "" : selectedStatus
      );

      if (!doctorsResult.doctors || !Array.isArray(doctorsResult.doctors)) {
        console.warn(
          "Không nhận được dữ liệu bác sĩ hoặc định dạng không hợp lệ từ DoctorService.getAllDoctors"
        );
        setDoctorsData([]);
      } else {
        console.log("Raw doctors data:", doctorsResult.doctors); // Debugging log
        const doctorsDataFormatted: UIDoctorData[] = doctorsResult.doctors.map(
          (doctor, index) => {
            const gender =
              doctor.gender &&
              ["MALE", "FEMALE", "OTHER"].includes(doctor.gender)
                ? (doctor.gender as "MALE" | "FEMALE" | "OTHER")
                : undefined;

            // Map boolean available to string status
            const status =
              typeof doctor.available === "boolean"
                ? doctor.available
                  ? "Available"
                  : "Unavailable"
                : ["Available", "Unavailable"].includes(doctor.available)
                ? doctor.available
                : "Unavailable";

            return {
              id: doctor.doctorId || `BÁC SĨ-${index}`,
              name: doctor.doctorName || "Bác sĩ không xác định",
              department: "Ferticare",
              specialist: doctor.specialization || "Tổng quát",
              totalPatients: doctor.totalPatients ?? 0,
              todayAppointments: doctor.todayAppointments ?? 0,
              status: status as "Available" | "Unavailable",
              avatar: getInitials(doctor.doctorName || "Bác sĩ không xác định"),
              phone: doctor.phone || "",
              email: doctor.doctorEmail || "",
              degree: doctor.degree || "",
              experience: doctor.yearOfExperience ?? 0,
              about: doctor.about || "",
              address: doctor.doctorAddress || "",
              joinDate: doctor.joinDate || "",
              imageProfile: doctor.imageProfile || "",
              gender,
              dateOfBirth: doctor.dateOfBirth,
              licenseNumber: doctor.licenseNumber,
            };
          }
        );
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
      console.error("Không thể tải dữ liệu:", error);
      setDoctorsData([]);
      setStats({
        totalDoctors: 0,
        availableDoctors: 0,
        unavailableDoctors: 0,
        todayAppointments: 0,
      });
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu bác sĩ. Vui lòng thử lại.",
        variant: "destructive",
      });
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

  const handleDeleteDoctor = async (doctorId: string) => {
    setIsDeleting(true);
    try {
      await deleteDoctor(doctorId);
      toast({
        title: "Thành công",
        description: `Đã xóa bác sĩ: ${doctorId}`,
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: `Không thể xóa bác sĩ: ${doctorId}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

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
    "Year Of Experience",
  ];

  const csvSampleData = [
    {
      Email: "doctor@gmail.com",
      Name: "Dr. Long Dinh",
      Specialization: "IVF_SPECIALIST",
      Phone: "0123456789",
      "License Number": "LIC123456",
      Degree: "MD",
      Address: "123 Clinic Street",
      "Date of Birth": "1980-05-20",
      Gender: "MALE",
      "Is Available": "true",
      "Year Of Experience": "6",
    },
    {
      Email: "doctor2@gmail.com",
      Name: "Dr. Long Hoang Dinh",
      Specialization: "IUI_SPECIALIST",
      Phone: "0123456789",
      "License Number": "LIC1234568",
      Degree: "MD",
      Address: "123 Clinic Street",
      "Date of Birth": "1980-05-20",
      Gender: "MALE",
      "Is Available": "true",
      "Year Of Experience": "5",
    },
  ];

  const handleCSVImport = async (data: any[]) => {
    setLoading(true);
    const result = await DoctorService.importFromCSV(data);
    setLoading(false);

    if (result.success) {
      setFinalImportStatus("success");
      setFinalImportMessage(`Đã nhập thành công ${data.length} bản ghi.`);
      fetchData();
      return {
        success: true,
        message: `Đã nhập thành công ${data.length} bản ghi.`,
      };
    } else {
      setFinalImportStatus("failed");
      setFinalImportMessage(
        result.message || "Nhập thất bại: Đã xảy ra lỗi không xác định."
      );
      return {
        success: false,
        message:
          result.message || "Nhập thất bại: Đã xảy ra lỗi không xác định.",
      };
    }
  };

  const getStatusBadge = (status: string) => {
    console.log(`Rendering badge for status: ${status}`); // Debugging log
    switch (status) {
      case "Available":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Đang sẵn sàng khám

          </Badge>
        );
      case "Busy":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Bận
          </Badge>
        );
      case "Unavailable":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Đang bận
          </Badge>
        );
      default:
        console.warn(`Unexpected status value: ${status}`);
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleViewDetails = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setShowDoctorDetails(true);
  };

  const handleCloseDoctorDetails = () => {
    setShowDoctorDetails(false);
    setSelectedDoctorId(null);
    fetchData();
  };

  const handleNextPage = () => {
    if (!paginationInfo.last) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (!paginationInfo.first) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleUpdateDoctor = (updatedDoctor: UIDoctorData) => {
    setDoctorsData((prevDoctors) =>
      prevDoctors.map((doctor) =>
        doctor.id === updatedDoctor.id
          ? { ...doctor, ...updatedDoctor }
          : doctor
      )
    );
  };

  return (
    <>
      {showDoctorDetails && selectedDoctorId ? (
        <DoctorAdminDetails
          doctorId={selectedDoctorId}
          onClose={handleCloseDoctorDetails}
        />
      ) : (
        <div className="flex flex-col h-screen bg-[#EAE4E1]">
          <Header
            title="Bác sĩ"
            subtitle="Quản lý và xem thông tin tất cả bác sĩ"
          />
          <div className="flex-1 overflow-auto p-6">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-[#4D3C2D] mb-2">
                    Đội ngũ y tế
                  </h1>
                  <p className="text-[#4D3C2D]/70">
                    Quản lý các chuyên gia y tế của bệnh viện
                  </p>
                </div>
                <div className="flex gap-3">
                  <CSVImportDialog
                    title="Bác sĩ"
                    templateFields={csvTemplateFields}
                    sampleData={csvSampleData}
                    onImport={handleCSVImport}
                    trigger={
                      <Button
                        variant="outline"
                        className="border-[#4D3C2D] text-[#4D3C2D] hover:bg-[#4D3C2D] hover:text-white"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Nhập danh sách bác sĩ
                      </Button>
                    }
                  />
                  <AddDoctorDialog />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card className="bg-white/90 border-[#D9CAC2] hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-[#4D3C2D] mb-1">
                          {stats.totalDoctors}
                        </div>
                        <div className="text-sm font-medium text-[#4D3C2D]/70">
                          Tổng số bác sĩ
                        </div>
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
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          {stats.availableDoctors}
                        </div>
                        <div className="text-sm font-medium text-[#4D3C2D]/70">
                          Đang sẵn sàng khám
 hiện tại
                        </div>
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
                        <div className="text-3xl font-bold text-red-600 mb-1">
                          {stats.unavailableDoctors}
                        </div>
                        <div className="text-sm font-medium text-[#4D3C2D]/70">
                          Đang bận
                        </div>
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
                        <div className="text-3xl font-bold text-[#4D3C2D] mb-1">
                          {stats.todayAppointments}
                        </div>
                        <div className="text-sm font-medium text-[#4D3C2D]/70">
                          Lịch hẹn hôm nay
                        </div>
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
                  placeholder="Tìm kiếm theo tên hoặc sđt"
                  className="pl-10 bg-white/80 border-[#D9CAC2] focus:border-[#4D3C2D]"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={selectedSpecialization}
                  onValueChange={handleSpecializationChange}
                >
                  <SelectTrigger className="w-[180px] bg-white/80 border-[#D9CAC2]">
                    <Filter className="w-4 h-4 mr-2 text-[#4D3C2D]" />
                    <SelectValue placeholder="Chuyên môn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả chuyên môn</SelectItem>
                    <SelectItem value="IUI_SPECIALIST">
                      Chuyên gia IUI
                    </SelectItem>
                    <SelectItem value="IVF_SPECIALIST">
                      Chuyên gia IVF
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedStatus}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-[180px] bg-white/80 border-[#D9CAC2]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="available">Đang sẵn sàng khám
</SelectItem>
                    <SelectItem value="unavailable">Đang bận</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {loading ? (
              <div className="text-center py-8 text-[#4D3C2D]/70">
                Đang tải dữ liệu bác sĩ...
              </div>
            ) : doctorsData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Không tìm thấy bác sĩ nào phù hợp với tiêu chí.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {doctorsData.map((doctor) => (
                  <Card
                    key={doctor.id}
                    className="bg-white/95 border-[#D9CAC2] hover:shadow-xl transition-all duration-300 hover:bg-white hover:scale-[1.02]"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-14 h-14 border-2 border-[#D9CAC2]">
                            <AvatarImage src={doctor.imageProfile} />
                            <AvatarFallback className="bg-[#D9CAC2] text-[#4D3C2D] font-semibold text-lg">
                              {doctor.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-[#4D3C2D] text-lg">
                              {doctor.name}
                            </h3>
                            <p className="text-sm text-[#4D3C2D]/60 font-medium">
                              {doctor.id}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-[#4D3C2D] hover:bg-[#D9CAC2]/20"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-white border-[#D9CAC2]"
                          >
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(doctor.id)}
                              className="text-[#4D3C2D]"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <EditDoctorDialog
                                doctor={doctor}
                                onUpdate={handleUpdateDoctor}
                              />
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Xóa
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-white border-[#D9CAC2] rounded-lg p-6">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-[#4D3C2D]">
                                    Xác nhận xóa bác sĩ
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-600">
                                    Bạn có chắc chắn muốn xóa bác sĩ{" "}
                                    <strong>{doctor.name}</strong>? Hành động
                                    này không thể hoàn tác.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="pt-4 flex justify-end gap-2">
                                  <AlertDialogCancel className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                                    Hủy
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteDoctor(doctor.id)
                                    }
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                    disabled={isDeleting}
                                  >
                                    {isDeleting ? "Đang xóa..." : "Xóa"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-[#4D3C2D]">
                            {doctor.department}
                          </p>
                          <p className="text-sm text-[#4D3C2D]/60">
                            {doctor.specialist}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-[#EAE4E1]/50 rounded-lg">
                            <div className="text-lg font-bold text-[#4D3C2D]">
                              {doctor.totalPatients}
                            </div>
                            <div className="text-xs text-[#4D3C2D]/70">
                              Tổng số bệnh nhân
                            </div>
                          </div>
                          <div className="text-center p-3 bg-[#EAE4E1]/50 rounded-lg">
                            <div className="text-lg font-bold text-[#4D3C2D]">
                              {doctor.todayAppointments}
                            </div>
                            <div className="text-xs text-[#4D3C2D]/70">
                              Lịch hẹn hôm nay
                            </div>
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
                            Xem hồ sơ
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between mt-8 p-4">
              <div className="text-sm text-[#4D3C2D]/70">
                Hiển thị {doctorsData.length} trong số{" "}
                {paginationInfo.totalElements} bác sĩ
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#D9CAC2] text-[#4D3C2D]"
                  onClick={handlePrevPage}
                  disabled={paginationInfo.first || loading}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#4D3C2D] text-white border-[#4D3C2D]"
                  disabled
                >
                  Trang {paginationInfo.page + 1} / {paginationInfo.totalPages}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#D9CAC2] text-[#4D3C2D]"
                  onClick={handleNextPage}
                  disabled={paginationInfo.last || loading}
                >
                  Tiếp
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Doctors;
