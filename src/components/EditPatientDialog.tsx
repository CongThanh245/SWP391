import { useState } from "react";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { useForm } from "react-hook-form";
import { Edit } from "lucide-react";
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

interface EditPatientDialogProps {
  patient: Patient;
  onUpdate?: (patient: Patient) => void;
  children?: React.ReactNode;
}

export const EditPatientDialog = ({ patient, onUpdate, children }: EditPatientDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      patientName: patient.patientName || '',
      email: patient.email || '',
      patientAddress: patient.patientAddress || '',
      patientPhone: patient.patientPhone || patient.phone || '',
      emergencyContact: patient.emergencyContact || '',
      joinDate: patient.joinDate || '',
      dateOfBirth: patient.dateOfBirth || '',
      gender: patient.gender || 'OTHER',
      maritalStatus: patient.maritalStatus || '',
      marriageDate: patient.marriageDate || '',
      profileCompleted: patient.profileCompleted?.toString() || 'false',
      spousePatientName: patient.spousePatientName || '',
      spousePatientAddress: patient.spousePatientAddress || '',
      spousePatientPhone: patient.spousePatientPhone || '',
      spouseEmergencyContact: patient.spouseEmergencyContact || '',
      spouseDateOfBirth: patient.spouseDateOfBirth || '',
      spouseGender: patient.spouseGender || 'OTHER',
      age: patient.age?.toString() || '',
      phone: patient.phone || patient.patientPhone || '',
      doctorName: patient.doctorName || '',
      lastVisit: patient.lastVisit || '',
      nextAppointment: patient.nextAppointment || '',
      status: patient.status || 'PLANNED',
    },
  });

  const onSubmit = (data) => {
    const updatedPatient: Patient = {
      ...patient,
      patientName: data.patientName,
      email: data.email,
      gender: data.gender,
      patientAddress: data.patientAddress || null,
      patientPhone: data.patientPhone,
      emergencyContact: data.emergencyContact || null,
      joinDate: data.joinDate,
      dateOfBirth: data.dateOfBirth,
      maritalStatus: data.maritalStatus || null,
      marriageDate: data.marriageDate || null,
      profileCompleted: data.profileCompleted === 'true',
      spousePatientName: data.spousePatientName || null,
      spousePatientAddress: data.spousePatientAddress || null,
      spousePatientPhone: data.spousePatientPhone || null,
      spouseEmergencyContact: data.spouseEmergencyContact || null,
      spouseDateOfBirth: data.spouseDateOfBirth || null,
      spouseGender: data.spouseGender || null,
      age: data.age ? parseInt(data.age) : undefined,
      phone: data.phone,
      doctorName: data.doctorName || undefined,
      lastVisit: data.lastVisit || undefined,
      nextAppointment: data.nextAppointment || undefined,
      status: data.status || undefined,
    };

    console.log("Cập nhật bệnh nhân:", updatedPatient);

    if (onUpdate) {
      onUpdate(updatedPatient);
    }

    toast({
      title: "Bệnh nhân đã được cập nhật",
      description: "Thông tin bệnh nhân đã được cập nhật thành công.",
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Sửa thông tin
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sửa thông tin bệnh nhân</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin bệnh nhân. Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Văn A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                      <Input placeholder="1995-08-15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Nam</SelectItem>
                        <SelectItem value="FEMALE">Nữ</SelectItem>
                        <SelectItem value="OTHER">Khác</SelectItem>
                        <SelectItem value="PREFER_NOT_TO_SAY">Không muốn tiết lộ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tuổi</FormLabel>
                    <FormControl>
                      <Input placeholder="30" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="patientPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="+84 123-456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="patient@email.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="patientAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Đường Láng, Hà Nội" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emergencyContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Liên hệ khẩn cấp</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn Nam - +84 123-456-7891" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maritalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tình trạng hôn nhân</FormLabel>
                    <FormControl>
                      <Input placeholder="Đã kết hôn" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marriageDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày kết hôn</FormLabel>
                    <FormControl>
                      <Input placeholder="2020-01-01" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="profileCompleted"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hồ sơ hoàn thiện</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái hồ sơ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Có</SelectItem>
                      <SelectItem value="false">Không</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="spousePatientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên vợ/chồng</FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Thị B" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="spouseDateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh vợ/chồng</FormLabel>
                    <FormControl>
                      <Input placeholder="1992-01-01" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="spouseGender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới tính vợ/chồng</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Nam</SelectItem>
                      <SelectItem value="FEMALE">Nữ</SelectItem>
                      <SelectItem value="OTHER">Khác</SelectItem>
                      <SelectItem value="PREFER_NOT_TO_SAY">Không muốn tiết lộ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="spousePatientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ vợ/chồng</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Nguyễn Trãi, Hà Nội" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="spousePatientPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại vợ/chồng</FormLabel>
                    <FormControl>
                      <Input placeholder="+84 912-345-678" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="spouseEmergencyContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Liên hệ khẩn cấp của vợ/chồng</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn Nam - +84 987-654-321" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="doctorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bác sĩ phụ trách</FormLabel>
                    <FormControl>
                      <Input placeholder="BS. Trần Văn Hùng" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PLANNED">Đã lên kế hoạch</SelectItem>
                        <SelectItem value="ACTIVE">Đang điều trị</SelectItem>
                        <SelectItem value="IN_PROGRESS">Trong quá trình điều trị</SelectItem>
                        <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                        <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lastVisit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lần khám gần nhất</FormLabel>
                    <FormControl>
                      <Input placeholder="2025-07-11" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nextAppointment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuộc hẹn tiếp theo</FormLabel>
                    <FormControl>
                      <Input placeholder="2025-07-11" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">Lưu thay đổi</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};