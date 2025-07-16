import { useState, useEffect } from "react";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Separator } from "@components/ui/separator";
import { Phone, Mail, MapPin, User, Heart } from "lucide-react";
import { getPatientDetails } from '@api/adminApi';

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
  profileCompleted?: boolean;
  spousePatientName?: string | null;
  spousePatientAddress?: string | null;
  spousePatientPhone?: string | null;
  spouseEmergencyContact?: string | null;
  spouseDateOfBirth?: string | null;
  spouseGender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' | null;
}

interface PatientDetailsDialogProps {
  patient: Patient;
  children: React.ReactNode;
}

export const PatientDetailsDialog = ({ patient, children }: PatientDetailsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [detailedPatient, setDetailedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      console.log('Truyền patientId vào getPatientDetails:', patient.patientId);
      setLoading(true);
      getPatientDetails(patient.patientId)
        .then((data) => {
          console.log('Dữ liệu chi tiết bệnh nhân:', data);
          setDetailedPatient(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Đã xảy ra lỗi khi tải chi tiết bệnh nhân');
          console.error('Lỗi từ getPatientDetails:', err);
          setLoading(false);
        });
    }
  }, [open, patient.patientId]);

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

  const displayPatient = detailedPatient || patient;

  if (loading) {
    return <div>Đang tải chi tiết bệnh nhân...</div>;
  }

  if (error) {
    return <div className="text-red-500">Lỗi: {error}</div>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết bệnh nhân</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết của bệnh nhân
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Thông tin bệnh nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-20 h-20 mb-3">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-lg">
                    {displayPatient.patientName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{displayPatient.patientName}</h3>
                <p className="text-sm text-muted-foreground">{displayPatient.patientId}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Ngày sinh</p>
                  <p className="text-sm text-muted-foreground">{displayPatient.dateOfBirth || 'Chưa cung cấp'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Giới tính</p>
                  <p className="text-sm text-muted-foreground">{formatGender(displayPatient.gender)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{displayPatient.patientPhone || 'Chưa cung cấp'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{displayPatient.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{displayPatient.patientAddress || 'Chưa cung cấp'}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Ngày tham gia</p>
                  <p className="text-sm text-muted-foreground">{displayPatient.joinDate || 'Chưa cung cấp'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Hồ sơ hoàn thiện</p>
                  <p className="text-sm text-muted-foreground">{displayPatient.profileCompleted ? 'Có' : 'Không'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Liên hệ khẩn cấp</p>
                  <p className="text-sm text-muted-foreground">{displayPatient.emergencyContact || 'Chưa cung cấp'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Thông tin vợ/chồng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Tên vợ/chồng</p>
                <p className="text-sm text-muted-foreground">{displayPatient.spousePatientName || 'Chưa cung cấp'}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Ngày sinh vợ/chồng</p>
                <p className="text-sm text-muted-foreground">{displayPatient.spouseDateOfBirth || 'Chưa cung cấp'}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Giới tính vợ/chồng</p>
                <p className="text-sm text-muted-foreground">{formatGender(displayPatient.spouseGender)}</p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span className="text-sm">{displayPatient.spousePatientAddress || 'Chưa cung cấp'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{displayPatient.spousePatientPhone || 'Chưa cung cấp'}</span>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Liên hệ khẩn cấp của vợ/chồng</p>
                <p className="text-sm text-muted-foreground">{displayPatient.spouseEmergencyContact || 'Chưa cung cấp'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};