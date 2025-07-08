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
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, FileText, Calendar, Phone, Mail, Upload } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { CSVImportDialog } from "@components/CSVImportDialog";
import React, { useState, useEffect, useCallback } from 'react';

const Patients = () => {
    const [finalImportStatus, setFinalImportStatus] = useState<'success' | 'failed' | null>(null);
    const [finalImportMessage, setFinalImportMessage] = useState<string>('');
    const [showImportDialog, setShowImportDialog] = useState(false);
     const [loading, setLoading] = useState(true);
    const patientsData = [
        {
            id: "WNH-PT-001",
            name: "Sarah Johnson",
            age: 32,
            gender: "Female",
            phone: "+1 555-123-4567",
            email: "sarah.johnson@email.com",
            address: "123 Main St, Boston, MA",
            lastVisit: "2024-01-15",
            nextAppointment: "2024-01-25",
            doctor: "Dr. Petra Winsbury",
            status: "Active",
            condition: "Infertility Treatment",
            treatmentPlan: "IVF Protocol",
            medicalHistory: "PCOS, Previous miscarriage",
            allergies: "Penicillin",
            emergencyContact: "John Johnson - +1 555-123-4568"
        },
        {
            id: "WNH-PT-002",
            name: "Maria Garcia",
            age: 28,
            gender: "Female",
            phone: "+1 555-234-5678",
            email: "maria.garcia@email.com",
            address: "456 Oak Ave, Cambridge, MA",
            lastVisit: "2024-01-10",
            nextAppointment: "2024-01-22",
            doctor: "Dr. Olivia Martinez",
            status: "Active",
            condition: "Fertility Consultation",
            treatmentPlan: "IUI Preparation",
            medicalHistory: "Endometriosis",
            allergies: "None",
            emergencyContact: "Carlos Garcia - +1 555-234-5679"
        },
        {
            id: "WNH-PT-003",
            name: "Emily Chen",
            age: 35,
            gender: "Female",
            phone: "+1 555-345-6789",
            email: "emily.chen@email.com",
            address: "789 Pine St, Somerville, MA",
            lastVisit: "2024-01-08",
            nextAppointment: "2024-01-28",
            doctor: "Dr. Damian Sanchez",
            status: "In Treatment",
            condition: "Recurrent Pregnancy Loss",
            treatmentPlan: "Comprehensive Testing",
            medicalHistory: "3 miscarriages, Thyroid disorder",
            allergies: "Shellfish",
            emergencyContact: "David Chen - +1 555-345-6790"
        },
        {
            id: "WNH-PT-004",
            name: "Jessica Brown",
            age: 30,
            gender: "Female",
            phone: "+1 555-456-7890",
            email: "jessica.brown@email.com",
            address: "321 Elm St, Newton, MA",
            lastVisit: "2024-01-12",
            nextAppointment: "",
            doctor: "Dr. Chloe Harrington",
            status: "Completed",
            condition: "Successful Pregnancy",
            treatmentPlan: "Post-treatment Follow-up",
            medicalHistory: "Male factor infertility",
            allergies: "Latex",
            emergencyContact: "Michael Brown - +1 555-456-7891"
        },
        {
            id: "WNH-PT-005",
            name: "Amanda Wilson",
            age: 33,
            gender: "Female",
            phone: "+1 555-567-8901",
            email: "amanda.wilson@email.com",
            address: "654 Maple Dr, Brookline, MA",
            lastVisit: "2024-01-14",
            nextAppointment: "2024-01-26",
            doctor: "Dr. Emily Smith",
            status: "Active",
            condition: "PCOS Treatment",
            treatmentPlan: "Ovulation Induction",
            medicalHistory: "PCOS, Insulin resistance",
            allergies: "Sulfa drugs",
            emergencyContact: "Robert Wilson - +1 555-567-8902"
        }
    ];

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
            case "Active":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
            case "In Treatment":
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">In Treatment</Badge>;
            case "Completed":
                return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Completed</Badge>;
            case "Inactive":
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Inactive</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Header title="Patients" subtitle="Manage patient records and medical information" />

            <div className="flex-1 overflow-auto p-6">
                <Tabs defaultValue="all" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <TabsList className="grid w-fit grid-cols-4">
                            <TabsTrigger value="all">All Patients (85)</TabsTrigger>
                            <TabsTrigger value="active">Active (45)</TabsTrigger>
                            <TabsTrigger value="treatment">In Treatment (25)</TabsTrigger>
                            <TabsTrigger value="completed">Completed (15)</TabsTrigger>
                        </TabsList>
                        <div className="flex gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Search patients..."
                                    className="pl-10 w-80"
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
                                                <input type="checkbox" className="rounded" />
                                            </TableHead>
                                            <TableHead>Patient Info</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Doctor</TableHead>
                                            <TableHead>Condition</TableHead>
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
                                                    <input type="checkbox" className="rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="w-10 h-10">
                                                            <AvatarImage src="/placeholder.svg" />
                                                            <AvatarFallback className="text-sm font-medium">
                                                                {patient.name.split(' ').map(n => n[0]).join('')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{patient.name}</div>
                                                            <div className="text-sm text-muted-foreground">{patient.id}</div>
                                                            <div className="text-sm text-muted-foreground">{patient.age} years, {patient.gender}</div>
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
                                                    <div className="font-medium text-sm">{patient.doctor}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium text-sm">{patient.condition}</div>
                                                        <div className="text-sm text-muted-foreground">{patient.treatmentPlan}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm font-medium">{patient.lastVisit}</div>
                                                </TableCell>
                                                <TableCell>
                                                    {patient.nextAppointment ? (
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-blue-500" />
                                                            <span className="text-sm font-medium">{patient.nextAppointment}</span>
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
                                                            <DropdownMenuItem>
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <FileText className="w-4 h-4 mr-2" />
                                                                Medical Records
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Calendar className="w-4 h-4 mr-2" />
                                                                Schedule Appointment
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Edit className="w-4 h-4 mr-2" />
                                                                Edit Patient
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
                                        Showing 5 out of 85 patients
                                    </div>
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious href="#" />
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationLink href="#" isActive>1</PaginationLink>
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationLink href="#">2</PaginationLink>
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationLink href="#">3</PaginationLink>
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationLink href="#">17</PaginationLink>
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationNext href="#" />
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