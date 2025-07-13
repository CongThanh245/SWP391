// components/InterventionWife/FollicularMonitoringCard.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Card } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import { Loader2, Edit, Save, X, Plus, History } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@components/ui/dialog';
import { formatDate } from '@utils/format';

// Import all clarified API functions
import {
    getFollicularMonitoringUltrasound,
    createFollicularMonitoringUltrasound,
    updateFollicularMonitoringUltrasound,
    nextFollicularMonitoringUltrasound,
    hasInProgressUltrasound,
} from '@api/doctorInterventionApi';

// Interfaces (for consistency, define them here if not in a shared types file)
interface FollicularMonitoringData {
    id?: string;
    actionDate: string;
    follicleCount: number;
    follicleSize: number;
    endometrialThickness: number;
    status: string;
}

// Adjusted payload types for API calls
type CreateFollicularMonitoringPayload = Omit<FollicularMonitoringData, 'id' | 'status'>;
type UpdateFollicularMonitoringPayload = Omit<FollicularMonitoringData, 'id' | 'status'>;

interface FollicularMonitoringCardProps {
    patientId: string;
}

const FollicularMonitoringCard: React.FC<FollicularMonitoringCardProps> = ({ patientId }) => {
    const [allFollicularMonitoringRecords, setAllFollicularMonitoringRecords] = useState<FollicularMonitoringData[] | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [errorData, setErrorData] = useState<string | null>(null);

    const [hasInProgress, setHasInProgress] = useState<boolean>(false);
    const [isLoadingInProgressStatus, setIsLoadingInProgressStatus] = useState(true);
    const [errorInProgressStatus, setErrorInProgressStatus] = useState<string | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // true if editing, false if creating new

    const [formData, setFormData] = useState<Partial<FollicularMonitoringData>>({
        actionDate: new Date().toISOString().split('T')[0],
        follicleCount: 0,
        follicleSize: 0.0,
        endometrialThickness: 0.0,
    });

    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);


    const isLoadingSavingOrStatus = useMemo(() => {
        return isLoadingData || isLoadingInProgressStatus || isSaving;
    }, [isLoadingData, isLoadingInProgressStatus, isSaving]);
    // Derived state: The current 'in-progress' record
    const currentInProgressRecord = useMemo(() => {
        if (!allFollicularMonitoringRecords) return null;
        return allFollicularMonitoringRecords.find(record => record.status === 'IN_PROGRESS') || null;
    }, [allFollicularMonitoringRecords]);

    // Fetches the in-progress status from the dedicated API
    const fetchInProgressStatus = useCallback(async () => {
        if (!patientId) return;
        setIsLoadingInProgressStatus(true);
        setErrorInProgressStatus(null);
        try {
            const status = await hasInProgressUltrasound(patientId);
            setHasInProgress(status);
        } catch (error) {
            console.error("Failed to check in-progress status:", error);
            setErrorInProgressStatus(error.message || "Không thể kiểm tra trạng thái đang tiến hành.");
        } finally {
            setIsLoadingInProgressStatus(false);
        }
    }, [patientId]);

    // Fetches all follicular monitoring records
    const fetchAllFollicularMonitoringData = useCallback(async () => {
        if (!patientId) return;
        setIsLoadingData(true);
        setErrorData(null);
        try {
            const data = await getFollicularMonitoringUltrasound(patientId);
            setAllFollicularMonitoringRecords(data);
            // After fetching, try to pre-fill formData for editing if an in-progress record exists
            if (data) {
                const inProgress = data.find(record => record.status === 'IN_PROGRESS');
                if (inProgress) {
                    setFormData({
                        actionDate: inProgress.actionDate,
                        follicleCount: inProgress.follicleCount,
                        follicleSize: inProgress.follicleSize,
                        endometrialThickness: inProgress.endometrialThickness,
                    });
                } else {
                    // If no in-progress, reset formData to default for new creation
                    setFormData({
                        actionDate: new Date().toISOString().split('T')[0],
                        follicleCount: 0,
                        follicleSize: 0.0,
                        endometrialThickness: 0.0,
                    });
                }
            } else {
                // If no records at all, reset formData
                setFormData({
                    actionDate: new Date().toISOString().split('T')[0],
                    follicleCount: 0,
                    follicleSize: 0.0,
                    endometrialThickness: 0.0,
                });
            }
        } catch (error) {
            console.error("Failed to fetch all follicular monitoring data:", error);
            setErrorData(error.message || "Không thể tải dữ liệu siêu âm nang noãn.");
            setAllFollicularMonitoringRecords(null);
        } finally {
            setIsLoadingData(false);
        }
    }, [patientId]);

    // Initial data fetch and status check
    useEffect(() => {
        fetchAllFollicularMonitoringData();
        fetchInProgressStatus();
    }, [fetchAllFollicularMonitoringData, fetchInProgressStatus]);

    // Handles opening the dialog for editing an existing record
    const handleEdit = () => {
        if (currentInProgressRecord) {
            setIsEditing(true);
            setFormData({
                actionDate: currentInProgressRecord.actionDate,
                follicleCount: currentInProgressRecord.follicleCount,
                follicleSize: currentInProgressRecord.follicleSize,
                endometrialThickness: currentInProgressRecord.endometrialThickness,
            });
            setIsDialogOpen(true);
        } else {
            alert("Không có bản ghi đang tiến hành để chỉnh sửa. Vui lòng tạo bản ghi mới.");
            handleCreateNew(); // Suggest creating a new one
        }
    };

    // Handles opening the dialog for creating a new record
    const handleCreateNew = () => {
        setIsEditing(false); // Mode is 'create new'
        setFormData({ // Reset form to defaults for a fresh record
            actionDate: new Date().toISOString().split('T')[0],
            follicleCount: 0,
            follicleSize: 0.0,
            endometrialThickness: 0.0,
        });
        setIsDialogOpen(true);
    };

    // Handles the "Mark as Completed & Next Session" action
    const handleNextSession = useCallback(async () => {
        if (!patientId) {
            alert("Không có ID bệnh nhân để tiến hành phiên tiếp theo.");
            return;
        }
        if (!currentInProgressRecord) {
            alert("Không có bản ghi đang tiến hành để hoàn thành và tạo phiên tiếp theo.");
            return;
        }

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            await nextFollicularMonitoringUltrasound(patientId);
            setSaveSuccess(true);
            await fetchAllFollicularMonitoringData(); // Re-fetch to get updated list and new in-progress record
            await fetchInProgressStatus(); // Update in-progress status
            setTimeout(() => {
                setSaveSuccess(false);
            }, 1500);
        } catch (error) {
            console.error("Failed to mark as completed and start next session:", error);
            setSaveError(error.message || "Đã xảy ra lỗi khi chuyển sang phiên tiếp theo.");
        } finally {
            setIsSaving(false);
        }
    }, [patientId, currentInProgressRecord, fetchAllFollicularMonitoringData, fetchInProgressStatus]);


    // Handles changes in the dialog form
    const handleFormChange = (field: keyof FollicularMonitoringData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    // Handles saving (either creating or updating) a record
    const handleSave = useCallback(async () => {
        if (!patientId) {
            setSaveError("Không có ID bệnh nhân.");
            return;
        }

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            const payload: CreateFollicularMonitoringPayload = { // Use payload type
                actionDate: formData.actionDate || '', // Ensure no undefined
                follicleCount: formData.follicleCount ?? 0,
                follicleSize: formData.follicleSize ?? 0.0,
                endometrialThickness: formData.endometrialThickness ?? 0.0,
            };

            if (isEditing) {
                // Update existing in-progress record
                await updateFollicularMonitoringUltrasound(patientId, payload);
            } else {
                // Create a new record
                await createFollicularMonitoringUltrasound(patientId, payload);
            }
            setSaveSuccess(true);
            await fetchAllFollicularMonitoringData(); // Re-fetch all data to show updates
            await fetchInProgressStatus(); // Update the in-progress status
            setTimeout(() => {
                setSaveSuccess(false);
                setIsDialogOpen(false);
            }, 1500);
        } catch (error) {
            console.error("Failed to save follicular monitoring data:", error);
            setSaveError(error.message || "Đã xảy ra lỗi khi lưu.");
        } finally {
            setIsSaving(false);
        }
    }, [patientId, formData, isEditing, fetchAllFollicularMonitoringData, fetchInProgressStatus]);

    const renderValue = (value) => (value !== null && value !== undefined && value !== '') ? value : 'N/A';

    return (
        <Card className="p-6 bg-white border border-[color:var(--card-border)]">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-between text-[color:var(--text-accent)]">
                Siêu âm theo dõi nang noãn
                <div className="flex space-x-2">
                    {/* Only show 'Edit' if there's an in-progress record */}
                    {!isLoadingInProgressStatus && hasInProgress && (
                        <Button variant="outline" size="sm" onClick={handleEdit} disabled={isLoadingSavingOrStatus}>
                            <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa bản ghi hiện tại
                        </Button>
                    )}
                    {/* Only show 'Create New' if there's NO in-progress record, or if we don't know the status yet */}
                    {!isLoadingInProgressStatus && !hasInProgress && (
                        <Button variant="outline" size="sm" onClick={handleCreateNew} disabled={isLoadingSavingOrStatus}>
                            <Plus className="w-4 h-4 mr-2" /> Tạo bản ghi mới
                        </Button>
                    )}
                    {/* "Mark as Completed & Next Session" button - only if there's an in-progress record */}
                    {!isLoadingInProgressStatus && hasInProgress && (
                        <Button variant="outline" size="sm" onClick={handleNextSession} disabled={isLoadingSavingOrStatus}>
                            <Plus className="w-4 h-4 mr-2" /> Hoàn thành & Phiên tiếp theo
                        </Button>
                    )}
                    {/* "History" button - only if there's more than one record */}
                    {!isLoadingData && allFollicularMonitoringRecords && allFollicularMonitoringRecords.length > 0 && (
                        <Button variant="outline" size="sm" onClick={() => alert("Chức năng xem lịch sử sẽ hiển thị tất cả các bản ghi ở đây.")} disabled={isLoadingSavingOrStatus}>
                            <History className="w-4 h-4 mr-2" /> Lịch sử ({allFollicularMonitoringRecords.length})
                        </Button>
                    )}
                </div>
            </h3>

            {(isLoadingData || isLoadingInProgressStatus) && (
                <div className="text-center text-[color:var(--text-secondary)] py-4">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-[color:var(--deep-taupe)] mb-2" />
                    Đang tải dữ liệu siêu âm...
                </div>
            )}

            {(errorData || errorInProgressStatus) && !(isLoadingData || isLoadingInProgressStatus) && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 text-center rounded-lg mb-4">
                    Lỗi: {errorData || errorInProgressStatus}
                </div>
            )}

            {!(isLoadingData || isLoadingInProgressStatus) && !errorData && !errorInProgressStatus && (
                <>
                    {!currentInProgressRecord ? (
                        <p className="text-center text-[color:var(--text-secondary)] mb-4">
                            {!hasInProgress && "Chưa có bản ghi siêu âm nang noãn đang tiến hành."}
                            {hasInProgress && "Không thể tải bản ghi đang tiến hành. Vui lòng kiểm tra lại dữ liệu."}
                        </p>
                    ) : (
                        <div className="space-y-3 text-[color:var(--text-primary)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-[color:var(--text-secondary)]">Ngày thực hiện</Label>
                                    <p className="font-medium text-lg">{renderValue(formatDate(currentInProgressRecord.actionDate))}</p>
                                </div>
                                <div>
                                    <Label className="text-[color:var(--text-secondary)]">Số lượng nang noãn</Label>
                                    <p className="font-medium text-lg">{renderValue(currentInProgressRecord.follicleCount)}</p>
                                </div>
                                <div>
                                    <Label className="text-[color:var(--text-secondary)]">Kích thước nang noãn (mm)</Label>
                                    <p className="font-medium text-lg">{renderValue(currentInProgressRecord.follicleSize)}</p>
                                </div>
                                <div>
                                    <Label className="text-[color:var(--text-secondary)]">Độ dày nội mạc tử cung (mm)</Label>
                                    <p className="font-medium text-lg">{renderValue(currentInProgressRecord.endometrialThickness)}</p>
                                </div>
                                <div className="col-span-full">
                                    <Label className="text-[color:var(--text-secondary)]">Trạng thái</Label>
                                    <p className="font-medium text-lg">{renderValue(currentInProgressRecord.status)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Optional: Display all records for debugging or a simple history view */}
                    {allFollicularMonitoringRecords && allFollicularMonitoringRecords.length > 0 && (
                        <div className="mt-8 border-t pt-4">
                            <h4 className="text-md font-semibold mb-2 text-[color:var(--text-accent)]">Tất cả các bản ghi (Lịch sử)</h4>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                {allFollicularMonitoringRecords.map((record, index) => (
                                    <Card key={record.id || index} className={`p-3 border rounded-md ${record.status === 'IN_PROGRESS' ? 'border-blue-500 bg-blue-50' : 'bg-gray-50'}`}>
                                        <p className="font-semibold">{formatDate(record.actionDate)} - Status: {record.status}</p>
                                        <p className="text-sm text-[color:var(--text-secondary)]">
                                            Nang: {record.follicleCount} | Kích thước: {record.follicleSize}mm | Nội mạc: {record.endometrialThickness}mm
                                        </p>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Dialog chỉnh sửa/tạo mới */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] p-6">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Chỉnh sửa' : 'Tạo mới'} Bản ghi siêu âm</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="actionDate">Ngày thực hiện</Label>
                            <Input
                                id="actionDate"
                                type="date"
                                value={formData.actionDate || ''}
                                onChange={(e) => handleFormChange('actionDate', e.target.value)}
                                disabled={isSaving}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="follicleCount">Số lượng nang noãn</Label>
                            <Input
                                id="follicleCount"
                                type="number"
                                value={formData.follicleCount ?? ''}
                                onChange={(e) => handleFormChange('follicleCount', parseInt(e.target.value) || 0)}
                                disabled={isSaving}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="follicleSize">Kích thước nang noãn (mm)</Label>
                            <Input
                                id="follicleSize"
                                type="number"
                                step="0.1"
                                value={formData.follicleSize ?? ''}
                                onChange={(e) => handleFormChange('follicleSize', parseFloat(e.target.value) || 0.0)}
                                disabled={isSaving}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endometrialThickness">Độ dày nội mạc tử cung (mm)</Label>
                            <Input
                                id="endometrialThickness"
                                type="number"
                                step="0.1"
                                value={formData.endometrialThickness ?? ''}
                                onChange={(e) => handleFormChange('endometrialThickness', parseFloat(e.target.value) || 0.0)}
                                disabled={isSaving}
                            />
                        </div>
                        {isEditing && currentInProgressRecord?.status && (
                            <div className="space-y-2">
                                <Label>Trạng thái hiện tại</Label>
                                <Input value={currentInProgressRecord.status} disabled className="bg-gray-100" />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        {isSaving && <Loader2 className="h-5 w-5 animate-spin mr-2 text-[color:var(--deep-taupe)]" />}
                        {saveError && <p className="text-red-500 text-sm mr-2">{saveError}</p>}
                        {saveSuccess && <p className="text-green-500 text-sm mr-2">Lưu thành công!</p>}
                        <Button onClick={handleSave} disabled={isSaving}>
                            <Save className="w-4 h-4 mr-2" /> Lưu
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default FollicularMonitoringCard;