// components/InterventionWife/OvarianStimulationProtocolCard.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { Card } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Plus, Loader2, Edit, Save, X, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@components/ui/dialog';
import { formatDate } from '@utils/format';
import { getMedicationList, getOvarianStimulationProcess, updateOvarianStimulationProcess } from '@api/doctorInterventionApi';

// Re-declare interfaces or import them from a shared types file
interface Medication { id: string; name: string; }
interface PrescriptionItem { medicationId: string; drugName?: string; dosage: string; frequency: string; duration: string; quantity: number; }
interface Prescription { dateIssued: string; notes: string; items: PrescriptionItem[]; }
interface OvarianStimulationData { prescription: Prescription; startDate: string; drugResponse: string; }

// New component for the Prescription Item Dialog
import PrescriptionItemFormDialog from './PrescriptionItemFormDialog'; // Create this file

interface OvarianStimulationProtocolCardProps {
    patientId: string;
}

const OvarianStimulationProtocolCard: React.FC<OvarianStimulationProtocolCardProps> = ({ patientId }) => {
    // 1. Initialize ovarianStimulationData with a default value using a function
    const [ovarianStimulationData, setOvarianStimulationData] = useState<OvarianStimulationData>(() => ({
        prescription: { dateIssued: new Date().toISOString().split('T')[0], notes: '', items: [] },
        startDate: new Date().toISOString().split('T')[0],
        drugResponse: '',
    }));

    const [isOvarianStimulationDialogOpen, setIsOvarianStimulationDialogOpen] = useState(false);
    const [isLoadingOvarianStimulation, setIsLoadingOvarianStimulation] = useState(false);
    const [errorOvarianStimulation, setErrorOvarianStimulation] = useState<string | null>(null);
    const [isSavingOvarianStimulation, setIsSavingOvarianStimulation] = useState(false);
    const [saveErrorOvarianStimulation, setSaveErrorOvarianStimulation] = useState<string | null>(null);
    const [saveSuccessOvarianStimulation, setSaveSuccessOvarianStimulation] = useState(false);

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
    }, []); // Empty dependency array means this runs once on mount

    // Fetch ovarian stimulation data when patientId or medicationList changes
    useEffect(() => {
        const fetchOvarianStimulationData = async () => {
            if (!patientId || medicationList.length === 0) return; // Ensure patientId and medicationList are ready

            setIsLoadingOvarianStimulation(true);
            setErrorOvarianStimulation(null);
            try {
                const data = await getOvarianStimulationProcess(patientId);
                console.log("Fetched ovarian stimulation data:", data); // For debugging
                if (data) {
                    const itemsWithDrugNames = data.prescription.items.map((item) => ({
                        ...item,
                        drugName: medicationList.find(med => med.id === item.medicationId)?.name || 'Thuốc không xác định'
                    }));
                    setOvarianStimulationData({
                        ...data,
                        prescription: {
                            ...data.prescription,
                            items: itemsWithDrugNames
                        }
                    });
                } else {
                    // 2. IMPORTANT: If no data is found, and ovarianStimulationData is already
                    // the default empty object, do not set state again with a new object.
                    // Only reset to the default if it was previously populated with data
                    // and now no data is found for the patient (e.g., patient changed).
                    // Since we initialize `ovarianStimulationData` to a default,
                    // we can often remove this else block, or ensure it only resets
                    // if the *current* `ovarianStimulationData` is NOT the default already.
                    // For now, removing it is the simplest fix if the goal is to always
                    // show an empty form when no data is fetched.
                    // If you *must* explicitly set it to the default, ensure it's a stable object.
                    // For example, if you set it to a new object, it will cause a re-render.
                    // Given the useState initialization, this `else` block can likely be removed.
                }
            } catch (error) {
                console.error("Failed to fetch ovarian stimulation process:", error);
                setErrorOvarianStimulation("Không thể tải dữ liệu phác đồ kích thích buồng trứng.");
                // Optionally, reset to default on error if desired, but ensure it doesn't cause a loop
                // setOvarianStimulationData(initialDefaultOvarianStimulationData); // if you define this outside
            } finally {
                setIsLoadingOvarianStimulation(false);
            }
        };

        fetchOvarianStimulationData();
    }, [patientId, medicationList]); // Re-run if patientId or medicationList changes

    const handleOvarianStimulationChange = (field: string, value, subField?: string) => {
        setOvarianStimulationData(prev => {
            // prev is guaranteed to be a valid OvarianStimulationData object now due to useState initialization
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
            return prev; // Should not happen with valid field/subField combinations
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
        setOvarianStimulationData(prev => {
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

        setOvarianStimulationData(prev => {
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

    const handleSaveOvarianStimulation = useCallback(async () => {
        // ovarianStimulationData is guaranteed to be non-null now
        if (!patientId) {
            setSaveErrorOvarianStimulation("Dữ liệu bệnh nhân không hợp lệ để lưu.");
            return;
        }

        setIsSavingOvarianStimulation(true);
        setSaveErrorOvarianStimulation(null);
        setSaveSuccessOvarianStimulation(false);

        try {
            const dataToSend = {
                ...ovarianStimulationData,
                prescription: {
                    ...ovarianStimulationData.prescription,
                    items: ovarianStimulationData.prescription.items.map(({ drugName, ...rest }) => rest)
                }
            };
            await updateOvarianStimulationProcess(patientId, dataToSend);
            setSaveSuccessOvarianStimulation(true);
            setTimeout(() => {
                setSaveSuccessOvarianStimulation(false);
                setIsOvarianStimulationDialogOpen(false);
            }, 2000);
        } catch (error) { // Explicitly type error to access response
            console.error("Failed to save ovarian stimulation process:", error);
            setSaveErrorOvarianStimulation(error.response?.data?.message || "Đã xảy ra lỗi khi lưu.");
        } finally {
            setIsSavingOvarianStimulation(false);
        }
    }, [patientId, ovarianStimulationData]); // Dependencies for useCallback

    const renderValue = (value) => value || 'N/A';

    return (
        <Card className="p-6 bg-white border border-[color:var(--card-border)]">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-between text-[color:var(--text-accent)]">
                Phác đồ kích thích buồng trứng / Tiêm kích trứng
                <Button variant="outline" size="sm" onClick={() => setIsOvarianStimulationDialogOpen(true)} className="ml-2">
                    <Edit className="w-4 h-4 mr-2" /> {ovarianStimulationData.prescription.items.length > 0 || ovarianStimulationData.startDate ? 'Chỉnh sửa' : 'Nhập liệu'}
                </Button>
            </h3>

            {isLoadingOvarianStimulation && (
                <div className="text-center text-[color:var(--text-secondary)] py-4">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-[color:var(--deep-taupe)] mb-2" />
                    Đang tải dữ liệu phác đồ...
                </div>
            )}

            {errorOvarianStimulation && !isLoadingOvarianStimulation && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 text-center rounded-lg mb-4">
                    Lỗi: {errorOvarianStimulation}
                </div>
            )}

            {!isLoadingOvarianStimulation && !errorOvarianStimulation && (
                <>
                    {/* Check for data presence more robustly now that it's never null */}
                    {(!ovarianStimulationData.prescription.items.length && !ovarianStimulationData.startDate && !ovarianStimulationData.drugResponse) ? (
                        <p className="text-center text-[color:var(--text-secondary)] mb-4">Chưa có dữ liệu phác đồ kích thích buồng trứng.</p>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Ngày bắt đầu</Label>
                                    <p className="font-medium">{renderValue(formatDate(ovarianStimulationData.startDate))}</p>
                                </div>
                                <div>
                                    <Label>Đáp ứng thuốc</Label>
                                    <p className="font-medium">{renderValue(ovarianStimulationData.drugResponse)}</p>
                                </div>
                            </div>

                            {ovarianStimulationData.prescription && (
                                <div className="mt-4 border-t pt-4">
                                    <h4 className="text-md font-semibold mb-2">Đơn thuốc</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <Label>Ngày cấp</Label>
                                            <p className="font-medium">{renderValue(formatDate(ovarianStimulationData.prescription.dateIssued))}</p>
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                            <Label>Ghi chú</Label>
                                            <p className="font-medium">{renderValue(ovarianStimulationData.prescription.notes)}</p>
                                        </div>
                                    </div>

                                    {ovarianStimulationData.prescription.items.length > 0 ? (
                                        <div className="space-y-3">
                                            <Label>Các mục thuốc đã kê</Label>
                                            {ovarianStimulationData.prescription.items.map((item, index) => (
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

            <Dialog open={isOvarianStimulationDialogOpen} onOpenChange={setIsOvarianStimulationDialogOpen}>
                <DialogContent className="sm:max-w-[700px] p-6">
                    <DialogHeader>
                        <DialogTitle>{ovarianStimulationData.prescription.items.length > 0 || ovarianStimulationData.startDate ? 'Chỉnh sửa' : 'Nhập liệu'} Phác đồ kích thích buồng trứng</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Ngày bắt đầu</Label>
                            <Input
                                type="date"
                                value={ovarianStimulationData.startDate || ''} // Use || '' for controlled component
                                onChange={(e) => handleOvarianStimulationChange('startDate', e.target.value)}
                                disabled={isSavingOvarianStimulation}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Đáp ứng thuốc</Label>
                            <Select
                                value={ovarianStimulationData.drugResponse || ''} // Use || '' for controlled component
                                onValueChange={(value) => handleOvarianStimulationChange('drugResponse', value)}
                                disabled={isSavingOvarianStimulation}
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
                        <div className="col-span-1 md:col-span-2 border-t pt-4 mt-4">
                            <h4 className="text-md font-semibold mb-2">Thông tin đơn thuốc</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Ngày cấp đơn</Label>
                                    <Input
                                        type="date"
                                        value={ovarianStimulationData.prescription.dateIssued || ''} // Use || '' for controlled component
                                        onChange={(e) => handleOvarianStimulationChange('prescription', e.target.value, 'dateIssued')}
                                        disabled={isSavingOvarianStimulation}
                                    />
                                </div>
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <Label>Ghi chú đơn thuốc</Label>
                                    <Textarea
                                        placeholder="Ghi chú về đơn thuốc..."
                                        value={ovarianStimulationData.prescription.notes || ''} // Use || '' for controlled component
                                        onChange={(e) => handleOvarianStimulationChange('prescription', e.target.value, 'notes')}
                                        disabled={isSavingOvarianStimulation}
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <Label>Các mục thuốc trong đơn</Label>
                                    <Button variant="outline" size="sm" onClick={handleAddItem} disabled={isSavingOvarianStimulation}>
                                        <Plus className="w-4 h-4 mr-2" /> Thêm thuốc
                                    </Button>
                                </div>
                                {ovarianStimulationData.prescription.items.length === 0 ? (
                                    <p className="text-sm text-[color:var(--text-secondary)]">Chưa có mục thuốc nào được thêm.</p>
                                ) : (
                                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                                        {ovarianStimulationData.prescription.items.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                                                <span className="font-medium">{item.drugName} - {item.dosage}</span>
                                                <div className="flex space-x-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleEditItem(item, index)} disabled={isSavingOvarianStimulation}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="text-red-600 hover:text-red-800" onClick={() => handleDeleteItem(index)} disabled={isSavingOvarianStimulation}>
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
                    <DialogFooter>
                        {isSavingOvarianStimulation && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
                        {saveErrorOvarianStimulation && <p className="text-red-500 text-sm mr-2">{saveErrorOvarianStimulation}</p>}
                        {saveSuccessOvarianStimulation && <p className="text-green-500 text-sm mr-2">Lưu thành công!</p>}
                        <Button variant="outline" onClick={() => setIsOvarianStimulationDialogOpen(false)} disabled={isSavingOvarianStimulation}>
                            <X className="w-4 h-4 mr-2" /> Hủy
                        </Button>
                        <Button onClick={handleSaveOvarianStimulation} disabled={isSavingOvarianStimulation}>
                            <Save className="w-4 h-4 mr-2" /> Lưu
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Render the PrescriptionItemFormDialog separately */}
            <PrescriptionItemFormDialog
                isOpen={isPrescriptionItemDialogOpen}
                onClose={() => setIsPrescriptionItemDialogOpen(false)}
                itemToEdit={currentPrescriptionItem}
                medicationList={medicationList}
                onSave={handleSavePrescriptionItem}
                isSaving={isSavingOvarianStimulation} // Pass saving state to disable dialog inputs
            />
        </Card>
    );
};

export default OvarianStimulationProtocolCard;