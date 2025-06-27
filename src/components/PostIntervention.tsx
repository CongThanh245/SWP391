// src/components/InterventionWife/PostInterventionCard.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Checkbox } from '@components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Loader2, Edit, Save, X, CheckCircle, Ban, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@components/ui/dialog';
import { toast } from '@hooks/use-toast';
import { formatDate } from '@utils/format'; // Assuming you have this utility

// Import API functions and interfaces
import {
    getPostInterventionInfo,
    updatePostIntervention,
    PostInterventionData,
} from '@api/dotorPostInterventionApi';

import {completePostInterventionStage} from '@api/doctorApi'

import PrescriptionItemFormDialog from '@components/InterventionWife/PrescriptionItemFormDialog'; 

interface Medication { id: string; name: string; }
interface PrescriptionItem { medicationId: string; drugName?: string; dosage: string; frequency: string; duration: string; quantity: number; }
interface Prescription { dateIssued: string; notes: string; items: PrescriptionItem[]; }

// Props for the PostInterventionCard
interface PostInterventionCardProps {
    patientId: string;
    // Pass medicationList from a parent component that fetches it globally
    medicationList: Medication[];
    // Pass in the AppointmentCalendar component props
    AppointmentCalendar: React.FC<{
        selectedTimeframe: string;
        onTimeframeSelect: (timeframe: string) => void;
        followUpNotes: string;
        onNotesChange: (notes: string) => void;
        followUpReason: string;
        onReasonChange: (reason: string) => void;
        patientId: string;
        // Add any other props AppointmentCalendar needs, and pass them down
        // For simplicity, I'm just passing patientId for now
    }>;
}

