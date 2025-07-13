import { Header } from "@components/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, User, Stethoscope, BookOpen, Clock, Upload } from "lucide-react";
import { getDoctorDetails, uploadDoctorAvatar } from '@api/adminApi';
import React, { useEffect, useState, useRef } from 'react';

interface DoctorDetailsProps {
  doctorId: string;
  onClose: () => void;
}

interface FullDoctorDetails {
  id: string;
  doctorId: string;
  doctorName: string;
  gender: "MALE" | "FEMALE" | "OTHER" | string;
  degree: string;
  doctorAddress: string;
  phone: string;
  joinDate: string;
  dateOfBirth: string;
  yearOfExperience: number;
  about: string | null;
  email: string;
  licenseNumber: string;
  specialization: "IUI_SPECIALIST" | "IVF_SPECIALIST" | "GENERAL" | string;
  imageProfile: string | null;
  available: boolean;
  active: boolean;
}

const DoctorDetails: React.FC<DoctorDetailsProps> = ({ doctorId, onClose }) => {
  const [doctorData, setDoctorData] = useState<FullDoctorDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const data = await getDoctorDetails(doctorId);
        if (data) {
          setDoctorData(data);
          setLoading(false);
        } else {
          setError("Không tìm thấy thông tin chi tiết cho bác sĩ này.");
          setDoctorData(null);
        }
      } catch (err) {
        setError("Lỗi khi tải thông tin bác sĩ. Vui lòng thử lại.");
        setDoctorData(null);
        setLoading(false);
      }
    };
    if (doctorId) {
      fetchDoctorDetails();
    }
  }, [doctorId]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoadingUpload(true);
    setUploadError(null);
    try {
      await uploadDoctorAvatar(doctorData!.id, file);
      const updatedDoctorData = await getDoctorDetails(doctorId);
      setDoctorData(updatedDoctorData);
    } catch (error: any) {
      setUploadError('Không thể tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setLoadingUpload(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getStatusBadge = (available: boolean) => {
    return available ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đang sẵn sàng khám
</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Đang bận</Badge>
    );
  };

  const getActiveBadge = (active: boolean) => {
    return active ? (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Hoạt động</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Không hoạt động</Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-[#EAE4E1]">
        <Header title="Chi tiết bác sĩ" subtitle="Thông tin hồ sơ bác sĩ đầy đủ" />
        <div className="flex-1 overflow-auto p-6 flex justify-center items-center">
          <p className="text-[#4D3C2D]/70">Đang tải chi tiết bác sĩ...</p>
        </div>
      </div>
    );
  }

  if (error || !doctorData) {
    return (
      <div className="flex flex-col h-screen bg-[#EAE4E1]">
        <Header title="Chi tiết bác sĩ" subtitle="Thông tin hồ sơ bác sĩ đầy đủ" />
        <div className="flex-1 overflow-auto p-6 flex flex-col justify-center items-center text-red-600">
          <p className="mb-4">{error || "Không tìm thấy dữ liệu bác sĩ. Vui lòng kiểm tra ID."}</p>
          <Button
            onClick={onClose}
            className="border-[#4D3C2D] text-[#4D3C2D] hover:bg-[#4D3C2D] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách bác sĩ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#EAE4E1]">
      <Header
        title="Chi tiết bác sĩ"
        subtitle="Thông tin hồ sơ bác sĩ đầy đủ"
      />
      <div className="flex-1 overflow-auto p-6">
        <Button
          variant="ghost"
          onClick={onClose}
          className="mb-6 text-[#4D3C2D] hover:bg-[#D9CAC2]/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách bác sĩ
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doctor Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 border-[#D9CAC2]">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="relative w-32 h-32 mx-auto mb-4 border-4 border-[#D9CAC2] rounded-full overflow-hidden group">
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src={doctorData.imageProfile || "/placeholder.svg"}
                        alt={`Avatar của ${doctorData.doctorName}`}
                      />
                      <AvatarFallback className="text-2xl bg-[#D9CAC2] text-[#4D3C2D]">
                        {doctorData.doctorName.split(' ').map(n => n[0]).join('').toUpperCase() || 'BS'}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                      onClick={triggerFileInput}
                    >
                      {loadingUpload ? (
                        <span className="text-white text-sm">Đang tải...</span>
                      ) : (
                        <Upload className="w-8 h-8 text-white" />
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                  </div>
                  {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
                  <h2 className="text-2xl font-bold mb-2 text-[#4D3C2D]">{doctorData.doctorName}</h2>
                  <p className="text-[#4D3C2D]/60 mb-2">{doctorData.doctorId}</p>
                  <div className="flex justify-center gap-2">
                    {getStatusBadge(doctorData.available)}
                    {getActiveBadge(doctorData.active)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-[#EAE4E1]/50 rounded-lg">
                    <Phone className="w-4 h-4 text-[#4D3C2D]" />
                    <span className="text-sm text-[#4D3C2D]">{doctorData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#EAE4E1]/50 rounded-lg">
                    <Mail className="w-4 h-4 text-[#4D3C2D]" />
                    <span className="text-sm text-[#4D3C2D]">{doctorData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#EAE4E1]/50 rounded-lg">
                    <MapPin className="w-4 h-4 text-[#4D3C2D]" />
                    <span className="text-sm text-[#4D3C2D]">{doctorData.doctorAddress}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Doctor Information Card */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 border-[#D9CAC2]">
              <CardHeader>
                <CardTitle className="text-[#4D3C2D]">Thông tin bác sĩ</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-[#EAE4E1]/50 rounded-lg">
                    <Stethoscope className="w-4 h-4 text-[#4D3C2D]" />
                    <div>
                      <p className="text-sm text-[#4D3C2D]/70">Chuyên môn</p>
                      <p className="text-[#4D3C2D]">{doctorData.specialization.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#EAE4E1]/50 rounded-lg">
                    <BookOpen className="w-4 h-4 text-[#4D3C2D]" />
                    <div>
                      <p className="text-sm text-[#4D3C2D]/70">Bằng cấp</p>
                      <p className="text-[#4D3C2D]">{doctorData.degree}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#EAE4E1]/50 rounded-lg">
                    <User className="w-4 h-4 text-[#4D3C2D]" />
                    <div>
                      <p className="text-sm text-[#4D3C2D]/70">Giới tính</p>
                      <p className="text-[#4D3C2D]">{doctorData.gender === "MALE" ? "Nam" : doctorData.gender === "FEMALE" ? "Nữ" : "Khác"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#EAE4E1]/50 rounded-lg">
                    <Calendar className="w-4 h-4 text-[#4D3C2D]" />
                    <div>
                      <p className="text-sm text-[#4D3C2D]/70">Ngày sinh</p>
                      <p className="text-[#4D3C2D]">{doctorData.dateOfBirth}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-[#EAE4E1]/50 rounded-lg">
                    <Clock className="w-4 h-4 text-[#4D3C2D]" />
                    <div>
                      <p className="text-sm text-[#4D3C2D]/70">Số năm kinh nghiệm</p>
                      <p className="text-[#4D3C2D]">{doctorData.yearOfExperience}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#EAE4E1]/50 rounded-lg">
                    <Calendar className="w-4 h-4 text-[#4D3C2D]" />
                    <div>
                      <p className="text-sm text-[#4D3C2D]/70">Ngày tham gia</p>
                      <p className="text-[#4D3C2D]">{doctorData.joinDate}</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 p-3 bg-[#EAE4E1]/50 rounded-lg">
                  <p className="text-sm text-[#4D3C2D]/70">Giới thiệu</p>
                  <p className="text-[#4D3C2D]">{doctorData.about || "Không có thông tin bổ sung."}</p>
                </div>
                <div className="col-span-2 p-3 bg-[#EAE4E1]/50 rounded-lg">
                  <p className="text-sm text-[#4D3C2D]/70">Số giấy phép</p>
                  <p className="text-[#4D3C2D]">{doctorData.licenseNumber}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;