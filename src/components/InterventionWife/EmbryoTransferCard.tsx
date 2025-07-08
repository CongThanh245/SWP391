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
    getEmbryoTransferProcess,
    updateEmbryoTransferProcess,
    completeEmbryoTransferProcess,
    cancelEmbryoTransferProcess,
} from '@api/doctorInterventionApi'; // Adjust path if you created a new API file

// Import or define shared interfaces
interface Medication { id: string; name: string; }
interface PrescriptionItem { medicationId: string; drugName?: string; dosage: string; frequency: string; duration: string; quantity: number; }
interface Prescription { dateIssued: string; notes: string; items: PrescriptionItem[]; }

// Define possible statuses with your specific enum values
type EmbryoTransferStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

interface EmbryoTransferData {
    prescription: Prescription;
    actionDate: string; // Changed from startDate to actionDate
    drugResponse: string; // Assuming 'drugResponse' is also applicable here
    status: EmbryoTransferStatus;
}

// Reuse or adapt this dialog component
import PrescriptionItemFormDialog from './PrescriptionItemFormDialog';

interface EmbryoTransferCardProps {
    patientId: string;
}

const EmbryoTransferCard: React.FC<EmbryoTransferCardProps> = ({ patientId }) => {
    const [embryoTransferData, setEmbryoTransferData] = useState<EmbryoTransferData>(() => ({
        prescription: { dateIssued: new Date().toISOString().split('T')[0], notes: '', items: [] },
        actionDate: new Date().toISOString().split('T')[0], // Changed from startDate
        drugResponse: '', // Default value
        status: 'IN_PROGRESS'
    }));

    const [isEmbryoTransferDialogOpen, setIsEmbryoTransferDialogOpen] = useState(false);
    const [isLoadingEmbryoTransfer, setIsLoadingEmbryoTransfer] = useState(false);
    const [errorEmbryoTransfer, setErrorEmbryoTransfer] = useState<string | null>(null);

    const [isSavingEmbryoTransfer, setIsSavingEmbryoTransfer] = useState(false);
    const [saveErrorEmbryoTransfer, setSaveErrorEmbryoTransfer] = useState<string | null>(null);
    const [saveSuccessEmbryoTransfer, setSaveSuccessEmbryoTransfer] = useState(false);

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

    // Fetch embryo transfer data when patientId or medicationList changes
    useEffect(() => {
        const fetchEmbryoTransferData = async () => {
            if (!patientId || medicationList.length === 0) return;

            setIsLoadingEmbryoTransfer(true);
            setErrorEmbryoTransfer(null);
            try {
                // Cast the fetched data to EmbryoTransferData
                const data = (await getEmbryoTransferProcess(patientId)) as EmbryoTransferData;

                console.log("Fetched embryo transfer data:", data); // For debugging
                if (data) {
                    const validStatuses: EmbryoTransferStatus[] = ['IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
                    const validatedStatus: EmbryoTransferStatus = validStatuses.includes(data.status)
                        ? data.status
                        : 'IN_PROGRESS';

                    const itemsWithDrugNames = data.prescription.items.map((item) => ({
                        ...item,
                        drugName: medicationList.find(med => med.id === item.medicationId)?.name || 'Thuốc không xác định'
                    }));
                    setEmbryoTransferData({
                        ...data,
                        status: validatedStatus,
                        prescription: {
                            ...data.prescription,
                            items: itemsWithDrugNames
                        }
                    });
                } else {
                    setEmbryoTransferData(() => ({
                        prescription: { dateIssued: new Date().toISOString().split('T')[0], notes: '', items: [] },
                        actionDate: new Date().toISOString().split('T')[0], // Changed from startDate
                        drugResponse: '',
                        status: 'IN_PROGRESS'
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch embryo transfer process:", error);
                setErrorEmbryoTransfer("Không thể tải dữ liệu chuyển phôi.");
                setEmbryoTransferData(() => ({
                    prescription: { dateIssued: new Date().toISOString().split('T')[0], notes: '', items: [] },
                    actionDate: new Date().toISOString().split('T')[0], // Changed from startDate
                    drugResponse: '',
                    status: 'IN_PROGRESS'
                }));
            } finally {
                setIsLoadingEmbryoTransfer(false);
            }
        };

        fetchEmbryoTransferData();
    }, [patientId, medicationList]);

    const handleEmbryoTransferChange = (field: string, value, subField?: string) => {
        setEmbryoTransferData(prev => {
            if (field === 'actionDate' || field === 'drugResponse') { // Changed from startDate
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
        setEmbryoTransferData(prev => {
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

        setEmbryoTransferData(prev => {
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

    const handleSaveEmbryoTransfer = useCallback(async () => {
        if (!patientId) {
            setSaveErrorEmbryoTransfer("Dữ liệu bệnh nhân không hợp lệ để lưu.");
            return;
        }

        setIsSavingEmbryoTransfer(true);
        setSaveErrorEmbryoTransfer(null);
        setSaveSuccessEmbryoTransfer(false);

        try {
            const dataToSend = {
                ...embryoTransferData,
                prescription: {
                    ...embryoTransferData.prescription,
                    items: embryoTransferData.prescription.items.map(({ drugName, ...rest }) => rest)
                }
            };
            await updateEmbryoTransferProcess(patientId, dataToSend);
            setSaveSuccessEmbryoTransfer(true);
            setTimeout(() => {
                setSaveSuccessEmbryoTransfer(false);
                setIsEmbryoTransferDialogOpen(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to save embryo transfer process:", error);
            setSaveErrorEmbryoTransfer(error.response?.data?.message || "Đã xảy ra lỗi khi lưu.");
        } finally {
            setIsSavingEmbryoTransfer(false);
        }
    }, [patientId, embryoTransferData]);

    const handleCompleteEmbryoTransfer = useCallback(async () => {
        if (!patientId) {
            setErrorEmbryoTransfer("Dữ liệu bệnh nhân không hợp lệ để hoàn thành.");
            return;
        }
        setIsCompleting(true);
        setErrorEmbryoTransfer(null);
        try {
            await completeEmbryoTransferProcess(patientId);
            setEmbryoTransferData(prev => ({ ...prev, status: 'COMPLETED' }));
            alert("Quá trình đã được đánh dấu là HOÀN THÀNH.");
            setIsEmbryoTransferDialogOpen(false);
        } catch (error) {
            console.error("Failed to complete embryo transfer process:", error);
            setErrorEmbryoTransfer(error.response?.data?.message || "Không thể hoàn thành quá trình chuyển phôi.");
        } finally {
            setIsCompleting(false);
        }
    }, [patientId]);

    const handleCancelEmbryoTransfer = useCallback(async () => {
        if (!patientId) {
            setErrorEmbryoTransfer("Dữ liệu bệnh nhân không hợp lệ để hủy.");
            return;
        }
        setIsCancelling(true);
        setErrorEmbryoTransfer(null);
        try {
            await cancelEmbryoTransferProcess(patientId);
            setEmbryoTransferData(prev => ({ ...prev, status: 'CANCELLED' }));
            alert("Quá trình đã được đánh dấu là ĐÃ HỦY.");
            setIsEmbryoTransferDialogOpen(false);
        } catch (error) {
            console.error("Failed to cancel embryo transfer process:", error);
            setErrorEmbryoTransfer(error.response?.data?.message || "Không thể hủy quá trình chuyển phôi.");
        } finally {
            setIsCancelling(false);
        }
    }, [patientId]);

    const renderValue = (value) => value || 'N/A';

    const isEditable = embryoTransferData.status === 'IN_PROGRESS';
    const isOperationInProgress = isSavingEmbryoTransfer || isCompleting || isCancelling;

    const renderStatusInVietnamese = (status: EmbryoTransferStatus) => {
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
                Chuyển phôi
                <Button variant="outline" size="sm" onClick={() => setIsEmbryoTransferDialogOpen(true)} className="ml-2" disabled={isOperationInProgress}>
                    <Edit className="w-4 h-4 mr-2" /> {embryoTransferData.prescription.items.length > 0 || embryoTransferData.actionDate ? 'Chỉnh sửa' : 'Nhập liệu'}
                </Button>
            </h3>

            {isLoadingEmbryoTransfer && (
                <div className="text-center text-[color:var(--text-secondary)] py-4">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-[color:var(--deep-taupe)] mb-2" />
                    Đang tải dữ liệu chuyển phôi...
                </div>
            )}

            {errorEmbryoTransfer && !isLoadingEmbryoTransfer && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 text-center rounded-lg mb-4">
                    Lỗi: {errorEmbryoTransfer}
                </div>
            )}

            {!isLoadingEmbryoTransfer && !errorEmbryoTransfer && (
                <>
                    {(!embryoTransferData.prescription.items.length && !embryoTransferData.actionDate && !embryoTransferData.drugResponse && embryoTransferData.status === 'IN_PROGRESS') ? (
                        <p className="text-center text-[color:var(--text-secondary)] mb-4">Chưa có dữ liệu chuyển phôi.</p>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Ngày thực hiện</Label> {/* Changed label */}
                                    <p className="font-medium">{renderValue(formatDate(embryoTransferData.actionDate))}</p>
                                </div>
                                <div>
                                    <Label>Đáp ứng thuốc</Label>
                                    <p className="font-medium">{renderValue(embryoTransferData.drugResponse)}</p>
                                </div>
                                <div>
                                    <Label>Trạng thái</Label>
                                    <p className="font-medium">{renderStatusInVietnamese(embryoTransferData.status)}</p>
                                </div>
                            </div>

                            {embryoTransferData.prescription && (
                                <div className="mt-4 border-t pt-4">
                                    <h4 className="text-md font-semibold mb-2">Đơn thuốc</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <Label>Ngày cấp</Label>
                                            <p className="font-medium">{renderValue(formatDate(embryoTransferData.prescription.dateIssued))}</p>
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                            <Label>Ghi chú</Label>
                                            <p className="font-medium">{renderValue(embryoTransferData.prescription.notes)}</p>
                                        </div>
                                    </div>

                                    {embryoTransferData.prescription.items.length > 0 ? (
                                        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                            <Label>Các mục thuốc đã kê</Label>
                                            {embryoTransferData.prescription.items.map((item, index) => (
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

            <Dialog open={isEmbryoTransferDialogOpen} onOpenChange={setIsEmbryoTransferDialogOpen}>
                <DialogContent className="sm:max-w-[700px] p-6 max-h-[90vh] overflow-y-auto"> {/* Added max-h and overflow for scroll */}
                    <DialogHeader>
                        <DialogTitle>{isEditable ? 'Chỉnh sửa' : 'Xem'} Chuyển phôi</DialogTitle>
                        <DialogDescription>
                            {isEditable ? "Cập nhật thông tin và đơn thuốc cho quá trình chuyển phôi." : "Quá trình đã hoàn thành hoặc bị hủy, không thể chỉnh sửa."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Ngày thực hiện</Label> {/* Changed label */}
                            <Input
                                type="date"
                                value={embryoTransferData.actionDate || ''} // Changed from startDate
                                onChange={(e) => handleEmbryoTransferChange('actionDate', e.target.value)} // Changed from startDate
                                disabled={!isEditable || isSavingEmbryoTransfer}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Đáp ứng thuốc</Label>
                            <Select
                                value={embryoTransferData.drugResponse || ''}
                                onValueChange={(value) => handleEmbryoTransferChange('drugResponse', value)}
                                disabled={!isEditable || isSavingEmbryoTransfer}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn đáp ứng" />
                                </SelectTrigger>
                               <SelectContent>
                                    <SelectItem value="EFFECTIVE">Hiệu quả</SelectItem>
                                    <SelectItem value="INEFFECTIVE">Không hiệu quả</SelectItem>
                                    <SelectItem value="UNCLEAR">Chưa kết luận</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                            <Label>Trạng thái quá trình:</Label>
                             <p className="font-medium text-sm text-[color:#6C9BCF]">
                                {renderStatusInVietnamese(embryoTransferData.status)}
                            </p>
                        </div>

                        <div className="col-span-1 md:col-span-2 border-t pt-4 mt-4">
                            <h4 className="text-md font-semibold mb-2">Thông tin đơn thuốc</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Ngày cấp đơn</Label>
                                    <Input
                                        type="date"
                                        value={embryoTransferData.prescription.dateIssued || ''}
                                        onChange={(e) => handleEmbryoTransferChange('prescription', e.target.value, 'dateIssued')}
                                        disabled={!isEditable || isSavingEmbryoTransfer}
                                    />
                                </div>
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <Label>Ghi chú đơn thuốc</Label>
                                    <Textarea
                                        placeholder="Ghi chú về đơn thuốc..."
                                        value={embryoTransferData.prescription.notes || ''}
                                        onChange={(e) => handleEmbryoTransferChange('prescription', e.target.value, 'notes')}
                                        disabled={!isEditable || isSavingEmbryoTransfer}
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <Label>Các mục thuốc trong đơn</Label>
                                    <Button variant="outline" size="sm" onClick={handleAddItem} disabled={!isEditable || isSavingEmbryoTransfer}>
                                        <Plus className="w-4 h-4 mr-2" /> Thêm thuốc
                                    </Button>
                                </div>
                                {embryoTransferData.prescription.items.length === 0 ? (
                                    <p className="text-sm text-[color:var(--text-secondary)]">Chưa có mục thuốc nào được thêm.</p>
                                ) : (
                                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                        {embryoTransferData.prescription.items.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                                                <span className="font-medium">{item.drugName} - {item.dosage}</span>
                                                <div className="flex space-x-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleEditItem(item, index)} disabled={!isEditable || isSavingEmbryoTransfer}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="text-red-600 hover:text-red-800" onClick={() => handleDeleteItem(index)} disabled={!isEditable || isSavingEmbryoTransfer}>
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
                <DialogFooter className="sticky bottom-[-18px] bg-white z-10 border-t pt-4">
                        {isOperationInProgress && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
                        {saveErrorEmbryoTransfer && <p className="text-red-500 text-sm mr-2">{saveErrorEmbryoTransfer}</p>}
                        {saveSuccessEmbryoTransfer && <p className="text-green-500 text-sm mr-2">Lưu thành công!</p>}

                        {embryoTransferData.status === 'IN_PROGRESS' && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleCancelEmbryoTransfer}
                                    disabled={isOperationInProgress}
                                    className="text-orange-600 hover:text-orange-800"
                                >
                                      {isCancelling ? 'Đang hủy...' : 'Hủy quá trình'}
                                </Button>
                                <Button
                                    onClick={handleCompleteEmbryoTransfer}
                                    disabled={isOperationInProgress}
                                    className="bg-[#6C9BCF] hover:bg-[#4F7AA3] text-white"
                                >
                                      {isCompleting ? 'Đang hoàn thành...' : 'Hoàn thành quá trình'}
                                </Button>
                            </>
                        )}

                        {isEditable && (
                            <Button onClick={handleSaveEmbryoTransfer} disabled={isSavingEmbryoTransfer}>
                                <Save className="w-4 h-4 mr-2" /> {isSavingEmbryoTransfer ? 'Đang lưu...' : 'Lưu'}
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
                isSaving={isSavingEmbryoTransfer}
                // If you want the PrescriptionItemFormDialog inputs to be disabled when the parent form is not editable:
                // isParentFormEditable={isEditable}
            />
        </Card>
    );
};

export default EmbryoTransferCard;