const PostInterventionCard: React.FC<PostInterventionCardProps> = ({ patientId, medicationList, AppointmentCalendar }) => {
    const defaultPrescription: Prescription = {
        dateIssued: new Date().toISOString().split('T')[0],
        notes: '',
        items: []
    };

    const defaultPostInterventionData: PostInterventionData = {
        hasPain: false,
        hasBleeding: false,
        otherComplications: '',
        betahcgDate: new Date().toISOString().split('T')[0], // Default to today
        betahcgResult: '',
        betahcgEvaluation: 'NOT_PREGNANT', // Default value
        evaluationOutcome: 'NOT_EFFECTIVE', // Default value
        expectedFollowUpDate: '', // Can be null or empty string initially
        additionalNotes: '',
        status: 'PLANNED', // Default status based on image_cca934.png
        prescription: defaultPrescription,
    };

    const [data, setData] = useState<PostInterventionData>(defaultPostInterventionData);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    // State for Prescription Item Dialog
    const [isPrescriptionItemDialogOpen, setIsPrescriptionItemDialogOpen] = useState(false);
    const [currentPrescriptionItem, setCurrentPrescriptionItem] = useState<PrescriptionItem | null>(null);
    const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

    // State for AppointmentCalendar (assuming it's managed externally or lifted up)
    // For now, let's keep it simple and just pass down to AppointmentCalendar
    const [expectedFollowUpDate, setExpectedFollowUpDate] = useState(''); // Use this for Input
    const [followUpNotes, setFollowUpNotes] = useState('');
    const [followUpReason, setFollowUpReason] = useState(''); // Assuming a reason for follow-up

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            if (!patientId) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const fetchedData = await getPostInterventionInfo(patientId);
                if (fetchedData) {
                    setData(fetchedData);
                    setExpectedFollowUpDate(fetchedData.expectedFollowUpDate || '');
                    setFollowUpNotes(fetchedData.additionalNotes || '');
                    // Assuming followUpReason might be part of additionalNotes or a separate field not shown
                } else {
                    setData(defaultPostInterventionData); // Reset to default if no data found
                    setExpectedFollowUpDate('');
                    setFollowUpNotes('');
                }
            } catch (err) {
                console.error("Failed to fetch post-intervention data:", err);
                setError("Không thể tải dữ liệu hậu can thiệp.");
                toast({
                    title: "Lỗi tải dữ liệu",
                    description: `Không thể tải dữ liệu hậu can thiệp: ${err.message || 'Lỗi không xác định'}`,
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [patientId]); // Re-fetch when patientId changes

    const handleInputChange = useCallback((field: keyof PostInterventionData, value) => {
        setData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handlePrescriptionItemSave = useCallback((item: PrescriptionItem) => {
        setData(prev => {
            const newItems = [...prev.prescription.items];
            if (editingItemIndex !== null) {
                newItems[editingItemIndex] = item;
            } else {
                newItems.push(item);
            }
            return {
                ...prev,
                prescription: {
                    ...prev.prescription,
                    items: newItems
                }
            };
        });
        setIsPrescriptionItemDialogOpen(false);
        setCurrentPrescriptionItem(null);
        setEditingItemIndex(null);
    }, [editingItemIndex]);

    const handleRemovePrescriptionItem = useCallback((index: number) => {
        setData(prev => ({
            ...prev,
            prescription: {
                ...prev.prescription,
                items: prev.prescription.items.filter((_, i) => i !== index)
            }
        }));
    }, []);

    const handleSave = useCallback(async () => {
        if (!patientId) {
            setSaveError("Dữ liệu bệnh nhân không hợp lệ để lưu.");
            return;
        }

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            // Update the data object with current expectedFollowUpDate and additionalNotes
            const dataToSave: PostInterventionData = {
                ...data,
                expectedFollowUpDate: expectedFollowUpDate,
                additionalNotes: followUpNotes, // Assuming additionalNotes maps to followUpNotes
                // The status will be sent as part of the full data object,
                // but status transitions (complete/cancel) should ideally use dedicated endpoints
            };
            await updatePostIntervention(patientId, dataToSave); //
            setSaveSuccess(true);
            toast({ title: "Lưu thành công", description: "Dữ liệu hậu can thiệp đã được cập nhật." });
            setTimeout(() => {
                setSaveSuccess(false);
                setIsDialogOpen(false);
            }, 2000);
        } catch (err) {
            console.error("Failed to save post-intervention data:", err);
            setSaveError(err.response?.data?.message || "Đã xảy ra lỗi khi lưu.");
            toast({
                title: "Lỗi lưu dữ liệu",
                description: `Không thể lưu dữ liệu hậu can thiệp: ${err.response?.data?.message || 'Lỗi không xác định'}`,
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    }, [patientId, data, expectedFollowUpDate, followUpNotes]);

    const handleComplete = useCallback(async () => {
        if (!patientId) {
            setError("Dữ liệu bệnh nhân không hợp lệ để hoàn thành.");
            return;
        }
        setIsCompleting(true);
        setError(null);
        try {
            await completePostInterventionStage(patientId);
            setData(prev => ({ ...prev, status: 'COMPLETED' }));
            toast({ title: "Thành công", description: "Quá trình hậu can thiệp đã được đánh dấu là HOÀN THÀNH." });
            setIsDialogOpen(false);
        } catch (err) {
            console.error("Failed to complete post-intervention:", err);
            setError(err.response?.data?.message || "Không thể hoàn thành quá trình hậu can thiệp.");
            toast({
                title: "Lỗi",
                description: `Không thể hoàn thành quá trình hậu can thiệp: ${err.response?.data?.message || 'Lỗi không xác định'}`,
                variant: "destructive",
            });
        } finally {
            setIsCompleting(false);
        }
    }, [patientId]);

    // const handleCancel = useCallback(async () => {
    //     if (!patientId) {
    //         setError("Dữ liệu bệnh nhân không hợp lệ để hủy.");
    //         return;
    //     }
    //     setIsCancelling(true);
    //     setError(null);
    //     try {
    //         await cancelPostIntervention(patientId);
    //         setData(prev => ({ ...prev, status: 'CANCELLED' }));
    //         toast({ title: "Thành công", description: "Quá trình hậu can thiệp đã được đánh dấu là ĐÃ HỦY." });
    //         setIsDialogOpen(false);
    //     } catch (err: any) {
    //         console.error("Failed to cancel post-intervention:", err);
    //         setError(err.response?.data?.message || "Không thể hủy quá trình hậu can thiệp.");
    //         toast({
    //             title: "Lỗi",
    //             description: `Không thể hủy quá trình hậu can thiệp: ${err.response?.data?.message || 'Lỗi không xác định'}`,
    //             variant: "destructive",
    //         });
    //     } finally {
    //         setIsCancelling(false);
    //     }
    // }, [patientId]);

    const isEditable = data.status === 'IN_PROGRESS' || data.status === 'PLANNED'; // Can edit if IN_PROGRESS or PLANNED
    const isOperationInProgress = isLoading || isSaving || isCompleting || isCancelling;

    const renderValue = (value) => value !== undefined && value !== null && value !== '' ? value : 'N/A';

    const renderStatusInVietnamese = (status: PostInterventionData['status']) => {
        switch (status) {
            case 'PLANNED': return 'Chưa bắt đầu';
            case 'IN_PROGRESS': return 'Đang tiến hành';
            case 'COMPLETED': return 'Đã hoàn thành';
            case 'CANCELLED': return 'Đã hủy';
            default: return 'Không xác định';
        }
    };

    const renderBetahcgEvaluation = (evaluation: PostInterventionData['betahcgEvaluation']) => {
        switch (evaluation) {
            case 'PREGNANT': return 'Có thai';
            case 'NOT_PREGNANT': return 'Không có thai';
            case 'SUSPICIOUS': return 'Nghi ngờ';
            case 'BIOCHEMICAL': return 'Thai hóa sinh';
            default: return 'N/A';
        }
    };

    const renderEvaluationOutcome = (outcome: PostInterventionData['evaluationOutcome']) => {
        switch (outcome) {
            case 'EFFECTIVE': return 'Đậu thai';
            case 'NOT_EFFECTIVE': return 'Không đậu'; // Changed from 'not-pregnant' to 'Không đậu' for clarity
            case 'SUSPICIOUS': return 'Nghi ngờ';
            case 'EARLY_MISCARRIAGE': return 'Sẩy thai sớm';
            default: return 'N/A';
        }
    };

    return (
        <Card className="p-6 bg-white border border-[color:var(--card-border)]">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-between text-[color:var(--text-accent)]">
                Hậu Can thiệp
                <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)} disabled={isOperationInProgress}>
                    <Edit className="w-4 h-4 mr-2" /> {isEditable ? 'Chỉnh sửa' : 'Xem'}
                </Button>
            </h3>

            {isLoading && (
                <div className="text-center text-[color:var(--text-secondary)] py-4">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-[color:var(--deep-taupe)] mb-2" />
                    Đang tải dữ liệu hậu can thiệp...
                </div>
            )}

            {error && !isLoading && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 text-center rounded-lg mb-4">
                    Lỗi: {error}
                </div>
            )}

            {!isLoading && !error && (
                <>
                    {/* Display Section */}
                    <div className="space-y-4 mb-6">
                        <h4 className="text-md font-semibold text-[color:var(--text-accent)]">Tình trạng sau can thiệp</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Đau bụng:</Label>
                                <p className="font-medium">{data.hasPain ? 'Có' : 'Không'}</p>
                            </div>
                            <div>
                                <Label>Ra máu:</Label>
                                <p className="font-medium">{data.hasBleeding ? 'Có' : 'Không'}</p>
                            </div>
                            {data.otherComplications && (
                                <div className="md:col-span-2">
                                    <Label>Khác:</Label>
                                    <p className="font-medium">{renderValue(data.otherComplications)}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        <h4 className="text-md font-semibold text-[color:var(--text-accent)]">Xét nghiệm β-hCG</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label>Ngày xét nghiệm:</Label>
                                <p className="font-medium">{renderValue(formatDate(data.betahcgDate))}</p>
                            </div>
                            <div>
                                <Label>Kết quả:</Label>
                                <p className="font-medium">{renderValue(data.betahcgResult)}</p>
                            </div>
                            <div>
                                <Label>Đánh giá:</Label>
                                <p className="font-medium">{renderBetahcgEvaluation(data.betahcgEvaluation)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        <h4 className="text-md font-semibold text-[color:var(--text-accent)]">Đánh giá hiệu quả</h4>
                        <p className="font-medium">{renderEvaluationOutcome(data.evaluationOutcome)}</p>
                    </div>

                    <div className="space-y-4 mb-6">
                        <h4 className="text-md font-semibold text-[color:var(--text-accent)]">Trạng thái</h4>
                        <p className="font-medium">{renderStatusInVietnamese(data.status)}</p>
                    </div>

                    {data.prescription && data.prescription.items && data.prescription.items.length > 0 && (
                        <div className="space-y-4 mb-6">
                            <h4 className="text-md font-semibold text-[color:var(--text-accent)]">Hướng dẫn tiếp theo (Đơn thuốc)</h4>
                            <p className="text-sm text-gray-500">Ngày cấp: {formatDate(data.prescription.dateIssued)}</p>
                            <p className="text-sm text-gray-500">Ghi chú: {renderValue(data.prescription.notes)}</p>
                            <div className="border rounded-md p-3">
                                {data.prescription.items.map((item, index) => {
                                    // Find drugName from medicationList if available
                                    const drugName = medicationList.find(med => med.id === item.medicationId)?.name || item.drugName || 'Thuốc không xác định';
                                    return (
                                        <div key={index} className="mb-2 p-2 border-b last:border-b-0">
                                            <p className="font-medium">{drugName} - {item.dosage}, {item.frequency}, {item.duration}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {(data.expectedFollowUpDate || data.additionalNotes) && (
                        <div className="space-y-4 mb-6">
                            <h4 className="text-md font-semibold text-[color:var(--text-accent)]">Thông tin tái khám</h4>
                            <div>
                                <Label>Ngày tái khám dự kiến:</Label>
                                <p className="font-medium">{renderValue(formatDate(data.expectedFollowUpDate))}</p>
                            </div>
                            <div>
                                <Label>Ghi chú thêm:</Label>
                                <p className="font-medium">{renderValue(data.additionalNotes)}</p>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Dialog for Editing/Creating Post-Intervention */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[800px] p-6 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isEditable ? 'Chỉnh sửa' : 'Xem'} Hậu Can thiệp</DialogTitle>
                        <DialogDescription>
                            {isEditable ? "Cập nhật thông tin chi tiết về giai đoạn hậu can thiệp." : "Quá trình đã hoàn thành hoặc bị hủy, không thể chỉnh sửa."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        {/* Tình trạng sau can thiệp */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[color:var(--text-accent)]">
                                Tình trạng sau can thiệp
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="dialogAbdominalPain"
                                        checked={data.hasPain}
                                        onCheckedChange={(checked) => handleInputChange('hasPain', !!checked)}
                                        className="data-[state=checked]:bg-[color:var(--deep-taupe)] data-[state=checked]:border-[color:var(--deep-taupe)]"
                                        disabled={!isEditable || isSaving}
                                    />
                                    <label htmlFor="dialogAbdominalPain" className="font-medium">
                                        Đau bụng
                                    </label>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="dialogBleeding"
                                        checked={data.hasBleeding}
                                        onCheckedChange={(checked) => handleInputChange('hasBleeding', !!checked)}
                                        className="data-[state=checked]:bg-[color:var(--deep-taupe)] data-[state=checked]:border-[color:var(--deep-taupe)]"
                                        disabled={!isEditable || isSaving}
                                    />
                                    <label htmlFor="dialogBleeding" className="font-medium">
                                        Ra máu
                                    </label>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="dialogOther"
                                        checked={!!data.otherComplications} // Check if otherComplications has value
                                        onCheckedChange={(checked) => {
                                            if (!checked) handleInputChange('otherComplications', '');
                                        }}
                                        className="data-[state=checked]:bg-[color:var(--deep-taupe)] data-[state=checked]:border-[color:var(--deep-taupe)]"
                                        disabled={!isEditable || isSaving}
                                    />
                                    <label htmlFor="dialogOther" className="font-medium">
                                        Khác
                                    </label>
                                </div>
                                {!!data.otherComplications && ( // Show input if otherComplications has value or checkbox is checked
                                    <div className="ml-6 space-y-2">
                                        <Label>Mô tả chi tiết</Label>
                                        <Input
                                            placeholder="Nhập mô tả..."
                                            value={data.otherComplications}
                                            onChange={(e) => handleInputChange('otherComplications', e.target.value)}
                                            className="border-[color:var(--card-border)]"
                                            disabled={!isEditable || isSaving}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Xét nghiệm β-hCG */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[color:var(--text-accent)]">
                                Xét nghiệm β-hCG
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="betahcgDate">Ngày xét nghiệm</Label>
                                    <Input
                                        id="betahcgDate"
                                        type="date"
                                        value={data.betahcgDate || ''}
                                        onChange={(e) => handleInputChange('betahcgDate', e.target.value)}
                                        className="border-[color:var(--card-border)]"
                                        disabled={!isEditable || isSaving}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="betahcgResult">Kết quả</Label>
                                    <Input
                                        id="betahcgResult"
                                        placeholder="Nhập kết quả..."
                                        value={data.betahcgResult || ''}
                                        onChange={(e) => handleInputChange('betahcgResult', e.target.value)}
                                        className="border-[color:var(--card-border)]"
                                        disabled={!isEditable || isSaving}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="betahcgEvaluation">Đánh giá</Label>
                                    <Select
                                        value={data.betahcgEvaluation || ''}
                                        onValueChange={(val: PostInterventionData['betahcgEvaluation']) => handleInputChange('betahcgEvaluation', val)}
                                        disabled={!isEditable || isSaving}
                                    >
                                        <SelectTrigger id="betahcgEvaluation" className="border-[color:var(--card-border)]">
                                            <SelectValue placeholder="Chọn đánh giá" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PREGNANT">Có thai</SelectItem>
                                            <SelectItem value="NOT_PREGNANT">Không có thai</SelectItem>
                                            <SelectItem value="SUSPICIOUS">Nghi ngờ</SelectItem>
                                            <SelectItem value="BIOCHEMICAL">Thai hóa sinh</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Đánh giá hiệu quả */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[color:var(--text-accent)]">
                                📊 Đánh giá hiệu quả
                            </h3>
                            <Select
                                value={data.evaluationOutcome || ''}
                                onValueChange={(val: PostInterventionData['evaluationOutcome']) => handleInputChange('evaluationOutcome', val)}
                                disabled={!isEditable || isSaving}
                            >
                                <SelectTrigger className="border-[color:var(--card-border)]">
                                    <SelectValue placeholder="Chọn đánh giá hiệu quả" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EFFECTIVE">Đậu thai</SelectItem>
                                    <SelectItem value="NOT_EFFECTIVE">Không đậu</SelectItem>
                                    <SelectItem value="SUSPICIOUS">Nghi ngờ</SelectItem>
                                    <SelectItem value="EARLY_MISCARRIAGE">Sẩy thai sớm</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Hướng dẫn tiếp theo (Prescription) */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[color:var(--text-accent)]">
                                📝 Đơn thuốc
                            </h3>
                            <div className="space-y-2">
                                <Label htmlFor="prescriptionDateIssued">Ngày cấp đơn</Label>
                                <Input
                                    id="prescriptionDateIssued"
                                    type="date"
                                    value={data.prescription.dateIssued || ''}
                                    onChange={(e) => setData(prev => ({
                                        ...prev,
                                        prescription: { ...prev.prescription, dateIssued: e.target.value }
                                    }))}
                                    disabled={!isEditable || isSaving}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="prescriptionNotes">Ghi chú đơn thuốc</Label>
                                <Textarea
                                    id="prescriptionNotes"
                                    placeholder="Ghi chú đơn thuốc..."
                                    value={data.prescription.notes || ''}
                                    onChange={(e) => setData(prev => ({
                                        ...prev,
                                        prescription: { ...prev.prescription, notes: e.target.value }
                                    }))}
                                    className="min-h-[60px] border-[color:var(--card-border)]"
                                    disabled={!isEditable || isSaving}
                                />
                            </div>
                            <div className="space-y-3 p-3 border rounded-md">
                                <h4 className="font-medium text-[color:var(--text-accent)]">Các mục thuốc trong đơn</h4>
                                {data.prescription.items.length === 0 && (
                                    <p className="text-sm text-gray-500">Chưa có thuốc nào trong đơn.</p>
                                )}
                                {data.prescription.items.map((item, index) => {
                                    const drugName = medicationList.find(med => med.id === item.medicationId)?.name || item.drugName || 'Thuốc không xác định';
                                    return (
                                        <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
                                            <p className="text-sm">
                                                <span className="font-medium">{drugName}</span> - {item.dosage}, {item.frequency}, {item.duration}
                                            </p>
                                            {isEditable && (
                                                <div className="flex space-x-2">
                                                    <Button variant="ghost" size="sm" onClick={() => {
                                                        setCurrentPrescriptionItem(item);
                                                        setEditingItemIndex(index);
                                                        setIsPrescriptionItemDialogOpen(true);
                                                    }} disabled={isSaving}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleRemovePrescriptionItem(index)} disabled={isSaving}>
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {isEditable && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setCurrentPrescriptionItem(null);
                                            setEditingItemIndex(null);
                                            setIsPrescriptionItemDialogOpen(true);
                                        }}
                                        disabled={isSaving}
                                        className="mt-2"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Thêm thuốc
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Hướng dẫn tiếp theo (Appointment & Notes) */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[color:var(--text-accent)]">
                                📅 Hướng dẫn tái khám & Ghi chú thêm
                            </h3>
                            {/* Integrate AppointmentCalendar here */}
                            {AppointmentCalendar && (
                                <AppointmentCalendar
                                    patientId={patientId}
                                    selectedTimeframe={expectedFollowUpDate} // Map to expectedFollowUpDate
                                    onTimeframeSelect={setExpectedFollowUpDate} // Update expectedFollowUpDate
                                    followUpNotes={followUpNotes}
                                    onNotesChange={setFollowUpNotes}
                                    followUpReason={followUpReason} // Pass this if AppointmentCalendar uses it
                                    onReasonChange={setFollowUpReason} // Update followUpReason
                                    // Make sure AppointmentCalendar itself respects the `isEditable` prop
                                    // You might need to add an `isEditable` prop to AppointmentCalendar
                                    // and pass it down like: isEditable={isEditable && !isSaving}
                                />
                            )}
                            {/* The "Ghi chú thêm" from your original structure now maps to additionalNotes, handled by AppointmentCalendar via followUpNotes */}
                        </div>

                        {/* Current Status Display in Dialog */}
                        <div className="space-y-2 pt-4">
                            <Label>Trạng thái hiện tại</Label>
                            <p className="font-medium text-[color:var(--text-accent)]">
                                {renderStatusInVietnamese(data.status)}
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4">
                        {isOperationInProgress && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
                        {saveError && <p className="text-red-500 text-sm mr-2">{saveError}</p>}
                        {saveSuccess && <p className="text-green-500 text-sm mr-2">Lưu thành công!</p>}

                        {data.status === 'IN_PROGRESS' || data.status === 'PLANNED' ? (
                            <>
                                <Button
                                    variant="outline"
                                    //onClick={handleCancel}
                                    disabled={isOperationInProgress}
                                    className="text-orange-600 hover:text-orange-800"
                                >
                                    <Ban className="w-4 h-4 mr-2" /> {isCancelling ? 'Đang hủy...' : 'Hủy quá trình'}
                                </Button>
                                <Button
                                    onClick={handleComplete}
                                    disabled={isOperationInProgress}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" /> {isCompleting ? 'Đang hoàn thành...' : 'Hoàn thành quá trình'}
                                </Button>
                            </>
                        ) : null}

                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isOperationInProgress}>
                            <X className="w-4 h-4 mr-2" /> {isEditable ? 'Hủy' : 'Đóng'}
                        </Button>
                        {isEditable && (
                            <Button onClick={handleSave} disabled={isSaving}>
                                <Save className="w-4 h-4 mr-2" /> {isSaving ? 'Đang lưu...' : 'Lưu'}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Prescription Item Dialog (reused from other components) */}
            {isPrescriptionItemDialogOpen && (
                <PrescriptionItemFormDialog
                    isOpen={isPrescriptionItemDialogOpen}
                    onClose={() => setIsPrescriptionItemDialogOpen(false)}
                    itemToEdit={currentPrescriptionItem || undefined}
                    medicationList={medicationList}
                    onSave={handlePrescriptionItemSave}
                    isSaving={isSaving} // Pass isSaving from parent component
                    //isParentFormEditable={isEditable} // Pass the overall card's editability
                />
            )}
        </Card>
    );
};

export default PostInterventionCard;