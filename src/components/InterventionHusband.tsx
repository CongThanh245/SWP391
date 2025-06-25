import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Textarea } from '@components/ui/textarea';
import { useToast } from '@hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@components/ui/dialog';
import { Loader2, Edit, Save, X, Play, CheckCircle, XCircle } from 'lucide-react';

// Import API functions
import {
    getSpermProcessingData,
    updateSpermProcessingData,
    completeSpermProcessing,
    cancelSpermProcessing,
} from '@api/doctorInterventionApi';

// Helper for date formatting (adjust path if needed)
import { formatDate } from '@utils/format';

// Define the enum for processing methods
enum ProcessingMethod {
    SWIM_UP = "SWIM_UP",
    GRADIENT = "GRADIENT",
    OTHER = "OTHER",
}

// Interface for the data fetched from the backend
interface SpermProcessingData {
    collectionDate: string; // "YYYY-MM-DD"
    processingMethod: ProcessingMethod | string;
    spermDensity: number;
    motilityLevel: number;
    evaluation: string;
    status: string; // "IN_PROGRESS", "COMPLETED", "CANCELLED", etc.
}

// Payload for updating/creating (excluding status, which is managed by actions)
type UpdateSpermProcessingPayload = SpermProcessingData;


interface InterventionHusbandProps {
    patientId: string;
}

