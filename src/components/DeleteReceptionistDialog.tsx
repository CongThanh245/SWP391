"use client";

import { useState } from "react";
import { Button } from "@components/ui/button";
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
import { Trash2 } from "lucide-react";
import { useToast } from "@hooks/use-toast";
import { deleteReceptionist } from "@api/adminApi";

interface DeleteReceptionistDialogProps {
  employeeId: string;
  receptionistName: string;
  onDelete: (employeeId: string) => void;
  trigger?: React.ReactNode;
}

export const DeleteReceptionistDialog = ({
  employeeId,
  receptionistName,
  onDelete,
  trigger,
}: DeleteReceptionistDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteReceptionist(employeeId);
      onDelete(employeeId);
      toast({
        title: "Xóa lễ tân thành công",
        description: `Lễ tân ${receptionistName} đã được xóa khỏi hệ thống.`,
        variant: "default",
      });
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa lễ tân. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="justify-start w-full text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa lễ tân</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa lễ tân này?
            <div className="mt-2">
              <p className="font-medium">{receptionistName}</p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Hành động này không thể hoàn tác. Tất cả thông tin liên quan đến lễ tân sẽ bị xóa vĩnh viễn.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};