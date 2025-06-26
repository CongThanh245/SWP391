import React, { useEffect, useState, useCallback } from 'react';
import { Card } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Plus, Loader2, Edit, Save, X, CheckCircle, Ban, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@components/ui/dialog';
import { formatDate } from '@utils/format'; // Assuming you have this utility

// Import the new API functions
import {
    getMedicationList,
    getEndometrialPreparationProcess,
    updateEndometrialPreparationProcess,
    completeEndometrialPreparationProcess,
    cancelEndometrialPreparationProcess,
} from '@api/doctorInterventionApi'; // Adjust path if you created a new API file

// Import or define shared interfaces
interface Medication { id: string; name: string; }
interface PrescriptionItem { medicationId: string; drugName?: string; dosage: string; frequency: string; duration: string; quantity: number; }
interface Prescription { dateIssued: string; notes: string; items: PrescriptionItem[]; }

// Define possible statuses with your specific enum values
type EndometrialPreparationStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

interface EndometrialPreparationData {
    prescription: Prescription;
    startDate: string;
    drugResponse: string; // Assuming 'drugResponse' is also applicable here
    status: EndometrialPreparationStatus;
}

// Reuse or adapt this dialog component
import PrescriptionItemFormDialog from './PrescriptionItemFormDialog';

interface EndometrialPreparationCardProps {
    patientId: string;
}

