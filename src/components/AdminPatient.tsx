import { Header } from "@components/AdminHeader";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, FileText, Calendar, Phone, Mail, Upload, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { CSVImportDialog } from "@components/CSVImportDialog";
import React, { useState, useEffect, useCallback } from 'react';
import { getPatients } from '@api/adminApi'
import { formatDate } from '@utils/format'
import { EditPatientDialog } from '@components/EditPatientDialog'
import { PatientDetailsDialog } from '@components/PatientDetailsDialog'
import { DeletePatientsDialog } from '@components/DeletePatientsDialog'
interface Patient {
    id: string;
    patientId: string;
    patientName: string;
    age: number;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    phone: string;
    email: string;
    doctorName: string;
    lastVisit: string;
    nextAppointment: string;
    status: 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

interface ApiResponse {
    content: Patient[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}


const Patients = () => {
    const [finalImportStatus, setFinalImportStatus] = useState<'success' | 'failed' | null>(null);
    const [finalImportMessage, setFinalImportMessage] = useState<string>('');
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPatients, setSelectedPatients] = useState<string[]>([]);

    const [patientsData, setPatientsData] = useState<Patient[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // Function to fetch patients, now accepting page, size, and search
    const fetchPatients = useCallback(async () => {
        setLoading(true);
        setError(null);

        const params = {
            search: searchQuery,
            page: String(currentPage), // Convert to string as per Record<string, string>
            size: String(pageSize),    // Convert to string
        };

        try {
            const response: ApiResponse = await getPatients(params);
            setPatientsData(response.content);
            setTotalElements(response.totalElements);
            setTotalPages(response.totalPages);
            setCurrentPage(response.number); // Ensure currentPage is in sync with API's returned page
            setPageSize(response.size);      // Ensure pageSize is in sync with API's returned size
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'An unknown error occurred while fetching patients.';
            setError(message);
            console.error("Failed to fetch patients:", err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, searchQuery]); // Dependencies for useCallback

    // Fetch data whenever currentPage, pageSize, or searchQuery changes
    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]); // Dependency array includes fetchPatients (due to useCallback)

    // Handlers for pagination
    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page - 1); // Convert 1-indexed page from UI to 0-indexed for API
    };

