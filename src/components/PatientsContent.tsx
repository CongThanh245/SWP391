
import React, { useState, useEffect  } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Search, Filter, Calendar, FileText } from 'lucide-react';
import { Input } from '@components/ui/input';
import { getPatientList } from '@api/doctorApi'
import {formatDate} from '@utils/format'

interface PatientsContentProps {
    onPatientSelect?: (patientId: string) => void;
}

interface Patient {
    id: number;
    patientId: string;
    patientName: string;
    age: number;
    treatmentStatus: string;
    interventionType: string;
    treatmentStage: string;
    lastAppointmentDate: string;
    nextAppointmentDate: string;
}

export const PatientsContent: React.FC<PatientsContentProps> = ({ onPatientSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'waiting' | 'treating' | 'completed'>('all');
    const [stageFilter, setStageFilter] = useState<'all' | 'specialist' | 'intervention' | 'post-intervention'>('all');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [patients, setPatients] = useState<Patient[]>([]);

    useEffect(() => {
        const fetchPatientList = async () => {
            try {
                const data = await getPatientList({
                    name: searchTerm,
                    page: currentPage,
                    size: 4,
                });
                console.log(data);
                setTotalPages(data.totalPages);

                const converted = data.content.map((item, index) => {
                    const last = new Date(item.lastAppointmentDate);
                    const next = new Date(item.nextAppointmentDate);
                    const dateStrLast = formatDate(last.toISOString().split('T')[0]);
                    const dateStrNext = formatDate(next.toISOString().split('T')[0]);

                    return {
                        id: currentPage * 4 + index + 1,
                        patientId: item.patientId,
                        patientName: item.patientName,
                        age: item.age,
                        treatmentStatus: item.treatmentStatus || 'unknown',
                        interventionType: item.interventionType || 'N/A',
                        treatmentStage: item.treatmentStage || 'unknown',
                        lastAppointmentDate: dateStrLast,
                        nextAppointmentDate: dateStrNext
                    };
                });

                setPatients(converted);
            } catch (error) {
                console.error('Error loading patients:', error);
            }
        };

        fetchPatientList();
    }, [searchTerm, statusFilter, currentPage]);



   

    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.patientId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || patient.treatmentStatus === statusFilter;
        const matchesStage = stageFilter === 'all' || patient.treatmentStage === stageFilter;

        return matchesSearch && matchesStatus && matchesStage;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'IN_PROGRESS':
                return <Badge variant="secondary">Chờ khám</Badge>;
            case 'treating':
                return <Badge className="bg-blue-100 text-blue-800">Đang điều trị</Badge>;
            case 'completed':
                return <Badge className="bg-green-100 text-green-800">Hoàn tất</Badge>;
            default:
                return <Badge variant="outline">Chưa biết</Badge>;
        }
    };

    const getStageBadge = (stage: string) => {
        switch (stage) {
            case 'PREPARATION':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Chuyên khoa</Badge>;
            case 'INTERVENTION':
                return <Badge variant="outline" className="bg-purple-50 text-purple-700">Can thiệp</Badge>;
            case 'POST_INTERVENTION':
                return <Badge variant="outline" className="bg-indigo-50 text-indigo-700">Hậu can thiệp</Badge>;
            default:
                return <Badge variant="outline">Chưa có thông tin</Badge>;
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
                    <h1 className="text-3xl font-bold" style={{ color: '#4D3C2D' }}>Danh sách bệnh nhân</h1>
                    <p className="text-gray-600 mt-2">Quản lý thông tin bệnh nhân đang điều trị</p>
                </div>
            </div>

            {/* Filters */}
            <Card className="theme-card">
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[300px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Tìm kiếm theo tên hoặc mã bệnh nhân..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 border-[#D9CAC2] focus:ring-[#4D3C2D]"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4" style={{ color: '#4D3C2D' }} />
                            <span className="text-sm font-medium" style={{ color: '#4D3C2D' }}>Trạng thái:</span>
                            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'waiting' | 'treating' | 'completed')}>
                                <SelectTrigger className="w-40 border-[#D9CAC2] focus:ring-[#4D3C2D]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="waiting">Chờ khám</SelectItem>
                                    <SelectItem value="treating">Đang điều trị</SelectItem>
                                    <SelectItem value="completed">Hoàn tất</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium" style={{ color: '#4D3C2D' }}>Giai đoạn:</span>
                            <Select value={stageFilter} onValueChange={(value) => setStageFilter(value as 'all' | 'specialist' | 'intervention' | 'post-intervention')}>
                                <SelectTrigger className="w-40 border-[#D9CAC2] focus:ring-[#4D3C2D]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="specialist">Chuyên khoa</SelectItem>
                                    <SelectItem value="intervention">Can thiệp</SelectItem>
                                    <SelectItem value="post-intervention">Hậu can thiệp</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Patients List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPatients.map((patient) => (
                    <Card
                        key={patient.id}
                        className="theme-card hover:shadow-lg transition-all cursor-pointer hover:border-[#4D3C2D]"
                        onClick={() => handlePatientClick(patient.patientId)}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg" style={{ color: '#4D3C2D' }}>{patient.patientName}</CardTitle>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <Badge variant="outline" className="text-xs border-[#D9CAC2] text-[#4D3C2D]">{patient.patientId}</Badge>
                                        <span className="text-sm text-gray-600">{patient.age} tuổi</span>
                                    </div>
                                </div>
                                {getStatusBadge(patient.treatmentStatus)}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Giai đoạn:</span>
                                {getStageBadge(patient.treatmentStage)}
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Điều trị:</span>
                                <span className="text-sm font-medium" style={{ color: '#4D3C2D' }}>{patient.interventionType}</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">Khám cuối: {patient.lastAppointmentDate}</span>
                            </div>

                            {patient.nextAppointmentDate && (
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4" style={{ color: '#D9CAC2' }} />
                                    <span className="text-sm" style={{ color: '#4D3C2D' }}>Hẹn tiếp: {patient.nextAppointmentDate}</span>
                                </div>
                            )}

                            <div className="pt-2 border-t" style={{ borderColor: '#D9CAC2' }}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full border-[#D9CAC2] text-[#4D3C2D] hover:bg-[#D9CAC2]"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePatientClick(patient.patientId);
                                    }}
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Xem hồ sơ
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredPatients.length === 0 && (
                <Card className="theme-card">
                    <CardContent className="text-center py-8">
                        <p className="text-gray-500">Không tìm thấy bệnh nhân nào phù hợp với tiêu chí tìm kiếm.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}