const EndometrialPreparationCard: React.FC<EndometrialPreparationCardProps> = ({ patientId }) => {
    const [endometrialPreparationData, setEndometrialPreparationData] = useState<EndometrialPreparationData>(() => ({
        prescription: { dateIssued: new Date().toISOString().split('T')[0], notes: '', items: [] },
        startDate: new Date().toISOString().split('T')[0],
        drugResponse: '', // Default value
        status: 'IN_PROGRESS'
    }));

    const [isEndometrialPreparationDialogOpen, setIsEndometrialPreparationDialogOpen] = useState(false);
    const [isLoadingEndometrialPreparation, setIsLoadingEndometrialPreparation] = useState(false);
    const [errorEndometrialPreparation, setErrorEndometrialPreparation] = useState<string | null>(null);

    const [isSavingEndometrialPreparation, setIsSavingEndometrialPreparation] = useState(false);
    const [saveErrorEndometrialPreparation, setSaveErrorEndometrialPreparation] = useState<string | null>(null);
    const [saveSuccessEndometrialPreparation, setSaveSuccessEndometrialPreparation] = useState(false);

    const [isCompleting, setIsCompleting] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    const [medicationList, setMedicationList] = useState<Medication[]>([]);
    const [isLoadingMedicationList, setIsLoadingMedicationList] = useState(false);
    const [errorMedicationList, setErrorMedicationList] = useState<string | null>(null);

    const [currentPrescriptionItem, setCurrentPrescriptionItem] = useState<PrescriptionItem>({
        medicationId: '', drugName: '', dosage: '', frequency: '', duration: '', quantity: 0,
    });
    const [isPrescriptionItemDialogOpen, setIsPrescriptionItemDialogOpen] = useState(false);
    const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

    // Fetch medication list once on component mount
    useEffect(() => {
        const fetchMedications = async () => {
            setIsLoadingMedicationList(true);
            setErrorMedicationList(null);
            try {
                const data = await getMedicationList();
                setMedicationList(data);
            } catch (error) {
                console.error("Failed to fetch medication list:", error);
                setErrorMedicationList("Không thể tải danh sách thuốc. Vui lòng thử lại.");
            } finally {
                setIsLoadingMedicationList(false);
            }
        };
        fetchMedications();
    }, []);

    // Fetch endometrial preparation data when patientId or medicationList changes
    useEffect(() => {
        const fetchEndometrialPreparationData = async () => {
            if (!patientId || medicationList.length === 0) return;

            setIsLoadingEndometrialPreparation(true);
            setErrorEndometrialPreparation(null);
            try {
                // Cast the fetched data to EndometrialPreparationData
                const data = (await getEndometrialPreparationProcess(patientId)) as EndometrialPreparationData;

                console.log("Fetched endometrial preparation data:", data); // For debugging
                if (data) {
                    const validStatuses: EndometrialPreparationStatus[] = ['IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
                    const validatedStatus: EndometrialPreparationStatus = validStatuses.includes(data.status)
                        ? data.status
                        : 'IN_PROGRESS';

                    const itemsWithDrugNames = data.prescription.items.map((item) => ({
                        ...item,
                        drugName: medicationList.find(med => med.id === item.medicationId)?.name || 'Thuốc không xác định'
                    }));
                    setEndometrialPreparationData({
                        ...data,
                        status: validatedStatus,
                        prescription: {
                            ...data.prescription,
                            items: itemsWithDrugNames
                        }
                    });
                } else {
                    setEndometrialPreparationData(() => ({
                        prescription: { dateIssued: new Date().toISOString().split('T')[0], notes: '', items: [] },
                        startDate: new Date().toISOString().split('T')[0],
                        drugResponse: '',
                        status: 'IN_PROGRESS'
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch endometrial preparation process:", error);
                setErrorEndometrialPreparation("Không thể tải dữ liệu chuẩn bị nội mạc tử cung.");
                setEndometrialPreparationData(() => ({
                    prescription: { dateIssued: new Date().toISOString().split('T')[0], notes: '', items: [] },
                    startDate: new Date().toISOString().split('T')[0],
                    drugResponse: '',
                    status: 'IN_PROGRESS'
                }));
            } finally {
                setIsLoadingEndometrialPreparation(false);
            }
        };

        fetchEndometrialPreparationData();
    }, [patientId, medicationList]);

    const handleEndometrialPreparationChange = (field: string, value, subField?: string) => {
        setEndometrialPreparationData(prev => {
            if (field === 'startDate' || field === 'drugResponse') {
                return { ...prev, [field]: value };
            }
            if (field === 'prescription' && subField) {
                return {
                    ...prev,
                    prescription: {
                        ...prev.prescription,
                        [subField]: value,
                    },
                };
            }
            return prev;
        });
    };

    const handleAddItem = () => {
        setCurrentPrescriptionItem({ medicationId: '', drugName: '', dosage: '', frequency: '', duration: '', quantity: 0 });
        setEditingItemIndex(null);
        setIsPrescriptionItemDialogOpen(true);
    };

    const handleEditItem = (item: PrescriptionItem, index: number) => {
        setCurrentPrescriptionItem({ ...item });
        setEditingItemIndex(index);
        setIsPrescriptionItemDialogOpen(true);
    };

    const handleDeleteItem = (index: number) => {
        setEndometrialPreparationData(prev => {
            const updatedItems = prev.prescription.items.filter((_, i) => i !== index);
            return {
                ...prev,
                prescription: { ...prev.prescription, items: updatedItems },
            };
        });
    };

    const handleSavePrescriptionItem = (item: PrescriptionItem) => {
        if (!item.medicationId || !item.dosage) {
            alert("Tên thuốc và Liều lượng không được để trống.");
            return;
        }

        setEndometrialPreparationData(prev => {
            let updatedItems;
            if (editingItemIndex !== null) {
                updatedItems = prev.prescription.items.map((existingItem, idx) =>
                    idx === editingItemIndex ? item : existingItem
                );
            } else {
                updatedItems = [...prev.prescription.items, item];
            }

            return {
                ...prev,
                prescription: { ...prev.prescription, items: updatedItems },
            };
        });
        setIsPrescriptionItemDialogOpen(false);
    };

    const handleSaveEndometrialPreparation = useCallback(async () => {
        if (!patientId) {
            setSaveErrorEndometrialPreparation("Dữ liệu bệnh nhân không hợp lệ để lưu.");
            return;
        }

        setIsSavingEndometrialPreparation(true);
        setSaveErrorEndometrialPreparation(null);
        setSaveSuccessEndometrialPreparation(false);

        try {
            const dataToSend = {
                ...endometrialPreparationData,
                prescription: {
                    ...endometrialPreparationData.prescription,
                    items: endometrialPreparationData.prescription.items.map(({ drugName, ...rest }) => rest)
                }
            };
            await updateEndometrialPreparationProcess(patientId, dataToSend);
            setSaveSuccessEndometrialPreparation(true);
            setTimeout(() => {
                setSaveSuccessEndometrialPreparation(false);
                setIsEndometrialPreparationDialogOpen(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to save endometrial preparation process:", error);
            setSaveErrorEndometrialPreparation(error.response?.data?.message || "Đã xảy ra lỗi khi lưu.");
        } finally {
            setIsSavingEndometrialPreparation(false);
        }
    }, [patientId, endometrialPreparationData]);

    const handleCompleteEndometrialPreparation = useCallback(async () => {
        if (!patientId) {
            setErrorEndometrialPreparation("Dữ liệu bệnh nhân không hợp lệ để hoàn thành.");
            return;
        }
        setIsCompleting(true);
        setErrorEndometrialPreparation(null);
        try {
            await completeEndometrialPreparationProcess(patientId);
            setEndometrialPreparationData(prev => ({ ...prev, status: 'COMPLETED' }));
            alert("Quá trình đã được đánh dấu là HOÀN THÀNH.");
            setIsEndometrialPreparationDialogOpen(false);
        } catch (error) {
            console.error("Failed to complete endometrial preparation process:", error);
            setErrorEndometrialPreparation(error.response?.data?.message || "Không thể hoàn thành quá trình chuẩn bị nội mạc tử cung.");
        } finally {
            setIsCompleting(false);
        }
    }, [patientId]);

    const handleCancelEndometrialPreparation = useCallback(async () => {
        if (!patientId) {
            setErrorEndometrialPreparation("Dữ liệu bệnh nhân không hợp lệ để hủy.");
            return;
        }
        setIsCancelling(true);
        setErrorEndometrialPreparation(null);
        try {
            await cancelEndometrialPreparationProcess(patientId);
            setEndometrialPreparationData(prev => ({ ...prev, status: 'CANCELLED' }));
            alert("Quá trình đã được đánh dấu là ĐÃ HỦY.");
            setIsEndometrialPreparationDialogOpen(false);
        } catch (error) {
            console.error("Failed to cancel endometrial preparation process:", error);
            setErrorEndometrialPreparation(error.response?.data?.message || "Không thể hủy quá trình chuẩn bị nội mạc tử cung.");
        } finally {
            setIsCancelling(false);
        }
    }, [patientId]);

    const renderValue = (value) => value || 'N/A';

    const isEditable = endometrialPreparationData.status === 'IN_PROGRESS';
    const isOperationInProgress = isSavingEndometrialPreparation || isCompleting || isCancelling;

    const renderStatusInVietnamese = (status: EndometrialPreparationStatus) => {
        switch (status) {
            case 'IN_PROGRESS':
                return 'Đang tiến hành';
            case 'COMPLETED':
                return 'Đã hoàn thành';
            case 'CANCELLED':
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    };

    return (
        <Card className="p-6 bg-white border border-[color:var(--card-border)]">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-between text-[color:var(--text-accent)]">
                Chuẩn bị nội mạc tử cung
                <Button variant="outline" size="sm" onClick={() => setIsEndometrialPreparationDialogOpen(true)} className="ml-2" disabled={isOperationInProgress}>
                    <Edit className="w-4 h-4 mr-2" /> {endometrialPreparationData.prescription.items.length > 0 || endometrialPreparationData.startDate ? 'Chỉnh sửa' : 'Nhập liệu'}
                </Button>
            </h3>

            {isLoadingEndometrialPreparation && (
                <div className="text-center text-[color:var(--text-secondary)] py-4">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-[color:var(--deep-taupe)] mb-2" />
                    Đang tải dữ liệu chuẩn bị nội mạc tử cung...
                </div>
            )}

            {errorEndometrialPreparation && !isLoadingEndometrialPreparation && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 text-center rounded-lg mb-4">
                    Lỗi: {errorEndometrialPreparation}
                </div>
            )}

            {!isLoadingEndometrialPreparation && !errorEndometrialPreparation && (
                <>
                    {(!endometrialPreparationData.prescription.items.length && !endometrialPreparationData.startDate && !endometrialPreparationData.drugResponse && endometrialPreparationData.status === 'IN_PROGRESS') ? (
                        <p className="text-center text-[color:var(--text-secondary)] mb-4">Chưa có dữ liệu chuẩn bị nội mạc tử cung.</p>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Ngày bắt đầu</Label>
                                    <p className="font-medium">{renderValue(formatDate(endometrialPreparationData.startDate))}</p>
                                </div>
                                <div>
                                    <Label>Đáp ứng thuốc</Label>
                                    <p className="font-medium">{renderValue(endometrialPreparationData.drugResponse)}</p>
                                </div>
                                <div>
                                    <Label>Trạng thái</Label>
                                    <p className="font-medium">{renderStatusInVietnamese(endometrialPreparationData.status)}</p>
                                </div>
                            </div>

                            {endometrialPreparationData.prescription && (
                                <div className="mt-4 border-t pt-4">
                                    <h4 className="text-md font-semibold mb-2">Đơn thuốc</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <Label>Ngày cấp</Label>
                                            <p className="font-medium">{renderValue(formatDate(endometrialPreparationData.prescription.dateIssued))}</p>
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                            <Label>Ghi chú</Label>
                                            <p className="font-medium">{renderValue(endometrialPreparationData.prescription.notes)}</p>
                                        </div>
                                    </div>

                                    {endometrialPreparationData.prescription.items.length > 0 ? (
                                        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                            <Label>Các mục thuốc đã kê</Label>
                                            {endometrialPreparationData.prescription.items.map((item, index) => (
                                                <Card key={index} className="p-4 border-l-4 border-[color:var(--deep-taupe)] bg-gray-50 flex justify-between items-center">
                                                    <div>
                                                        <p className="font-semibold text-[color:var(--text-accent)]">{renderValue(item.drugName)}</p>
                                                        <p className="text-sm text-[color:var(--text-secondary)]">
                                                            Liều: {renderValue(item.dosage)} | Tần suất: {renderValue(item.frequency)} | Thời lượng: {renderValue(item.duration)} | SL: {renderValue(item.quantity)}
                                                        </p>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-[color:var(--text-secondary)]">Chưa có mục thuốc nào trong đơn.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            <Dialog open={isEndometrialPreparationDialogOpen} onOpenChange={setIsEndometrialPreparationDialogOpen}>
                <DialogContent className="sm:max-w-[700px] p-6 max-h-[90vh] overflow-y-auto"> {/* Added max-h and overflow for scroll */}
                    <DialogHeader>
                        <DialogTitle>{isEditable ? 'Chỉnh sửa' : 'Xem'} Chuẩn bị nội mạc tử cung</DialogTitle>
                        <DialogDescription>
                            {isEditable ? "Cập nhật thông tin và đơn thuốc cho quá trình chuẩn bị nội mạc tử cung." : "Quá trình đã hoàn thành hoặc bị hủy, không thể chỉnh sửa."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Ngày bắt đầu</Label>
                            <Input
                                type="date"
                                value={endometrialPreparationData.startDate || ''}
                                onChange={(e) => handleEndometrialPreparationChange('startDate', e.target.value)}
                                disabled={!isEditable || isSavingEndometrialPreparation}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Đáp ứng thuốc</Label>
                            <Select
                                value={endometrialPreparationData.drugResponse || ''}
                                onValueChange={(value) => handleEndometrialPreparationChange('drugResponse', value)}
                                disabled={!isEditable || isSavingEndometrialPreparation}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn đáp ứng" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EFFECTIVE">Hiệu quả</SelectItem>
                                    <SelectItem value="NOT_EFFECTIVE">Không hiệu quả</SelectItem>
                                    <SelectItem value="GOOD">Tốt</SelectItem>
                                    <SelectItem value="AVERAGE">Trung bình</SelectItem>
                                    <SelectItem value="POOR">Kém</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label>Trạng thái quá trình</Label>
                            <p className="font-medium text-[color:var(--text-accent)]">
                                {renderStatusInVietnamese(endometrialPreparationData.status)}
                            </p>
                        </div>

                        <div className="col-span-1 md:col-span-2 border-t pt-4 mt-4">
                            <h4 className="text-md font-semibold mb-2">Thông tin đơn thuốc</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Ngày cấp đơn</Label>
                                    <Input
                                        type="date"
                                        value={endometrialPreparationData.prescription.dateIssued || ''}
                                        onChange={(e) => handleEndometrialPreparationChange('prescription', e.target.value, 'dateIssued')}
                                        disabled={!isEditable || isSavingEndometrialPreparation}
                                    />
                                </div>
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <Label>Ghi chú đơn thuốc</Label>
                                    <Textarea
                                        placeholder="Ghi chú về đơn thuốc..."
                                        value={endometrialPreparationData.prescription.notes || ''}
                                        onChange={(e) => handleEndometrialPreparationChange('prescription', e.target.value, 'notes')}
                                        disabled={!isEditable || isSavingEndometrialPreparation}
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <Label>Các mục thuốc trong đơn</Label>
                                    <Button variant="outline" size="sm" onClick={handleAddItem} disabled={!isEditable || isSavingEndometrialPreparation}>
                                        <Plus className="w-4 h-4 mr-2" /> Thêm thuốc
                                    </Button>
                                </div>
                                {endometrialPreparationData.prescription.items.length === 0 ? (
                                    <p className="text-sm text-[color:var(--text-secondary)]">Chưa có mục thuốc nào được thêm.</p>
                                ) : (
                                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                        {endometrialPreparationData.prescription.items.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                                                <span className="font-medium">{item.drugName} - {item.dosage}</span>
                                                <div className="flex space-x-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleEditItem(item, index)} disabled={!isEditable || isSavingEndometrialPreparation}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="text-red-600 hover:text-red-800" onClick={() => handleDeleteItem(index)} disabled={!isEditable || isSavingEndometrialPreparation}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4">
                        {isOperationInProgress && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
                        {saveErrorEndometrialPreparation && <p className="text-red-500 text-sm mr-2">{saveErrorEndometrialPreparation}</p>}
                        {saveSuccessEndometrialPreparation && <p className="text-green-500 text-sm mr-2">Lưu thành công!</p>}

                        {endometrialPreparationData.status === 'IN_PROGRESS' && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleCancelEndometrialPreparation}
                                    disabled={isOperationInProgress}
                                    className="text-orange-600 hover:text-orange-800"
                                >
                                    <Ban className="w-4 h-4 mr-2" /> {isCancelling ? 'Đang hủy...' : 'Hủy quá trình'}
                                </Button>
                                <Button
                                    onClick={handleCompleteEndometrialPreparation}
                                    disabled={isOperationInProgress}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" /> {isCompleting ? 'Đang hoàn thành...' : 'Hoàn thành quá trình'}
                                </Button>
                            </>
                        )}

                        <Button variant="outline" onClick={() => setIsEndometrialPreparationDialogOpen(false)} disabled={isOperationInProgress}>
                            <X className="w-4 h-4 mr-2" /> {isEditable ? 'Hủy' : 'Đóng'}
                        </Button>
                        {isEditable && (
                            <Button onClick={handleSaveEndometrialPreparation} disabled={isSavingEndometrialPreparation}>
                                <Save className="w-4 h-4 mr-2" /> {isSavingEndometrialPreparation ? 'Đang lưu...' : 'Lưu'}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <PrescriptionItemFormDialog
                isOpen={isPrescriptionItemDialogOpen}
                onClose={() => setIsPrescriptionItemDialogOpen(false)}
                itemToEdit={currentPrescriptionItem}
                medicationList={medicationList}
                onSave={handleSavePrescriptionItem}
                isSaving={isSavingEndometrialPreparation}
                // If you want the PrescriptionItemFormDialog inputs to be disabled when the parent form is not editable:
                // isParentFormEditable={isEditable}
            />
        </Card>
    );
};

export default EndometrialPreparationCard;