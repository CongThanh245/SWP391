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
import { deletePatient } from "@api/adminApi";

interface DeletePatientsDialogProps {
  patientIds: string[];
  patientNames: string[];
  onDelete: (patientIds: string[]) => void;
  trigger?: React.ReactNode;
}

export const DeletePatientsDialog = ({
  patientIds,
  patientNames,
  onDelete,
  trigger,
}: DeletePatientsDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deletePatient(patientIds);
      onDelete(patientIds);
      toast({
        title: "Xóa bệnh nhân thành công",
        description: `${patientIds.length} bệnh nhân đã được xóa.`,
        variant: "default",
      });
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa bệnh nhân. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const isMultiple = patientIds.length > 1;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa {isMultiple ? `${patientIds.length} bệnh nhân` : "bệnh nhân"}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Xóa {isMultiple ? "bệnh nhân" : "bệnh nhân"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa {isMultiple ? "những bệnh nhân này" : "bệnh nhân này"}?
            {isMultiple ? (
              <div className="mt-2 max-h-32 overflow-y-auto">
                <ul className="list-disc list-inside space-y-1">
                  {patientNames.map((name, index) => (
                    <li key={index} className="text-sm">{name}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-2">
                <p className="font-medium">{patientNames[0]}</p>
              </div>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              Hành động này không thể hoàn tác. Tất cả hồ sơ bệnh nhân, lịch hẹn và lịch sử y tế sẽ bị xóa vĩnh viễn.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Xóa {isMultiple ? `${patientIds.length} bệnh nhân` : "bệnh nhân"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};