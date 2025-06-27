import React, { useEffect, useState, useCallback } from 'react';
import { Card } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import { Loader2, Edit, Save, X, CheckCircle, Ban } from 'lucide-react'; // Re-added CheckCircle, Ban
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@components/ui/dialog';
import { formatDate } from '@utils/format'; // Assuming you have this utility

// Import the corrected API functions
import {
    getOocyteRetrievalProcedure,
    updateOocyteRetrievalProcedure,
    completeOocyteRetrievalProcedure, // Re-added
    cancelOocyteRetrievalProcedure,   // Re-added
} from '@api/doctorInterventionApi';

// Define the data structure for Oocyte Retrieval Procedure (now including status)
type OocyteRetrievalProcedureStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

interface OocyteRetrievalProcedureData {
    actionDate: string;
    totalOocytesRetrieved: number;
    maturedOocytes: number;
    frozenOocytes: number;
    status: OocyteRetrievalProcedureStatus; // Added status field
}

interface OocyteRetrievalProcedureCardProps {
    patientId: string;
}

const OocyteRetrievalProcedureCard: React.FC<OocyteRetrievalProcedureCardProps> = ({ patientId }) => {
    const [oocyteRetrievalData, setOocyteRetrievalData] = useState<OocyteRetrievalProcedureData>(() => ({
        actionDate: new Date().toISOString().split('T')[0],
        totalOocytesRetrieved: 0,
        maturedOocytes: 0,
        frozenOocytes: 0,
        status: 'IN_PROGRESS' // Default status
    }));

    const [isOocyteRetrievalDialogOpen, setIsOocyteRetrievalDialogOpen] = useState(false);
    const [isLoadingOocyteRetrieval, setIsLoadingOocyteRetrieval] = useState(false);
    const [errorOocyteRetrieval, setErrorOocyteRetrieval] = useState<string | null>(null);

    const [isSavingOocyteRetrieval, setIsSavingOocyteRetrieval] = useState(false);
    const [saveErrorOocyteRetrieval, setSaveErrorOocyteRetrieval] = useState<string | null>(null);
    const [saveSuccessOocyteRetrieval, setSaveSuccessOocyteRetrieval] = useState(false);

    const [isCompleting, setIsCompleting] = useState(false); // Re-added
    const [isCancelling, setIsCancelling] = useState(false);   // Re-added

    // Fetch oocyte retrieval data when patientId changes
    useEffect(() => {
        const fetchOocyteRetrievalData = async () => {
            if (!patientId) return;

            setIsLoadingOocyteRetrieval(true);
            setErrorOocyteRetrieval(null);
            try {
                const data = (await getOocyteRetrievalProcedure(patientId)) as OocyteRetrievalProcedureData;

                console.log("Fetched oocyte retrieval data:", data); // For debugging
                if (data) {
                    const validStatuses: OocyteRetrievalProcedureStatus[] = ['IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
                    const validatedStatus: OocyteRetrievalProcedureStatus = validStatuses.includes(data.status)
                        ? data.status
                        : 'IN_PROGRESS';
                    setOocyteRetrievalData({ ...data, status: validatedStatus });
                } else {
                    // If no data exists, initialize with default values and 'IN_PROGRESS' status
                    setOocyteRetrievalData(() => ({
                        actionDate: new Date().toISOString().split('T')[0],
                        totalOocytesRetrieved: 0,
                        maturedOocytes: 0,
                        frozenOocytes: 0,
                        status: 'IN_PROGRESS'
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch oocyte retrieval procedure:", error);
                setErrorOocyteRetrieval("Không thể tải dữ liệu chọc hút trứng.");
                setOocyteRetrievalData(() => ({
                    actionDate: new Date().toISOString().split('T')[0],
                    totalOocytesRetrieved: 0,
                    maturedOocytes: 0,
                    frozenOocytes: 0,
                    status: 'IN_PROGRESS'
                }));
            } finally {
                setIsLoadingOocyteRetrieval(false);
            }
        };

        fetchOocyteRetrievalData();
    }, [patientId]);

    const handleOocyteRetrievalChange = (field: keyof OocyteRetrievalProcedureData, value) => {
        setOocyteRetrievalData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveOocyteRetrieval = useCallback(async () => {
        if (!patientId) {
            setSaveErrorOocyteRetrieval("Dữ liệu bệnh nhân không hợp lệ để lưu.");
            return;
        }

        setIsSavingOocyteRetrieval(true);
        setSaveErrorOocyteRetrieval(null);
        setSaveSuccessOocyteRetrieval(false);

        try {
            await updateOocyteRetrievalProcedure(patientId, oocyteRetrievalData);
            setSaveSuccessOocyteRetrieval(true);
            setTimeout(() => {
                setSaveSuccessOocyteRetrieval(false);
                setIsOocyteRetrievalDialogOpen(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to save oocyte retrieval procedure:", error);
            setSaveErrorOocyteRetrieval(error.response?.data?.message || "Đã xảy ra lỗi khi lưu.");
        } finally {
            setIsSavingOocyteRetrieval(false);
        }
    }, [patientId, oocyteRetrievalData]);

    const handleCompleteOocyteRetrieval = useCallback(async () => { // Re-added
        if (!patientId) {
            setErrorOocyteRetrieval("Dữ liệu bệnh nhân không hợp lệ để hoàn thành.");
            return;
        }
        setIsCompleting(true);
        setErrorOocyteRetrieval(null);
        try {
            await completeOocyteRetrievalProcedure(patientId);
            setOocyteRetrievalData(prev => ({ ...prev, status: 'COMPLETED' }));
            alert("Quá trình đã được đánh dấu là HOÀN THÀNH.");
            setIsOocyteRetrievalDialogOpen(false);
        } catch (error) {
            console.error("Failed to complete oocyte retrieval procedure:", error);
            setErrorOocyteRetrieval(error.response?.data?.message || "Không thể hoàn thành quá trình chọc hút trứng.");
        } finally {
            setIsCompleting(false);
        }
    }, [patientId]);

    const handleCancelOocyteRetrieval = useCallback(async () => { // Re-added
        if (!patientId) {
            setErrorOocyteRetrieval("Dữ liệu bệnh nhân không hợp lệ để hủy.");
            return;
        }
        setIsCancelling(true);
        setErrorOocyteRetrieval(null);
        try {
            await cancelOocyteRetrievalProcedure(patientId);
            setOocyteRetrievalData(prev => ({ ...prev, status: 'CANCELLED' }));
            alert("Quá trình đã được đánh dấu là ĐÃ HỦY.");
            setIsOocyteRetrievalDialogOpen(false);
        } catch (error) {
            console.error("Failed to cancel oocyte retrieval procedure:", error);
            setErrorOocyteRetrieval(error.response?.data?.message || "Không thể hủy quá trình chọc hút trứng.");
        } finally {
            setIsCancelling(false);
        }
    }, [patientId]);

    const renderValue = (value) => value !== undefined && value !== null && value !== '' ? value : 'N/A';

    // isEditable now depends on status
    const isEditable = oocyteRetrievalData.status === 'IN_PROGRESS';
    const isOperationInProgress = isSavingOocyteRetrieval || isCompleting || isCancelling; // Re-added Completing, Cancelling

    const renderStatusInVietnamese = (status: OocyteRetrievalProcedureStatus) => {
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
                Thủ thuật chọc hút trứng
                <Button variant="outline" size="sm" onClick={() => setIsOocyteRetrievalDialogOpen(true)} className="ml-2" disabled={isOperationInProgress}>
                    <Edit className="w-4 h-4 mr-2" /> {isEditable ? 'Chỉnh sửa' : 'Xem'}
                </Button>
            </h3>

            {isLoadingOocyteRetrieval && (
                <div className="text-center text-[color:var(--text-secondary)] py-4">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-[color:var(--deep-taupe)] mb-2" />
                    Đang tải dữ liệu chọc hút trứng...
                </div>
            )}

            {errorOocyteRetrieval && !isLoadingOocyteRetrieval && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 text-center rounded-lg mb-4">
                    Lỗi: {errorOocyteRetrieval}
                </div>
            )}

            {!isLoadingOocyteRetrieval && !errorOocyteRetrieval && (
                <>
                    {((oocyteRetrievalData.totalOocytesRetrieved === 0 && oocyteRetrievalData.maturedOocytes === 0 && oocyteRetrievalData.frozenOocytes === 0) && oocyteRetrievalData.status === 'IN_PROGRESS' && oocyteRetrievalData.actionDate === new Date().toISOString().split('T')[0]) ? (
                        <p className="text-center text-[color:var(--text-secondary)] mb-4">Chưa có dữ liệu chọc hút trứng.</p>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Ngày thực hiện</Label>
                                    <p className="font-medium">{renderValue(formatDate(oocyteRetrievalData.actionDate))}</p>
                                </div>
                                <div>
                                    <Label>Tổng số trứng thu được</Label>
                                    <p className="font-medium">{renderValue(oocyteRetrievalData.totalOocytesRetrieved)}</p>
                                </div>
                                <div>
                                    <Label>Số trứng trưởng thành</Label>
                                    <p className="font-medium">{renderValue(oocyteRetrievalData.maturedOocytes)}</p>
                                </div>
                                <div>
                                    <Label>Số trứng đông lạnh</Label>
                                    <p className="font-medium">{renderValue(oocyteRetrievalData.frozenOocytes)}</p>
                                </div>
                                <div>
                                    <Label>Trạng thái</Label>
                                    <p className="font-medium">{renderStatusInVietnamese(oocyteRetrievalData.status)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            <Dialog open={isOocyteRetrievalDialogOpen} onOpenChange={setIsOocyteRetrievalDialogOpen}>
                <DialogContent className="sm:max-w-[700px] p-6 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isEditable ? 'Chỉnh sửa' : 'Xem'} Thủ thuật chọc hút trứng</DialogTitle>
                        <DialogDescription>
                            {isEditable ? "Cập nhật thông tin chi tiết về quá trình chọc hút trứng." : "Quá trình đã hoàn thành hoặc bị hủy, không thể chỉnh sửa."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="actionDate">Ngày thực hiện</Label>
                            <Input
                                id="actionDate"
                                type="date"
                                value={oocyteRetrievalData.actionDate || ''}
                                onChange={(e) => handleOocyteRetrievalChange('actionDate', e.target.value)}
                                disabled={!isEditable || isSavingOocyteRetrieval}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="totalOocytesRetrieved">Tổng số trứng thu được</Label>
                            <Input
                                id="totalOocytesRetrieved"
                                type="number"
                                value={oocyteRetrievalData.totalOocytesRetrieved}
                                onChange={(e) => handleOocyteRetrievalChange('totalOocytesRetrieved', parseInt(e.target.value) || 0)}
                                disabled={!isEditable || isSavingOocyteRetrieval}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maturedOocytes">Số trứng trưởng thành</Label>
                            <Input
                                id="maturedOocytes"
                                type="number"
                                value={oocyteRetrievalData.maturedOocytes}
                                onChange={(e) => handleOocyteRetrievalChange('maturedOocytes', parseInt(e.target.value) || 0)}
                                disabled={!isEditable || isSavingOocyteRetrieval}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="frozenOocytes">Số trứng đông lạnh</Label>
                            <Input
                                id="frozenOocytes"
                                type="number"
                                value={oocyteRetrievalData.frozenOocytes}
                                onChange={(e) => handleOocyteRetrievalChange('frozenOocytes', parseInt(e.target.value) || 0)}
                                disabled={!isEditable || isSavingOocyteRetrieval}
                            />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label>Trạng thái quá trình</Label>
                            <p className="font-medium text-[color:var(--text-accent)]">
                                {renderStatusInVietnamese(oocyteRetrievalData.status)}
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4">
                        {isOperationInProgress && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
                        {saveErrorOocyteRetrieval && <p className="text-red-500 text-sm mr-2">{saveErrorOocyteRetrieval}</p>}
                        {saveSuccessOocyteRetrieval && <p className="text-green-500 text-sm mr-2">Lưu thành công!</p>}

                        {oocyteRetrievalData.status === 'IN_PROGRESS' && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleCancelOocyteRetrieval}
                                    disabled={isOperationInProgress}
                                    className="text-orange-600 hover:text-orange-800"
                                >
                                    <Ban className="w-4 h-4 mr-2" /> {isCancelling ? 'Đang hủy...' : 'Hủy quá trình'}
                                </Button>
                                <Button
                                    onClick={handleCompleteOocyteRetrieval}
                                    disabled={isOperationInProgress}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" /> {isCompleting ? 'Đang hoàn thành...' : 'Hoàn thành quá trình'}
                                </Button>
                            </>
                        )}

                        <Button variant="outline" onClick={() => setIsOocyteRetrievalDialogOpen(false)} disabled={isOperationInProgress}>
                            <X className="w-4 h-4 mr-2" /> {isEditable ? 'Hủy' : 'Đóng'}
                        </Button>
                        {isEditable && (
                            <Button onClick={handleSaveOocyteRetrieval} disabled={isSavingOocyteRetrieval}>
                                <Save className="w-4 h-4 mr-2" /> {isSavingOocyteRetrieval ? 'Đang lưu...' : 'Lưu'}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default OocyteRetrievalProcedureCard;