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
    getOvulationTriggerInjectionProcess,
    updateOvulationTriggerInjectionProcess,
    completeOvulationTriggerInjectionProcess,
    cancelOvulationTriggerInjectionProcess,
} from '@api/doctorInterventionApi'; // Adjust path if you created a new API file

// Import or define shared interfaces
interface Medication { id: string; name: string; }
interface PrescriptionItem { medicationId: string; drugName?: string; dosage: string; frequency: string; duration: string; quantity: number; }
interface Prescription { dateIssued: string; notes: string; items: PrescriptionItem[]; }

// Define possible statuses with your specific enum values
type OvulationTriggerStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

interface OvulationTriggerInjectionData {
    prescription: Prescription;
    startDate: string;
    drugResponse: string; // Assuming 'drugResponse' is also applicable here
    status: OvulationTriggerStatus;
}

// Reuse or adapt this dialog component
import PrescriptionItemFormDialog from './PrescriptionItemFormDialog';

interface OvulationTriggerInjectionCardProps {
    patientId: string;
}

const OvulationTriggerInjectionCard: React.FC<OvulationTriggerInjectionCardProps> = ({ patientId }) => {
    const [ovulationTriggerData, setOvulationTriggerData] = useState<OvulationTriggerInjectionData>(() => ({
        prescription: { dateIssued: new Date().toISOString().split('T')[0], notes: '', items: [] },
        startDate: new Date().toISOString().split('T')[0],
        drugResponse: '', // Default value
        status: 'IN_PROGRESS'
    }));

    const [isOvulationTriggerDialogOpen, setIsOvulationTriggerDialogOpen] = useState(false);
    const [isLoadingOvulationTrigger, setIsLoadingOvulationTrigger] = useState(false);
    const [errorOvulationTrigger, setErrorOvulationTrigger] = useState<string | null>(null);

    const [isSavingOvulationTrigger, setIsSavingOvulationTrigger] = useState(false);
    const [saveErrorOvulationTrigger, setSaveErrorOvulationTrigger] = useState<string | null>(null);
    const [saveSuccessOvulationTrigger, setSaveSuccessOvulationTrigger] = useState(false);

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

    // Fetch ovulation trigger injection data when patientId or medicationList changes
    useEffect(() => {
        const fetchOvulationTriggerData = async () => {
            if (!patientId || medicationList.length === 0) return;

            setIsLoadingOvulationTrigger(true);
            setErrorOvulationTrigger(null);
            try {
                // Cast the fetched data to OvulationTriggerInjectionData
                const data = (await getOvulationTriggerInjectionProcess(patientId)) as OvulationTriggerInjectionData;

                console.log("Fetched ovulation trigger injection data:", data); // For debugging
                if (data) {
                    const validStatuses: OvulationTriggerStatus[] = ['IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
                    const validatedStatus: OvulationTriggerStatus = validStatuses.includes(data.status)
                        ? data.status
                        : 'IN_PROGRESS';

                    const itemsWithDrugNames = data.prescription.items.map((item) => ({
                        ...item,
                        drugName: medicationList.find(med => med.id === item.medicationId)?.name || 'Thuốc không xác định'
                    }));
                    setOvulationTriggerData({
                        ...data,
                        status: validatedStatus,
                        prescription: {
                            ...data.prescription,
                            items: itemsWithDrugNames
                        }
                    });
                } else {
                    setOvulationTriggerData(() => ({
                        prescription: { dateIssued: new Date().toISOString().split('T')[0], notes: '', items: [] },
                        startDate: new Date().toISOString().split('T')[0],
                        drugResponse: '',
                        status: 'IN_PROGRESS'
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch ovulation trigger injection process:", error);
                setErrorOvulationTrigger("Không thể tải dữ liệu tiêm kích trứng.");
                setOvulationTriggerData(() => ({
                    prescription: { dateIssued: new Date().toISOString().split('T')[0], notes: '', items: [] },
                    startDate: new Date().toISOString().split('T')[0],
                    drugResponse: '',
                    status: 'IN_PROGRESS'
                }));
            } finally {
                setIsLoadingOvulationTrigger(false);
            }
        };

        fetchOvulationTriggerData();
    }, [patientId, medicationList]);

    const handleOvulationTriggerChange = (field: string, value, subField?: string) => {
        setOvulationTriggerData(prev => {
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
        setOvulationTriggerData(prev => {
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

        setOvulationTriggerData(prev => {
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

    const handleSaveOvulationTrigger = useCallback(async () => {
        if (!patientId) {
            setSaveErrorOvulationTrigger("Dữ liệu bệnh nhân không hợp lệ để lưu.");
            return;
        }

        setIsSavingOvulationTrigger(true);
        setSaveErrorOvulationTrigger(null);
        setSaveSuccessOvulationTrigger(false);

        try {
            const dataToSend = {
                ...ovulationTriggerData,
                prescription: {
                    ...ovulationTriggerData.prescription,
                    items: ovulationTriggerData.prescription.items.map(({ drugName, ...rest }) => rest)
                }
            };
            await updateOvulationTriggerInjectionProcess(patientId, dataToSend);
            setSaveSuccessOvulationTrigger(true);
            setTimeout(() => {
                setSaveSuccessOvulationTrigger(false);
                setIsOvulationTriggerDialogOpen(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to save ovulation trigger injection process:", error);
            setSaveErrorOvulationTrigger(error.response?.data?.message || "Đã xảy ra lỗi khi lưu.");
        } finally {
            setIsSavingOvulationTrigger(false);
        }
    }, [patientId, ovulationTriggerData]);

    const handleCompleteOvulationTrigger = useCallback(async () => {
        if (!patientId) {
            setErrorOvulationTrigger("Dữ liệu bệnh nhân không hợp lệ để hoàn thành.");
            return;
        }
        setIsCompleting(true);
        setErrorOvulationTrigger(null);
        try {
            await completeOvulationTriggerInjectionProcess(patientId);
            setOvulationTriggerData(prev => ({ ...prev, status: 'COMPLETED' }));
            alert("Phác đồ đã được đánh dấu là HOÀN THÀNH.");
            setIsOvulationTriggerDialogOpen(false);
        } catch (error) {
            console.error("Failed to complete ovulation trigger injection process:", error);
            setErrorOvulationTrigger(error.response?.data?.message || "Không thể hoàn thành tiêm kích trứng.");
        } finally {
            setIsCompleting(false);
        }
    }, [patientId]);

    const handleCancelOvulationTrigger = useCallback(async () => {
        if (!patientId) {
            setErrorOvulationTrigger("Dữ liệu bệnh nhân không hợp lệ để hủy.");
            return;
        }
        setIsCancelling(true);
        setErrorOvulationTrigger(null);
        try {
            await cancelOvulationTriggerInjectionProcess(patientId);
            setOvulationTriggerData(prev => ({ ...prev, status: 'CANCELLED' }));
            alert("Phác đồ đã được đánh dấu là ĐÃ HỦY.");
            setIsOvulationTriggerDialogOpen(false);
        } catch (error) {
            console.error("Failed to cancel ovulation trigger injection process:", error);
            setErrorOvulationTrigger(error.response?.data?.message || "Không thể hủy tiêm kích trứng.");
        } finally {
            setIsCancelling(false);
        }
    }, [patientId]);

    const renderValue = (value) => value || 'N/A';

    const isEditable = ovulationTriggerData.status === 'IN_PROGRESS';
    const isOperationInProgress = isSavingOvulationTrigger || isCompleting || isCancelling;

    const renderStatusInVietnamese = (status: OvulationTriggerStatus) => {
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
                Tiêm kích trứng
                <Button variant="outline" size="sm" onClick={() => setIsOvulationTriggerDialogOpen(true)} className="ml-2" disabled={isOperationInProgress}>
                    <Edit className="w-4 h-4 mr-2" /> {ovulationTriggerData.prescription.items.length > 0 || ovulationTriggerData.startDate ? 'Chỉnh sửa' : 'Nhập liệu'}
                </Button>
            </h3>

            {isLoadingOvulationTrigger && (
                <div className="text-center text-[color:var(--text-secondary)] py-4">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-[color:var(--deep-taupe)] mb-2" />
                    Đang tải dữ liệu tiêm kích trứng...
                </div>
            )}

            {errorOvulationTrigger && !isLoadingOvulationTrigger && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 text-center rounded-lg mb-4">
                    Lỗi: {errorOvulationTrigger}
                </div>
            )}

            {!isLoadingOvulationTrigger && !errorOvulationTrigger && (
                <>
                    {(!ovulationTriggerData.prescription.items.length && !ovulationTriggerData.startDate && !ovulationTriggerData.drugResponse && ovulationTriggerData.status === 'IN_PROGRESS') ? (
                        <p className="text-center text-[color:var(--text-secondary)] mb-4">Chưa có dữ liệu tiêm kích trứng.</p>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Ngày bắt đầu</Label>
                                    <p className="font-medium">{renderValue(formatDate(ovulationTriggerData.startDate))}</p>
                                </div>
                                <div>
                                    <Label>Đáp ứng thuốc</Label>
                                    <p className="font-medium">{renderValue(ovulationTriggerData.drugResponse)}</p>
                                </div>
                                <div>
                                    <Label>Trạng thái</Label>
                                    <p className="font-medium">{renderStatusInVietnamese(ovulationTriggerData.status)}</p>
                                </div>
                            </div>

                            {ovulationTriggerData.prescription && (
                                <div className="mt-4 border-t pt-4">
                                    <h4 className="text-md font-semibold mb-2">Đơn thuốc</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <Label>Ngày cấp</Label>
                                            <p className="font-medium">{renderValue(formatDate(ovulationTriggerData.prescription.dateIssued))}</p>
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                            <Label>Ghi chú</Label>
                                            <p className="font-medium">{renderValue(ovulationTriggerData.prescription.notes)}</p>
                                        </div>
                                    </div>

                                    {ovulationTriggerData.prescription.items.length > 0 ? (
                                        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                            <Label>Các mục thuốc đã kê</Label>
                                            {ovulationTriggerData.prescription.items.map((item, index) => (
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

            <Dialog open={isOvulationTriggerDialogOpen} onOpenChange={setIsOvulationTriggerDialogOpen}>
                <DialogContent className="sm:max-w-[700px] p-6 max-h-[90vh] overflow-y-auto"> {/* Added max-h and overflow for scroll */}
                    <DialogHeader>
                        <DialogTitle>{isEditable ? 'Chỉnh sửa' : 'Xem'} Tiêm kích trứng</DialogTitle>
                        <DialogDescription>
                            {isEditable ? "Cập nhật thông tin và đơn thuốc cho quá trình tiêm kích trứng." : "Quá trình đã hoàn thành hoặc bị hủy, không thể chỉnh sửa."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Ngày bắt đầu</Label>
                            <Input
                                type="date"
                                value={ovulationTriggerData.startDate || ''}
                                onChange={(e) => handleOvulationTriggerChange('startDate', e.target.value)}
                                disabled={!isEditable || isSavingOvulationTrigger}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Đáp ứng thuốc</Label>
                            <Select
                                value={ovulationTriggerData.drugResponse || ''}
                                onValueChange={(value) => handleOvulationTriggerChange('drugResponse', value)}
                                disabled={!isEditable || isSavingOvulationTrigger}
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
                        <div className="col-span-2 flex items-center gap-2">
                            <Label>Trạng thái quá trình:</Label>
                             <p className="font-medium text-sm text-[color:#6C9BCF]">
                                {renderStatusInVietnamese(ovulationTriggerData.status)}
                            </p>
                        </div>

                        <div className="col-span-1 md:col-span-2 border-t pt-4 mt-4">
                            <h4 className="text-md font-semibold mb-2">Thông tin đơn thuốc</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Ngày cấp đơn</Label>
                                    <Input
                                        type="date"
                                        value={ovulationTriggerData.prescription.dateIssued || ''}
                                        onChange={(e) => handleOvulationTriggerChange('prescription', e.target.value, 'dateIssued')}
                                        disabled={!isEditable || isSavingOvulationTrigger}
                                    />
                                </div>
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <Label>Ghi chú đơn thuốc</Label>
                                    <Textarea
                                        placeholder="Ghi chú về đơn thuốc..."
                                        value={ovulationTriggerData.prescription.notes || ''}
                                        onChange={(e) => handleOvulationTriggerChange('prescription', e.target.value, 'notes')}
                                        disabled={!isEditable || isSavingOvulationTrigger}
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <Label>Các mục thuốc trong đơn</Label>
                                    <Button variant="outline" size="sm" onClick={handleAddItem} disabled={!isEditable || isSavingOvulationTrigger}>
                                        <Plus className="w-4 h-4 mr-2" /> Thêm thuốc
                                    </Button>
                                </div>
                                {ovulationTriggerData.prescription.items.length === 0 ? (
                                    <p className="text-sm text-[color:var(--text-secondary)]">Chưa có mục thuốc nào được thêm.</p>
                                ) : (
                                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                        {ovulationTriggerData.prescription.items.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                                                <span className="font-medium">{item.drugName} - {item.dosage}</span>
                                                <div className="flex space-x-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleEditItem(item, index)} disabled={!isEditable || isSavingOvulationTrigger}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="text-red-600 hover:text-red-800" onClick={() => handleDeleteItem(index)} disabled={!isEditable || isSavingOvulationTrigger}>
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
                        {saveErrorOvulationTrigger && <p className="text-red-500 text-sm mr-2">{saveErrorOvulationTrigger}</p>}
                        {saveSuccessOvulationTrigger && <p className="text-green-500 text-sm mr-2">Lưu thành công!</p>}

                        {ovulationTriggerData.status === 'IN_PROGRESS' && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleCancelOvulationTrigger}
                                    disabled={isOperationInProgress}
                                    className="text-orange-600 hover:text-orange-800"
                                >
                                      {isCancelling ? 'Đang hủy...' : 'Hủy quá trình'}
                                </Button>
                                <Button
                                    onClick={handleCompleteOvulationTrigger}
                                    disabled={isOperationInProgress}
                                    className="bg-[#6C9BCF] hover:bg-[#4F7AA3] text-white"
                                >
                                      {isCompleting ? 'Đang hoàn thành...' : 'Hoàn thành quá trình'}
                                </Button>
                            </>
                        )}
                        {isEditable && (
                            <Button onClick={handleSaveOvulationTrigger} disabled={isSavingOvulationTrigger}>
                                <Save className="w-4 h-4 mr-2" /> {isSavingOvulationTrigger ? 'Đang lưu...' : 'Lưu'}
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
                isSaving={isSavingOvulationTrigger}
                // If you want the PrescriptionItemFormDialog inputs to be disabled when the parent form is not editable:
                // isParentFormEditable={isEditable}
            />
        </Card>
    );
};

export default OvulationTriggerInjectionCard;