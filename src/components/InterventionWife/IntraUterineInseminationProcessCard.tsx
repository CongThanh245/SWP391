// components/InterventionWife/IntraUterineInseminationProcessCard.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Card } from '@components/ui/card'; // Adjust path as needed
import { Input } from '@components/ui/input'; // Adjust path as needed
import { Button } from '@components/ui/button'; // Adjust path as needed
import { Label } from '@components/ui/label'; // Adjust path as needed
import { Loader2, Edit, Save, X, Play, CheckCircle, XCircle } from 'lucide-react'; // Added Play, CheckCircle, XCircle
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@components/ui/dialog'; // Adjust path as needed
import { formatDate } from '@utils/format'; // Adjust path as needed
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'; // Assuming you have a Select component

// Import new IUI Process API functions
import {
    getIntraUterineInseminationProcess,
    updateIntraUterineInseminationProcess,
    completeIntraUterineInseminationProcess,
    cancelIntraUterineInseminationProcess,
} from '@api/doctorInterventionApi'; // Adjust path as needed

// --- Interfaces ---
interface IntraUterineInseminationProcessData {
    status: string; // e.g., "IN_PROGRESS", "COMPLETED", "CANCELLED"
    actionDate: string; // Format: "YYYY-MM-DD"
}

interface IntraUterineInseminationProcessCardProps {
    patientId: string;
}

const IUI_STATUS_OPTIONS = [
    { value: 'IN_PROGRESS', label: 'Đang tiến hành' },
    { value: 'COMPLETED', label: 'Đã hoàn thành' },
    { value: 'CANCELLED', label: 'Đã hủy' },
    // Add other statuses if applicable from your backend
];

