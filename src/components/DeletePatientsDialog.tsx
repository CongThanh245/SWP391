
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
  trigger 
}: DeletePatientsDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = () => {
    onDelete(patientIds);
    toast({
      title: "Patients Deleted",
      description: `${patientIds.length} patient${patientIds.length > 1 ? 's' : ''} deleted successfully.`,
      variant: "destructive",
    });
    setOpen(false);
  };

  const isMultiple = patientIds.length > 1;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete {isMultiple ? `${patientIds.length} Patients` : 'Patient'}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {isMultiple ? 'Patients' : 'Patient'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {isMultiple ? 'these patients' : 'this patient'}?
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
              This action cannot be undone. All patient records, appointments, and medical history will be permanently deleted.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete {isMultiple ? `${patientIds.length} Patients` : 'Patient'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};