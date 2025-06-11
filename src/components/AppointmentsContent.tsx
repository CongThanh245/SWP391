import React, { useState, useEffect } from 'react';
import { Badge } from '@components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Calendar, Filter, FileText } from 'lucide-react';
import { Button } from '@components/ui/button';
import { getDoctorAppointments } from '@api/doctorApi';
import { formatDate } from '@utils/format';
import { Label } from '@components/ui/label'

interface AppointmentsContentProps {
    onPatientSelect?: (patientId: string) => void;
}

interface AppointmentFromApi {
    appointmentDateTime: string;
    appointmentStatus: string;
    patientId: string;
    patientName: string;
}

interface Appointment {
    id: number;
    patientId: string;
    patientName: string;
    date: string;
    time: string;
    purpose: string;
    status: string;
    notes: string;
}

export const AppointmentsContent: React.FC<AppointmentsContentProps> = ({ onPatientSelect }) => {
    const [viewType, setViewType] = useState<'day' | 'week' | 'month'>('day');
    const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'completed'>('all');
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getDoctorAppointments({
                    filterBy: viewType,
                    status: statusFilter,
                    page: currentPage,
                    size: 4,
                });
                console.log(data);
                setTotalPages(data.totalPages);

                const converted = data.content.map((item, index) => {
                    const dt = new Date(item.appointmentDateTime);
                    const dateStr = dt.toISOString().split('T')[0];
                    const timeStr = dt.toTimeString().split(':').slice(0, 2).join(':');

                    return {
                        id: currentPage * 4 + index + 1,
                        patientId: item.patientId,
                        patientName: item.patientName,
                        date: formatDate(dateStr),
                        time: timeStr,
                        purpose: 'Chưa có dữ liệu',
                        status: item.appointmentStatus.toLowerCase(),
                        notes: '...'
                    };
                });

                setAppointments(converted);
            } catch (error) {
                console.error('Error loading appointments:', error);
            }
        };

        fetchAppointments();
    }, [viewType, statusFilter, currentPage]);

    const filteredAppointments = appointments.filter(appointment => {
        if (statusFilter === 'all') return true;
        return appointment.status === statusFilter;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-green-100 text-green-800">Đã xác nhận</Badge>;
            case 'pending':
                return <Badge variant="secondary">Chưa xác nhận</Badge>;
            case 'completed':
                return <Badge className="bg-blue-100 text-blue-800">Đã khám xong</Badge>;
            case 'cancelled':
                return <Badge className="bg-brown-100 text-brown-800">Đã hủy</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handlePatientClick = (patientId: string) => {
        if (onPatientSelect) {
            onPatientSelect(patientId);
        }
    };
    return (
        <div className="space-y-6 theme-gradient-bg min-h-screen p-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: '#4D3C2D' }}>Lịch hẹn</h1>
                    <p className="text-gray-600 mt-2">Quản lý lịch hẹn và cuộc hẹn</p>
                </div>
            </div>

            {/* Filters and View Controls */}
            <Card className="theme-card">
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4" style={{ color: '#4D3C2D' }} />
                            <span className="text-sm font-medium" style={{ color: '#4D3C2D' }}>Xem theo:</span>
                            <Select value={viewType} onValueChange={(value) => setViewType(value as 'day' | 'week' | 'month')}>
                                <SelectTrigger className="w-32 border-[#D9CAC2] focus:ring-[#4D3C2D]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="day">Ngày</SelectItem>
                                    <SelectItem value="week">Tuần</SelectItem>
                                    <SelectItem value="month">Tháng</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium" style={{ color: '#4D3C2D' }}>Trạng thái:</span>
                            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'confirmed' | 'pending' | 'completed')}>
                                <SelectTrigger className="w-40 border-[#D9CAC2] focus:ring-[#4D3C2D]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                                    <SelectItem value="pending">Chưa xác nhận</SelectItem>
                                    <SelectItem value="completed">Đã khám xong</SelectItem>
                                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                            className="border-[#D9CAC2] text-[#4D3C2D] hover:bg-[#D9CAC2]"
                        >
                            Hôm nay
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Calendar View */}
            <Card className="theme-card">
                <CardHeader>
                    <CardTitle style={{ color: '#4D3C2D' }}>
                        Lịch hẹn - {viewType === 'day' ? 'Hôm nay' : viewType === 'week' ? 'Tuần này' : 'Tháng này'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredAppointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md theme-card"
                                onClick={() => handlePatientClick(appointment.patientId)}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="text-center">
                                        <div className="text-lg font-semibold" style={{ color: '#4D3C2D' }}>{appointment.time}</div>
                                        <div className="text-xs text-gray-500">{appointment.date}</div>
                                    </div>
                                    <div className="border-l pl-4" style={{ borderColor: '#D9CAC2' }}>
                                        <div className="font-medium">{appointment.patientName}</div>
                                        <div className="text-sm text-gray-600">{appointment.patientId}</div>
                                        <div className="text-sm" style={{ color: '#4D3C2D' }}>{appointment.purpose}</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {getStatusBadge(appointment.status)}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-[#D9CAC2] text-[#4D3C2D] hover:bg-[#D9CAC2]"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePatientClick(appointment.patientId);
                                        }}
                                    >
                                        <FileText className="h-4 w-4 mr-1" />
                                        Xem hồ sơ
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredAppointments.length === 0 && (
                        <div className="text-center py-8">
                            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-500">Không có lịch hẹn nào phù hợp với bộ lọc.</p>
                        </div>
                    )}
                    {appointments.length > 0 && totalPages > 1 && (
                        <div className="flex justify-center mt-6 space-x-4">
                            <Button
                                disabled={currentPage === 0}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                                variant="outline"
                                size="sm"
                                className="border-[#D9CAC2] text-[#4D3C2D] hover:bg-[#D9CAC2]"
                            >
                                Trước
                            </Button>

                            <Label className="text-[#4D3C2D] font-medium px-4 py-2 rounded-md border border-[#D9CAC2]">
                                Trang {currentPage + 1} / {totalPages}
                            </Label>

                            <Button
                                disabled={currentPage + 1 >= totalPages}
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                                variant="outline"
                                size="sm"
                                className="border-[#D9CAC2] text-[#4D3C2D] hover:bg-[#D9CAC2]"
                            >
                                Tiếp
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};