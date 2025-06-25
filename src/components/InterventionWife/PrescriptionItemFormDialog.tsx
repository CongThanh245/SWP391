// components/InterventionWife/PrescriptionItemFormDialog.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@components/ui/dialog';
import { Label } from '@components/ui/label';
import { Input } from '@components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Button } from '@components/ui/button';
import { Save, X } from 'lucide-react';

interface Medication { id: string; name: string; }
interface PrescriptionItem { medicationId: string; drugName?: string; dosage: string; frequency: string; duration: string; quantity: number; }

interface PrescriptionItemFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    itemToEdit: PrescriptionItem | null;
    medicationList: Medication[];
    onSave: (item: PrescriptionItem) => void;
    isSaving: boolean; // Indicates if the parent component is saving
}

const PrescriptionItemFormDialog: React.FC<PrescriptionItemFormDialogProps> = ({
    isOpen, onClose, itemToEdit, medicationList, onSave, isSaving
}) => {
    const [formData, setFormData] = useState<PrescriptionItem>({
        medicationId: '', drugName: '', dosage: '', frequency: '', duration: '', quantity: 0,
    });

    useEffect(() => {
        if (itemToEdit) {
            setFormData(itemToEdit);
        } else {
            setFormData({ medicationId: '', drugName: '', dosage: '', frequency: '', duration: '', quantity: 0 });
        }
    }, [itemToEdit, isOpen]); // Reset form data when itemToEdit changes or dialog opens

    const handleChange = (field: keyof PrescriptionItem, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleMedicationSelect = (name: string) => {
        const selectedMed = medicationList.find(med => med.name === name);
        setFormData(prev => ({
            ...prev,
            drugName: name,
            medicationId: selectedMed?.id || ''
        }));
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-6">
                <DialogHeader>
                    <DialogTitle>{itemToEdit?.medicationId ? 'Chỉnh sửa' : 'Thêm'} mục thuốc</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Tên thuốc</Label>
                        <Select
                            value={formData.drugName || ''}
                            onValueChange={handleMedicationSelect}
                            disabled={isSaving}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn tên thuốc" />
                            </SelectTrigger>
                            <SelectContent>
                                {medicationList.map((med) => (
                                    <SelectItem key={med.id} value={med.name}>
                                        {med.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Liều lượng</Label>
                        <Input
                            placeholder="Ví dụ: 10mg"
                            value={formData.dosage}
                            onChange={(e) => handleChange('dosage', e.target.value)}
                            disabled={isSaving}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Tần suất</Label>
                        <Input
                            placeholder="Ví dụ: Mỗi ngày một lần"
                            value={formData.frequency}
                            onChange={(e) => handleChange('frequency', e.target.value)}
                            disabled={isSaving}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Thời lượng</Label>
                        <Input
                            placeholder="Ví dụ: 7 ngày"
                            value={formData.duration}
                            onChange={(e) => handleChange('duration', e.target.value)}
                            disabled={isSaving}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Số lượng</Label>
                        <Input
                            type="number"
                            placeholder="Nhập số lượng"
                            value={formData.quantity}
                            onChange={(e) => handleChange('quantity', parseFloat(e.target.value) || 0)}
                            disabled={isSaving}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSaving}>
                        <X className="w-4 h-4 mr-2" /> Hủy
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" /> Lưu mục thuốc
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PrescriptionItemFormDialog;