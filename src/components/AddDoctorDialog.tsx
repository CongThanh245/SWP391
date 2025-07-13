import { useState } from "react";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Plus } from "lucide-react";
import { useToast } from "@hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerDoctor, RegisterDoctorData } from "@api/adminApi";

const doctorFormSchema = z.object({
  email: z.string().email("Vui lòng nhập địa chỉ email hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  phoneNumber: z
    .string()
    .min(1, "Số điện thoại là bắt buộc")
    .regex(
      /^(?:\+84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-4|6-9])[0-9]{7}$/,
      "Số điện thoại không đúng định dạng Việt Nam"
    ),
  doctorName: z.string().min(1, "Tên bác sĩ là bắt buộc"),
  dateOfBirth: z
    .string()
    .min(1, "Ngày sinh là bắt buộc")
    .refine(
      (value) => {
        try {
          const date = new Date(value);
          return !isNaN(date.getTime()) && value.match(/^\d{4}-\d{2}-\d{2}$/);
        } catch {
          return false;
        }
      },
      {
        message:
          "Vui lòng nhập ngày sinh hợp lệ theo định dạng YYYY-MM-DD (ví dụ: 2003-02-22)",
      }
    ),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"], {
    errorMap: () => ({ message: "Vui lòng chọn giới tính hợp lệ" }),
  }),
  doctorAddress: z.string().min(1, "Địa chỉ là bắt buộc"),
  degree: z.string().min(1, "Bằng cấp là bắt buộc"),
  licenseNumber: z.string().min(1, "Số giấy phép là bắt buộc"),
  specicalization: z.string().min(1, "Chuyên môn là bắt buộc"),
  yearOfExperience: z.number().min(0, "Số năm kinh nghiệm phải là số không âm"),
});

type DoctorFormData = z.infer<typeof doctorFormSchema>;

interface AddDoctorDialogProps {
  onAdd?: () => void;
}

export const AddDoctorDialog = ({ onAdd }: AddDoctorDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<DoctorFormData>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      email: "",
      password: "",
      phoneNumber: "",
      doctorName: "",
      dateOfBirth: "",
      gender: undefined,
      doctorAddress: "",
      degree: "",
      licenseNumber: "",
      specicalization: "",
      yearOfExperience: 0,
    },
  });

  const onSubmit = async (data: RegisterDoctorData) => {
    setIsSubmitting(true);
    try {
      await registerDoctor(data);
      toast({
        title: "Thành công",
        description: `Đã thêm bác sĩ ${data.doctorName} vào hệ thống.`,
      });
      setOpen(false);
      form.reset();
      if (onAdd) onAdd(); // Trigger refresh
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description:
          error.message || "Không thể thêm bác sĩ. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#4D3C2D] hover:bg-[#4D3C2D]/90">
          <Plus className="w-4 h-4 mr-2" />
          Thêm bác sĩ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-[#4D3C2D]">Thêm bác sĩ mới</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="doctorName"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="nguyen.vana@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập mật khẩu"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="0123456789" {...field} />
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
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Nam</SelectItem>
                        <SelectItem value="FEMALE">Nữ</SelectItem>
                        <SelectItem value="OTHER">Khác</SelectItem>
                        <SelectItem value="PREFER_NOT_TO_SAY">
                          Không muốn tiết lộ
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doctorAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Đường Láng, Hà Nội" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bằng cấp</FormLabel>
                    <FormControl>
                      <Input placeholder="MD, PhD" {...field} />
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
              <FormField
                control={form.control}
                name="specicalization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chuyên môn</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chuyên môn" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="IVF_SPECIALIST">
                          Chuyên gia IVF
                        </SelectItem>
                        <SelectItem value="IUI_SPECIALIST">
                          Chuyên gia IUI
                        </SelectItem>
                        <SelectItem value="GENERAL">Tổng quát</SelectItem>
                      </SelectContent>
                    </Select>
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
                        placeholder="6"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-[#4D3C2D] hover:bg-[#4D3C2D]/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang thêm..." : "Thêm bác sĩ"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