const IntraUterineInseminationProcessCard: React.FC<IntraUterineInseminationProcessCardProps> = ({ patientId }) => {
    const [currentProcessData, setCurrentProcessData] = useState<IntraUterineInseminationProcessData | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [errorData, setErrorData] = useState<string | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditingExisting, setIsEditingExisting] = useState(false); // true if editing, false if starting new

    const [formData, setFormData] = useState<Partial<IntraUterineInseminationProcessData>>({
        actionDate: new Date().toISOString().split('T')[0],
        status: 'IN_PROGRESS', // Default for new process
    });

    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Consolidate all loading/saving states for disabling buttons
    const isLoadingAnyOperation = useMemo(() => {
        return isLoadingData || isSaving;
    }, [isLoadingData, isSaving]);

    // Fetches the current IUI Process data
    const fetchIUIProcessData = useCallback(async () => {
        if (!patientId) return;
        setIsLoadingData(true);
        setErrorData(null);
        try {
            const data = await getIntraUterineInseminationProcess(patientId);
            setCurrentProcessData(data);
            // Pre-fill form data if an existing process is found
            if (data) {
                setFormData({
                    actionDate: data.actionDate,
                    status: data.status,
                });
            } else {
                // Reset form to defaults for starting a new process
                setFormData({
                    actionDate: new Date().toISOString().split('T')[0],
                    status: 'IN_PROGRESS',
                });
            }
        } catch (error) {
            console.error("Failed to fetch Intra-Uterine Insemination Process data:", error);
            setErrorData(error.message || "Không thể tải dữ liệu quy trình Thụ tinh trong tử cung.");
            setCurrentProcessData(null);
        } finally {
            setIsLoadingData(false);
        }
    }, [patientId]);

    // Initial data fetch on component mount
    useEffect(() => {
        fetchIUIProcessData();
    }, [fetchIUIProcessData]);

    // Handles opening the dialog for editing an existing process
    const handleEditProcess = () => {
        if (currentProcessData) {
            setIsEditingExisting(true);
            setFormData({
                actionDate: currentProcessData.actionDate,
                status: currentProcessData.status,
            });
            setIsDialogOpen(true);
        } else {
            alert("Không có quy trình IUI đang hoạt động để chỉnh sửa. Vui lòng bắt đầu một quy trình mới.");
            handleStartNewProcess(); // Suggest starting a new one
        }
    };

    // Handles opening the dialog for starting a new process
    const handleStartNewProcess = () => {
        setIsEditingExisting(false); // Mode is 'start new'
        setFormData({ // Reset form to defaults for a fresh start
            actionDate: new Date().toISOString().split('T')[0],
            status: 'IN_PROGRESS', // New process typically starts as IN_PROGRESS
        });
        setIsDialogOpen(true);
    };

    // Handles the "Complete Process" action
    const handleCompleteProcess = useCallback(async () => {
        if (!patientId || !currentProcessData || currentProcessData.status !== 'IN_PROGRESS') {
            alert("Không có quy trình IUI đang tiến hành để hoàn thành.");
            return;
        }

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            await completeIntraUterineInseminationProcess(patientId);
            setSaveSuccess(true);
            await fetchIUIProcessData(); // Re-fetch to get updated status
            setTimeout(() => setSaveSuccess(false), 1500);
        } catch (error) {
            console.error("Failed to complete IUI process:", error);
            setSaveError(error.message || "Đã xảy ra lỗi khi hoàn thành quy trình IUI.");
        } finally {
            setIsSaving(false);
        }
    }, [patientId, currentProcessData, fetchIUIProcessData]);

    // Handles the "Cancel Process" action
    const handleCancelProcess = useCallback(async () => {
        if (!patientId || !currentProcessData || currentProcessData.status !== 'IN_PROGRESS') {
            alert("Không có quy trình IUI đang tiến hành để hủy.");
            return;
        }

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            await cancelIntraUterineInseminationProcess(patientId);
            setSaveSuccess(true);
            await fetchIUIProcessData(); // Re-fetch to get updated status
            setTimeout(() => setSaveSuccess(false), 1500);
        } catch (error) {
            console.error("Failed to cancel IUI process:", error);
            setSaveError(error.message || "Đã xảy ra lỗi khi hủy quy trình IUI.");
        } finally {
            setIsSaving(false);
        }
    }, [patientId, currentProcessData, fetchIUIProcessData]);


    // Handles changes in the dialog form
    const handleFormChange = (field: keyof IntraUterineInseminationProcessData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    // Handles saving (either starting new or updating existing process)
    const handleSave = useCallback(async () => {
        if (!patientId || !formData.actionDate || !formData.status) {
            setSaveError("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            const payload: IntraUterineInseminationProcessData = {
                actionDate: formData.actionDate,
                status: formData.status,
            };

            await updateIntraUterineInseminationProcess(patientId, payload); // Use update for both start and edit
            setSaveSuccess(true);
            await fetchIUIProcessData(); // Re-fetch data to reflect changes
            setTimeout(() => {
                setSaveSuccess(false);
                setIsDialogOpen(false);
            }, 1500);
        } catch (error) {
            console.error("Failed to save IUI Process data:", error);
            setSaveError(error.message || "Đã xảy ra lỗi khi lưu.");
        } finally {
            setIsSaving(false);
        }
    }, [patientId, formData, fetchIUIProcessData]);


    const renderValue = (value) => (value !== null && value !== undefined && value !== '') ? value : 'N/A';
    const getStatusLabel = (statusValue: string) => {
        const option = IUI_STATUS_OPTIONS.find(opt => opt.value === statusValue);
        return option ? option.label : statusValue;
    };

    const isProcessInProgress = currentProcessData?.status === 'IN_PROGRESS';
    const hasProcess = !!currentProcessData;

    return (
        <Card className="p-6 bg-white border border-[color:var(--card-border)]">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-between text-[color:var(--text-accent)]">
                Quy trình Thụ tinh trong tử cung (IUI)
                <div className="flex space-x-2">
                    {/* Start New Process Button */}
                    {!hasProcess || !isProcessInProgress ? (
                        <Button variant="outline" size="sm" onClick={handleStartNewProcess} disabled={isLoadingAnyOperation}>
                            <Play className="w-4 h-4 mr-2" /> Bắt đầu quy trình mới
                        </Button>
                    ) : null}

                    {/* Edit Process Button */}
                    {hasProcess && isProcessInProgress ? (
                        <Button variant="outline" size="sm" onClick={handleEditProcess} disabled={isLoadingAnyOperation}>
                            <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa quy trình
                        </Button>
                    ) : null}

                    {/* Complete Process Button */}
                    {hasProcess && isProcessInProgress ? (
                        <Button variant="outline" size="sm" onClick={handleCompleteProcess} disabled={isLoadingAnyOperation}>
                            <CheckCircle className="w-4 h-4 mr-2" /> Hoàn thành quy trình
                        </Button>
                    ) : null}

                    {/* Cancel Process Button */}
                    {hasProcess && isProcessInProgress ? (
                        <Button variant="outline" size="sm" onClick={handleCancelProcess} disabled={isLoadingAnyOperation}>
                            <XCircle className="w-4 h-4 mr-2" /> Hủy quy trình
                        </Button>
                    ) : null}
                </div>
            </h3>

            {isLoadingData && (
                <div className="text-center text-[color:var(--text-secondary)] py-4">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-[color:var(--deep-taupe)] mb-2" />
                    Đang tải dữ liệu quy trình IUI...
                </div>
            )}

            {errorData && !isLoadingData && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 text-center rounded-lg mb-4">
                    Lỗi: {errorData}
                </div>
            )}

            {!isLoadingData && !errorData && (
                <>
                    {!currentProcessData ? (
                        <p className="text-center text-[color:var(--text-secondary)] mb-4">
                            Chưa có quy trình Thụ tinh trong tử cung nào đang hoạt động.
                        </p>
                    ) : (
                        <div className="space-y-3 text-[color:var(--text-primary)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-[color:var(--text-secondary)]">Ngày thực hiện</Label>
                                    <p className="font-medium text-lg">{renderValue(formatDate(currentProcessData.actionDate))}</p>
                                </div>
                                <div className="col-span-full">
                                    <Label className="text-[color:var(--text-secondary)]">Trạng thái quy trình</Label>
                                    <p className="font-medium text-lg">{getStatusLabel(currentProcessData.status)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Dialog for starting new or editing process */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] p-6">
                    <DialogHeader>
                        <DialogTitle>{isEditingExisting ? 'Chỉnh sửa' : 'Bắt đầu'} Quy trình IUI</DialogTitle>
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
                            <Label htmlFor="status">Trạng thái</Label>
                            <Select
                                value={formData.status || ''}
                                onValueChange={(value: string) => handleFormChange('status', value)}
                                disabled={isSaving || (isEditingExisting && formData.status !== 'IN_PROGRESS')} // Can't change status directly if it's already completed/cancelled via this dialog
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    {IUI_STATUS_OPTIONS.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
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

export default IntraUterineInseminationProcessCard;