const InterventionHusband: React.FC<InterventionHusbandProps> = ({ patientId }) => {
    const { toast } = useToast();

    const [currentSpermProcessingData, setCurrentSpermProcessingData] = useState<SpermProcessingData | null>(null);
    const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
    const [errorData, setErrorData] = useState<string | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditingExisting, setIsEditingExisting] = useState(false); // True if editing, false if starting new

    const [formData, setFormData] = useState<Partial<SpermProcessingData>>({
        collectionDate: new Date().toISOString().split('T')[0],
        processingMethod: ProcessingMethod.SWIM_UP, // Default method
        spermDensity: 0.0,
        motilityLevel: 0.0,
        evaluation: '',
    });

    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

    // Consolidate all loading/saving/action states for disabling buttons
    const isLoadingAnyOperation = useMemo(() => {
        return isLoadingData || isSaving;
    }, [isLoadingData, isSaving]);

    // Fetch the current sperm processing data
    const fetchSpermProcessingData = useCallback(async () => {
        if (!patientId) return;
        setIsLoadingData(true);
        setErrorData(null);
        try {
            const data = await getSpermProcessingData(patientId);
            setCurrentSpermProcessingData(data);
            if (data) {
                // Populate form data with existing data if available
                setFormData({
                    collectionDate: data.collectionDate,
                    processingMethod: data.processingMethod,
                    spermDensity: data.spermDensity,
                    motilityLevel: data.motilityLevel,
                    evaluation: data.evaluation,
                    status: currentSpermProcessingData?.status || 'IN_PROGRESS',
                });
            } else {
                // Reset form to defaults for creating new
                setFormData({
                    collectionDate: new Date().toISOString().split('T')[0],
                    processingMethod: ProcessingMethod.SWIM_UP,
                    spermDensity: 0.0,
                    motilityLevel: 0.0,
                    evaluation: '',
                    status: currentSpermProcessingData?.status || 'IN_PROGRESS'
                });
            }
        } catch (err) {
            console.error("Failed to fetch sperm processing data:", err);
            setErrorData(err.message || "Không thể tải dữ liệu xử lý tinh trùng.");
            setCurrentSpermProcessingData(null);
            toast({
                title: "Lỗi",
                description: `Không thể tải dữ liệu xử lý tinh trùng: ${err.message}`,
                variant: "destructive",
            });
        } finally {
            setIsLoadingData(false);
        }
    }, [patientId, toast]);

    // Initial data fetch on component mount
    useEffect(() => {
        fetchSpermProcessingData();
    }, [fetchSpermProcessingData]);

    // Handlers for opening the dialog
    const handleStartNewProcess = () => {
        setIsEditingExisting(false);
        setFormData({ // Reset form to defaults for a new entry
            collectionDate: new Date().toISOString().split('T')[0],
            processingMethod: ProcessingMethod.SWIM_UP,
            spermDensity: 0.0,
            motilityLevel: 0.0,
            evaluation: '',
            status: 'IN_PROGRESS'
        });
        setIsDialogOpen(true);
    };

    const handleEditProcess = () => {
        if (currentSpermProcessingData) {
            setIsEditingExisting(true);
            setFormData({ // Populate form with current data for editing
                collectionDate: currentSpermProcessingData.collectionDate,
                processingMethod: currentSpermProcessingData.processingMethod as ProcessingMethod,
                spermDensity: currentSpermProcessingData.spermDensity,
                motilityLevel: currentSpermProcessingData.motilityLevel,
                evaluation: currentSpermProcessingData.evaluation,
            });
            setIsDialogOpen(true);
        } else {
            toast({
                title: "Thông báo",
                description: "Không có dữ liệu để chỉnh sửa. Vui lòng bắt đầu một quy trình mới.",
                variant: "default",
            });
            handleStartNewProcess();
        }
    };

    // Handle form input changes
    const handleFormChange = (field: keyof UpdateSpermProcessingPayload, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    // Handle saving the form data (either create new or update existing)
    const handleSaveFormData = useCallback(async () => {
        if (!patientId) {
            setSaveError("Không có ID bệnh nhân.");
            return;
        }

        // Basic validation
        if (!formData.collectionDate || !formData.processingMethod ||
            formData.spermDensity === undefined || formData.motilityLevel === undefined || !formData.evaluation) {
            setSaveError("Vui lòng điền đầy đủ thông tin bắt buộc.");
            return;
        }

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            const payload: UpdateSpermProcessingPayload = {
                collectionDate: formData.collectionDate,
                processingMethod: formData.processingMethod,
                spermDensity: typeof formData.spermDensity === 'string' ? parseFloat(formData.spermDensity) : formData.spermDensity,
                motilityLevel: typeof formData.motilityLevel === 'string' ? parseFloat(formData.motilityLevel) : formData.motilityLevel,
                evaluation: formData.evaluation,
                status: formData.status
            };

            await updateSpermProcessingData(patientId, payload);

            setSaveSuccess(true);
            toast({
                title: "Thành công",
                description: "Dữ liệu xử lý tinh trùng đã được lưu.",
                variant: "default",
            });
            await fetchSpermProcessingData(); // Re-fetch data to reflect changes
            setTimeout(() => {
                setSaveSuccess(false);
                setIsDialogOpen(false);
            }, 1500);
        } catch (err) {
            console.error("Failed to save sperm processing data:", err);
            setSaveError(err.message || "Đã xảy ra lỗi khi lưu dữ liệu.");
            toast({
                title: "Lỗi",
                description: `Không thể lưu dữ liệu: ${err.message}`,
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    }, [patientId, formData, fetchSpermProcessingData, toast]);

    // Handle completing the process
    const handleCompleteProcess = useCallback(async () => {
        if (!patientId || currentSpermProcessingData?.status !== 'IN_PROGRESS') {
            toast({
                title: "Thông báo",
                description: "Không có quy trình đang tiến hành để hoàn thành.",
                variant: "default",
            });
            return;
        }

        setIsSaving(true); // Using isSaving for all action buttons for simplicity
        setSaveError(null);
        setSaveSuccess(false);
        try {
            await completeSpermProcessing(patientId);
            setSaveSuccess(true);
            toast({
                title: "Thành công",
                description: "Quy trình xử lý tinh trùng đã hoàn tất.",
                variant: "default",
            });
            await fetchSpermProcessingData(); // Re-fetch to update status
            setTimeout(() => setSaveSuccess(false), 1500);
        } catch (err) {
            console.error("Failed to complete sperm processing:", err);
            setSaveError(err.message || "Đã xảy ra lỗi khi hoàn tất quy trình.");
            toast({
                title: "Lỗi",
                description: `Không thể hoàn tất quy trình: ${err.message}`,
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    }, [patientId, currentSpermProcessingData?.status, fetchSpermProcessingData, toast]);

    // Handle canceling the process
    const handleCancelProcess = useCallback(async () => {
        if (!patientId || currentSpermProcessingData?.status !== 'IN_PROGRESS') {
            toast({
                title: "Thông báo",
                description: "Không có quy trình đang tiến hành để hủy.",
                variant: "default",
            });
            return;
        }

        setIsSaving(true); // Using isSaving for all action buttons for simplicity
        setSaveError(null);
        setSaveSuccess(false);
        try {
            await cancelSpermProcessing(patientId);
            setSaveSuccess(true);
            toast({
                title: "Thành công",
                description: "Quy trình xử lý tinh trùng đã được hủy.",
                variant: "default",
            });
            await fetchSpermProcessingData(); // Re-fetch to update status
            setTimeout(() => setSaveSuccess(false), 1500);
        } catch (err) {
            console.error("Failed to cancel sperm processing:", err);
            setSaveError(err.message || "Đã xảy ra lỗi khi hủy quy trình.");
            toast({
                title: "Lỗi",
                description: `Không thể hủy quy trình: ${err.message}`,
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    }, [patientId, currentSpermProcessingData?.status, fetchSpermProcessingData, toast]);

    const renderValue = (value) => (value !== null && value !== undefined && value !== '') ? value : 'N/A';
    const hasSpermProcessingData = !!currentSpermProcessingData;
    const isProcessInProgress = currentSpermProcessingData?.status === 'IN_PROGRESS';

    return (
        <Card className="p-6 bg-white border border-[color:var(--card-border)]">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-between text-[color:var(--text-accent)]">
                Xử lý tinh trùng
                <div className="flex space-x-2">
                    {/* Conditional Buttons based on status */}
                    {!hasSpermProcessingData || !isProcessInProgress ? (
                        <Button variant="outline" size="sm" onClick={handleStartNewProcess} disabled={isLoadingAnyOperation}>
                            <Play className="w-4 h-4 mr-2" /> Bắt đầu quy trình mới
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" size="sm" onClick={handleEditProcess} disabled={isLoadingAnyOperation}>
                                <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa quy trình
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleCompleteProcess} disabled={isLoadingAnyOperation}>
                                <CheckCircle className="w-4 h-4 mr-2" /> Hoàn thành
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleCancelProcess} disabled={isLoadingAnyOperation}>
                                <XCircle className="w-4 h-4 mr-2" /> Hủy
                            </Button>
                        </>
                    )}
                </div>
            </h3>

            {isLoadingData && (
                <div className="text-center text-[color:var(--text-secondary)] py-4">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-[color:var(--deep-taupe)] mb-2" />
                    Đang tải dữ liệu xử lý tinh trùng...
                </div>
            )}

            {errorData && !isLoadingData && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 text-center rounded-lg mb-4">
                    Lỗi: {errorData}
                </div>
            )}

            {!isLoadingData && !errorData && (
                <>
                    {!currentSpermProcessingData ? (
                        <p className="text-center text-[color:var(--text-secondary)] mb-4">
                            Chưa có dữ liệu xử lý tinh trùng nào.
                        </p>
                    ) : (
                        <div className="space-y-3 text-[color:var(--text-primary)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-[color:var(--text-secondary)]">Ngày lấy tinh trùng</Label>
                                    <p className="font-medium text-lg">{renderValue(formatDate(currentSpermProcessingData.collectionDate))}</p>
                                </div>
                                <div>
                                    <Label className="text-[color:var(--text-secondary)]">Phương pháp xử lý</Label>
                                    <p className="font-medium text-lg">
                                        {renderValue(currentSpermProcessingData.processingMethod === ProcessingMethod.SWIM_UP ? 'Swim-up' :
                                                     currentSpermProcessingData.processingMethod === ProcessingMethod.GRADIENT ? 'Gradient' :
                                                     currentSpermProcessingData.processingMethod === ProcessingMethod.OTHER ? 'Khác' :
                                                     currentSpermProcessingData.processingMethod)}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-[color:var(--text-secondary)]">Mật độ tinh trùng</Label>
                                    <p className="font-medium text-lg">{renderValue(currentSpermProcessingData.spermDensity)}</p>
                                </div>
                                <div>
                                    <Label className="text-[color:var(--text-secondary)]">Mức độ di động</Label>
                                    <p className="font-medium text-lg">{renderValue(currentSpermProcessingData.motilityLevel)}</p>
                                </div>
                                <div className="col-span-full">
                                    <Label className="text-[color:var(--text-secondary)]">Đánh giá</Label>
                                    <p className="font-medium text-lg">{renderValue(currentSpermProcessingData.evaluation)}</p>
                                </div>
                                <div className="col-span-full">
                                    <Label className="text-[color:var(--text-secondary)]">Trạng thái hiện tại</Label>
                                    <p className="font-medium text-lg">{renderValue(currentSpermProcessingData.status)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Dialog for editing/creating sperm processing data */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px] p-6">
                    <DialogHeader>
                        <DialogTitle>{isEditingExisting ? 'Chỉnh sửa' : 'Bắt đầu'} Xử lý tinh trùng</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="collectionDate">Ngày lấy tinh trùng</Label>
                            <Input
                                id="collectionDate"
                                type="date"
                                value={formData.collectionDate || ''}
                                onChange={(e) => handleFormChange('collectionDate', e.target.value)}
                                disabled={isSaving}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="processingMethod">Phương pháp xử lý</Label>
                            <Select
                                value={formData.processingMethod as string || ''}
                                onValueChange={(value: string) => handleFormChange('processingMethod', value as ProcessingMethod)}
                                disabled={isSaving}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn phương pháp" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ProcessingMethod.SWIM_UP}>Swim-up</SelectItem>
                                    <SelectItem value={ProcessingMethod.GRADIENT}>Gradient</SelectItem>
                                    <SelectItem value={ProcessingMethod.OTHER}>Khác</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="spermDensity">Mật độ tinh trùng</Label>
                            <Input
                                id="spermDensity"
                                type="number"
                                step="0.1"
                                value={formData.spermDensity ?? ''}
                                onChange={(e) => handleFormChange('spermDensity', parseFloat(e.target.value) || 0)}
                                disabled={isSaving}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="motilityLevel">Mức độ di động</Label>
                            <Input
                                id="motilityLevel"
                                type="number"
                                step="0.1"
                                value={formData.motilityLevel ?? ''}
                                onChange={(e) => handleFormChange('motilityLevel', parseFloat(e.target.value) || 0)}
                                disabled={isSaving}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="evaluation">Đánh giá</Label>
                            <Textarea
                                id="evaluation"
                                placeholder="Nhập đánh giá..."
                                value={formData.evaluation || ''}
                                onChange={(e) => handleFormChange('evaluation', e.target.value)}
                                rows={3}
                                disabled={isSaving}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        {isSaving && <Loader2 className="h-5 w-5 animate-spin mr-2 text-[color:var(--deep-taupe)]" />}
                        {saveError && <p className="text-red-500 text-sm mr-2">{saveError}</p>}
                        {saveSuccess && <p className="text-green-500 text-sm mr-2">Lưu thành công!</p>}
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                            <X className="w-4 h-4 mr-2" /> Hủy
                        </Button>
                        <Button onClick={handleSaveFormData} disabled={isSaving}>
                            <Save className="w-4 h-4 mr-2" /> Lưu
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default InterventionHusband;