    const renderPaginationLinks = () => {
        const links = [];
        const maxPagesToShow = 5;
        const startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

        if (startPage > 0) {
            links.push(
                <PaginationItem key="1">
                    <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
                </PaginationItem>
            );
            if (startPage > 1) {
                links.push(<PaginationItem key="ellipsis-start"><PaginationEllipsis /></PaginationItem>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            links.push(
                <PaginationItem key={i}>
                    <PaginationLink onClick={() => handlePageChange(i + 1)} isActive={currentPage === i}>
                        {i + 1}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        if (endPage < totalPages - 1) {
            if (endPage < totalPages - 2) {
                links.push(<PaginationItem key="ellipsis-end"><PaginationEllipsis /></PaginationItem>);
            }
            links.push(
                <PaginationItem key={totalPages - 1}>
                    <PaginationLink onClick={() => handlePageChange(totalPages)}>{totalPages}</PaginationLink>
                </PaginationItem>
            );
        }
        return links;
    };


    if (loading) {
        return <div>Loading patients...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    const formatGender = (gender: 'MALE' | 'FEMALE' | 'PREFER_NOT_TO_SAY' | 'OTHER'): string => {
        switch (gender) {
            case 'MALE':
                return 'Male';
            case 'FEMALE':
                return 'Female';
            case 'PREFER_NOT_TO_SAY':
                return 'Prefer not to say';
            case 'OTHER':
                return 'Other';
            default:
                return 'Unknown'; // Fallback for any unexpected values
        }
    };
    const handleUpdatePatient = (updatedPatient) => {
        console.log("Patient updated:", updatedPatient);
    };

    const handleDeletePatients = (patientIds: string[]) => {
        setPatientsData(prevData =>
            prevData.filter(patient => !patientIds.includes(patient.id))
        );
        setSelectedPatients([]);
    };

    const handleSelectPatient = (patientId: string) => {
        setSelectedPatients(prev =>
            prev.includes(patientId)
                ? prev.filter(id => id !== patientId)
                : [...prev, patientId]
        );
    };

    const handleSelectAll = () => {
        if (selectedPatients.length === patientsData.length) {
            setSelectedPatients([]);
        } else {
            setSelectedPatients(patientsData.map(patient => patient.id));
        }
    };

    const csvTemplateFields = ["Name", "Age", "Gender", "Phone", "Email", "Address", "Doctor", "Condition", "Medical History", "Allergies", "Emergency Contact"];
    const csvSampleData = [
        {
            Name: "Jane Smith",
            Age: "29",
            Gender: "Female",
            Phone: "+1 555-123-4567",
            Email: "jane.smith@email.com",
            Address: "123 Main St, Boston, MA",
            Doctor: "Dr. Petra Winsbury",
            Condition: "Fertility Consultation",
            "Medical History": "None",
            Allergies: "None",
            "Emergency Contact": "John Smith - +1 555-123-4568"
        },
        {
            Name: "Mary Johnson",
            Age: "34",
            Gender: "Female",
            Phone: "+1 555-234-5678",
            Email: "mary.johnson@email.com",
            Address: "456 Oak Ave, Cambridge, MA",
            Doctor: "Dr. Olivia Martinez",
            Condition: "PCOS Treatment",
            "Medical History": "PCOS",
            Allergies: "Penicillin",
            "Emergency Contact": "Robert Johnson - +1 555-234-5679"
        }
    ];



    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
            case "IN_PROGRESS":
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">In Treatment</Badge>;
            case "COMPLETED":
                return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Completed</Badge>;
            case "CANCELLED":
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Inactive</Badge>;
            default:
                return <Badge variant="secondary">Planned</Badge>;
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Header title="Patients" subtitle="Manage patient records and medical information" />

            <div className="flex-1 overflow-auto p-6">
                <Tabs defaultValue="all" className="space-y-6">
                    <div className="flex justify-between items-center">
                        
                        <div className="flex gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Search patients..."
                                    className="pl-10 w-80"
                                    value={searchQuery} // Bind value to searchQuery state
                                    onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on change
                                />
                            </div>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Filter by doctor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Doctors</SelectItem>
                                    <SelectItem value="petra">Dr. Petra Winsbury</SelectItem>
                                    <SelectItem value="olivia">Dr. Olivia Martinez</SelectItem>
                                    <SelectItem value="damian">Dr. Damian Sanchez</SelectItem>
                                </SelectContent>
                            </Select>
                            {selectedPatients.length > 0 && (
                                <DeletePatientsDialog
                                    patientIds={selectedPatients}
                                    patientNames={selectedPatients.map(id =>
                                        patientsData.find(p => p.id === id)?.patientName || ''
                                    )}
                                    onDelete={handleDeletePatients}
                                />
                            )}
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Patient
                            </Button>
                        </div>
                    </div>

                    <TabsContent value="all">
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="w-12">
                                                <input
                                                    type="checkbox"
                                                    className="rounded"
                                                    checked={selectedPatients.length === patientsData.length}
                                                    onChange={handleSelectAll}
                                                />
                                            </TableHead>
                                            <TableHead>Patient Info</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Doctor</TableHead>
                                            <TableHead>Last Visit</TableHead>
                                            <TableHead>Next Appointment</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {patientsData.map((patient, index) => (
                                            <TableRow key={patient.id} className="hover:bg-muted/50">
                                                <TableCell>
                                                    <input
                                                        type="checkbox"
                                                        className="rounded"
                                                        checked={selectedPatients.includes(patient.id)}
                                                        onChange={() => handleSelectPatient(patient.id)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="w-10 h-10">
                                                            <AvatarImage src="/placeholder.svg" />
                                                            <AvatarFallback className="text-sm font-medium">
                                                                {patient.patientName.split(' ').map(n => n[0]).join('')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{patient.patientName}</div>
                                                            <div className="text-sm text-muted-foreground">{patient.patientId}</div>
                                                            <div className="text-sm text-muted-foreground">{patient.age} years, {formatGender(patient.gender)}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Phone className="w-3 h-3 text-muted-foreground" />
                                                            <span className="font-mono">{patient.phone}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Mail className="w-3 h-3" />
                                                            <span>{patient.email}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium text-sm">{patient.doctorName}</div>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="text-sm font-medium">{formatDate(patient.lastVisit)}</div>
                                                </TableCell>
                                                <TableCell>
                                                    {patient.nextAppointment ? (
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-blue-500" />
                                                            <span className="text-sm font-medium">{formatDate(patient.nextAppointment)}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground italic">Not scheduled</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>{getStatusBadge(patient.status)}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="hover:bg-muted">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-popover">
                                                            <DropdownMenuItem asChild>
                                                                <PatientDetailsDialog patient={patient} />
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <EditPatientDialog patient={patient} onUpdate={handleUpdatePatient} />
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                        <DropdownMenuContent align="end" className="bg-popover">
                                                            <DropdownMenuItem asChild>
                                                                <DeletePatientsDialog
                                                                    patientIds={[patient.id]}
                                                                    patientNames={[patient.patientName]}
                                                                    onDelete={handleDeletePatients}
                                                                    trigger={
                                                                        <Button variant="ghost" size="sm" className="justify-start w-full">
                                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                                            Delete Patient
                                                                        </Button>
                                                                    }
                                                                />
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <div className="flex items-center justify-between p-6 border-t border-border bg-muted/20">
                                    <div className="text-sm text-muted-foreground font-medium">
                                        Showing {patientsData.length} out of {totalElements} patients
                                        {selectedPatients.length > 0 && (
                                            <span className="ml-2 text-primary">
                                                ({selectedPatients.length} selected)
                                            </span>
                                        )}
                                    </div>
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    onClick={handlePreviousPage}
                                                    className={currentPage === 0 ? 'pointer-events-none opacity-50' : ''}
                                                />
                                            </PaginationItem>
                                            {renderPaginationLinks()}
                                            <PaginationItem>
                                                <PaginationNext
                                                    onClick={handleNextPage}
                                                    className={currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : ''}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="active">
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center py-12">
                                    <h3 className="text-lg font-medium mb-2">Active Patients</h3>
                                    <p className="text-muted-foreground">Patients currently receiving treatment</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="treatment">
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center py-12">
                                    <h3 className="text-lg font-medium mb-2">Patients In Treatment</h3>
                                    <p className="text-muted-foreground">Patients currently undergoing active treatment protocols</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="completed">
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center py-12">
                                    <h3 className="text-lg font-medium mb-2">Completed Treatments</h3>
                                    <p className="text-muted-foreground">Patients who have completed their treatment successfully</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Patients;