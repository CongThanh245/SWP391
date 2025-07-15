import { useState, useEffect } from "react";
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
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateDoctor, getDoctorDetails } from "@api/adminApi";
import { UIDoctorData } from "@services/doctorService";

// Define form validation schema using zod
const formSchema = z.object({
  name: z.string().min(1, "Họ và tên là bắt buộc"),
  specialist: z.string().min(1, "Chuyên môn là bắt buộc"),
  phone: z.string().min(1, "Số điện thoại là bắt buộc").regex(/^\+?\d{10,15}$/, "Định dạng số điện thoại không hợp lệ"),
  email: z.string().email("Địa chỉ email không hợp lệ"),
  status: z.enum(["Available", "Unavailable"], { required_error: "Trạng thái là bắt buộc" }),
  address: z.string().optional(),
  degree: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  dateOfBirth: z.string().optional(),
  yearOfExperience: z.number().min(0, "Số năm kinh nghiệm không thể âm").optional(),
  licenseNumber: z.string().optional(),
});

interface EditDoctorDialogProps {
  doctor: UIDoctorData;
  onUpdate: (doctor: UIDoctorData) => void;
}

export const EditDoctorDialog = ({ doctor, onUpdate }: EditDoctorDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: doctor.name,
      specialist: doctor.specialist,
      phone: doctor.phone,
      email: doctor.email,
      status: doctor.status,
      address: doctor.address,
      degree: doctor.degree,
      gender: doctor.gender,
      dateOfBirth: doctor.dateOfBirth,
      yearOfExperience: doctor.experience,
      licenseNumber: doctor.licenseNumber,
    },
  });

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (open) {
        setLoading(true);
        try {
          const doctorData = await getDoctorDetails(doctor.id);
          // Update form with fresh data from API
          form.reset({
            name: doctorData.doctorName,
            specialist: doctorData.specialization,
            phone: doctorData.phone,
            email: doctorData.email,
            status: typeof doctorData.available === "boolean"
              ? doctorData.available ? "Available" : "Unavailable"
              : ["Available", "Unavailable"].includes(doctorData.available)
                ? doctorData.available
                : "Unavailable",
            address: doctorData.doctorAddress,
            degree: doctorData.degree,
            gender: doctorData.gender,
            dateOfBirth: doctorData.dateOfBirth,
            yearOfExperience: doctorData.yearOfExperience,
            licenseNumber: doctorData.licenseNumber,
          });
        } catch (error: any) {
          toast({
            title: "Lỗi",
            description: `Không thể tải thông tin bác sĩ: ${error.message}`,
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDoctorData();
  }, [open, doctor.id, form, toast]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Map form data to API request format
      const updateData = {
        doctorName: data.name,
        doctorPhone: data.phone,
        doctorAddress: data.address,
        doctorEmail: data.email,
        doctorStatus: data.status,
        doctorSpecialization: data.specialist,
        doctorId: doctor.id,
        doctorGender: data.gender,
        degree: data.degree,
        dateOfBirth: data.dateOfBirth,
        yearOfExperience: data.yearOfExperience,
        licenseNumber: data.licenseNumber,
      };

      // Call the updateDoctor API
      const updatedDoctorFromApi = await updateDoctor(doctor.id, updateData);

      // Map API response back to UIDoctorData interface
      const updatedDoctor: UIDoctorData = {
        ...doctor,
        name: updatedDoctorFromApi.doctorName,
        phone: updatedDoctorFromApi.doctorPhone,
        address: updatedDoctorFromApi.doctorAddress,
        email: updatedDoctorFromApi.doctorEmail,
        status: updatedDoctorFromApi.doctorStatus === "Available" ? "Available" : "Unavailable",
        specialist: updatedDoctorFromApi.doctorSpecialization,
        gender: updatedDoctorFromApi.doctorGender,
        degree: updatedDoctorFromApi.degree,
        dateOfBirth: updatedDoctorFromApi.dateOfBirth,
        experience: updatedDoctorFromApi.yearOfExperience,
        licenseNumber: updatedDoctorFromApi.licenseNumber,
        about: doctor.about, // Preserve as it's not in update API
        joinDate: updatedDoctorFromApi.joinDate || doctor.joinDate,
        imageProfile: updatedDoctorFromApi.imageProfile || doctor.imageProfile,
        totalPatients: updatedDoctorFromApi.totalPatients || doctor.totalPatients,
        todayAppointments: updatedDoctorFromApi.todayAppointments || doctor.todayAppointments,
        avatar: doctor.avatar, // Preserve avatar as it’s not in API response
        department: doctor.department, // Preserve department as it’s not in API response
      };

      onUpdate(updatedDoctor);

      toast({
        title: "Thành công",
        description: "Thông tin bác sĩ đã được cập nhật thành công.",
      });

      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể cập nhật thông tin bác sĩ: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Sửa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa bác sĩ</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin bác sĩ. Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="text-center py-4">Đang tải thông tin bác sĩ...</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Bác sĩ Nguyễn Văn A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chuyên môn</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn chuyên môn" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IVF_SPECIALIST">Chuyên gia IVF</SelectItem>
                            <SelectItem value="IUI_SPECIALIST">Chuyên gia IUI</SelectItem>
                            <SelectItem value="GENERAL">Tổng quát</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="+84 123 456 789" {...field} />
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
                        <Input placeholder="bacsi@benhvien.com" type="email" {...field} />
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
                          <SelectItem value="Available">Đang sẵn sàng khám</SelectItem>
                          <SelectItem value="Unavailable">Đang bận</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="degree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bằng cấp</FormLabel>
                      <FormControl>
                        <Input placeholder="Bác sĩ y khoa" {...field} />
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
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="yearOfExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số năm kinh nghiệm</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="5"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số giấy phép</FormLabel>
                      <FormControl>
                        <Input placeholder="LIC123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Đường Phòng Khám" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};