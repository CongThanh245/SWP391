
import { Header } from "@components/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Users, Star, Clock } from "lucide-react";
import {getDoctorDetails} from '@api/adminApi'
import React, { useEffect, useState } from 'react';
interface DoctorDetailsProps {
  doctorId: string;
  onClose: () => void;
}

interface FullDoctorDetails {
  id: string;
  doctorId: string;
  doctorName: string;
  gender: "MALE" | "FEMALE" | "OTHER" | string;
  degree: string;
  doctorAddress: string;
  phoneNumber: string;
  joinDate: string;
  dateOfBirth: string;
  yearOfExperience: number;
  about: string | null;
  email: string;
  licenseNumber: string;
  specialization: "IUI_SPECIALIST" | "IVF_SPECIALIST" | "GENERAL" | string;
  todayAppointments: number;
  totalPatients: number;
  appointment: string;
  imageProfile: string | null;
  available: string;
  active: string;
}
interface AppointmentStats {
  total: number;
  newPatients: number;
  followUp: number;
}
interface WorkExperience {
  position: string;
  hospital: string;
  period: string;
  type: string;
}



const DoctorDetails: React.FC<DoctorDetailsProps> = ({ doctorId, onClose }) => {

  const [doctorData, setDoctorData] = useState<FullDoctorDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const doctorData = {
  //   id: "WNH-GM-001",
  //   name: "Dr. Petra Winsbury",
  //   department: "General Medicine",
  //   specialist: "Routine Check-Ups",
  //   status: "Available",
  //   avatar: "PW",
  //   phone: "+1 555-234-5678",
  //   email: "petra.wins@wellnesthospital.com",
  //   address: "WellNest Hospital, 456 Elm Street, Springfield, IL, USA",
  //   about: "Dr. Petra Winsbury is a seasoned general medicine practitioner with over 15 years of experience in providing comprehensive healthcare services. He is dedicated to ensuring the overall well-being of his patients through routine check-ups and preventive care.",
  //   totalPatients: 150,
  //   totalAppointments: 320,
  //   workExperience: [
  //     {
  //       position: "General Practitioner",
  //       hospital: "WellNest Hospital",
  //       period: "2010 - Present",
  //       type: "Full-Time"
  //     },
  //     {
  //       position: "Resident Doctor",
  //       hospital: "City Hospital",
  //       period: "2005 - 2010",
  //       type: "Full-Time"
  //     }
  //   ]
  // };
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      const data = await getDoctorDetails(doctorId); // Hàm của bạn trả về response.data
        if (data) {
          setDoctorData(data);
          setLoading(false);
        } else {
          setError("Không tìm thấy thông tin chi tiết cho bác sĩ này.");
          setDoctorData(null);
        }
    }
    if (doctorId) {
      fetchDoctorDetails();
    }
  }, [doctorId]);
  
  const appointmentStats = {
    total: doctorData?.totalPatients ? doctorData.todayAppointments + 20 : 50, // Example calculation
    newPatients: doctorData?.totalPatients ? doctorData.todayAppointments / 2 : 22,
    followUp: doctorData?.totalPatients ? doctorData.todayAppointments / 2 : 28
  };

  const weeklySchedule = [
    { day: "Monday", appointments: 12, newPatients: 6, followUp: 5 },
    { day: "Tuesday", appointments: 9, newPatients: 5, followUp: 4 },
    { day: "Wednesday", appointments: 6, newPatients: 3, followUp: 3 },
    { day: "Thursday", appointments: 3, newPatients: 1, followUp: 2 },
    { day: "Friday", appointments: 6, newPatients: 2, followUp: 4 },
    { day: "Saturday", appointments: 3, newPatients: 1, followUp: 2 }
  ];

  const todaySchedule = [
    { patient: "Rupert Twinny", type: "Routine Check-Up", time: "09:00 AM" },
    { patient: "Ruth Herdinger", type: "Follow-Up Visit", time: "10:00 AM" },
    { patient: "Caren G. Simpson", type: "Routine Check-Up", time: "11:00 AM" },
    { patient: "Staff Meeting", type: "Meeting", time: "01:00 PM" },
    { patient: "Administrative Work", type: "Task", time: "03:00 PM" }
  ];

  const feedback = [
    {
      name: "Alice Johnson",
      date: "2028-07-01",
      avatar: "AJ",
      comment: "Dr. Winsbury is very thorough and caring. He took the time to explain my condition and treatment options in detail. I felt very comfortable and well taken care of during my visit."
    },
    {
      name: "Robert Brown",
      date: "2028-06-25",
      avatar: "RB",
      comment: "Great experience, highly recommend Dr. Winsbury. He is attentive and professional, ensuring that all my questions were answered. His expertise make him a great doctor."
    },
    {
      name: "Chance Siphron",
      date: "2028-06-11",
      avatar: "CS",
      comment: "Dr. Winsbury is efficient, professional, and skilled. He quickly diagnosed my issue, provided a clear treatment plan, and I'm happy with the positive outcome. I highly recommend him."
    },
    {
      name: "Lincoln Donin",
      date: "2028-05-27",
      avatar: "LD",
      comment: "Dr. Winsbury is an exceptional physician who combines deep knowledge with genuine care, addressing all my concerns and making patients feel understood."
    }
  ];



  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Available</Badge>;
      case "Busy":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Busy</Badge>;
      case "Unavailable":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Unavailable</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-[#EAE4E1]">
        <Header title="Doctor Details" subtitle="Complete doctor profile and schedule information" />
        <div className="flex-1 overflow-auto p-6 flex justify-center items-center">
          <p className="text-[#4D3C2D]/70">Đang tải chi tiết bác sĩ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-[#EAE4E1]">
        <Header title="Doctor Details" subtitle="Complete doctor profile and schedule information" />
        <div className="flex-1 overflow-auto p-6 flex flex-col justify-center items-center text-red-600">
          <p className="mb-4">{error}</p>
          <Button
            onClick={onClose}
            className="border-[#4D3C2D] text-[#4D3C2D] hover:bg-[#4D3C2D] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách bác sĩ
          </Button>
        </div>
      </div>
    );
  }

  if (!doctorData) { // Nếu đã load xong (loading=false) và không có lỗi, nhưng doctorData vẫn null
    return (
      <div className="flex flex-col h-screen bg-[#EAE4E1]">
        <Header title="Doctor Details" subtitle="Complete doctor profile and schedule information" />
        <div className="flex-1 overflow-auto p-6 flex flex-col justify-center items-center text-[#4D3C2D]/70">
          <p className="mb-4">Không tìm thấy dữ liệu bác sĩ. Vui lòng kiểm tra ID.</p>
          <Button
            onClick={onClose}
            className="border-[#4D3C2D] text-[#4D3C2D] hover:bg-[#4D3C2D] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách bác sĩ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#EAE4E1]">
      <Header
        title="Doctor Details"
        subtitle="Complete doctor profile and schedule information"
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onClose}
            className="mb-4 text-[#4D3C2D] hover:bg-[#D9CAC2]/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Doctors List
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doctor Profile */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 border-[#D9CAC2]">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-[#D9CAC2]">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-2xl bg-[#D9CAC2] text-[#4D3C2D]">
                      {doctorData.doctorName.split(' ').map(n => n[0]).join('').toUpperCase() || 'DR'}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold mb-2 text-[#4D3C2D]">{doctorData.doctorName}</h2>
                  <p className="text-[#4D3C2D]/60 mb-2">{doctorData.doctorId}</p>
                  {getStatusBadge(doctorData.available)}
                </div>

                <div className="space-y-4">
                  <div className="bg-[#EAE4E1]/50 rounded-lg p-4">
                    <h3 className="font-medium mb-2 text-[#4D3C2D]">Department</h3>
                    <p className="text-sm text-[#4D3C2D]/70">Ferticare</p>
                  </div>

                  <div className="bg-[#EAE4E1]/50 rounded-lg p-4">
                    <h3 className="font-medium mb-2 text-[#4D3C2D]">Specialist</h3>
                    <p className="text-sm text-[#4D3C2D]/70">{doctorData.specialization.replace(/_/g, ' ')}</p>
                  </div>

                  <div className="bg-[#EAE4E1]/50 rounded-lg p-4">
                    <h3 className="font-medium mb-2 text-[#4D3C2D]">About</h3>
                    <p className="text-sm text-[#4D3C2D]/70">
                       Dr. {doctorData.doctorName} có {doctorData.yearOfExperience} năm kinh nghiệm.
                    </p>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                      <Phone className="w-4 h-4 text-[#4D3C2D]" />
                      <span className="text-sm text-[#4D3C2D]">{doctorData.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                      <Mail className="w-4 h-4 text-[#4D3C2D]" />
                      <span className="text-sm text-[#4D3C2D]">{doctorData.email}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                      <MapPin className="w-4 h-4 text-[#4D3C2D]" />
                      <span className="text-sm text-[#4D3C2D]">{doctorData.doctorAddress}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Work Experience */}
            {/* <Card className="mt-6 bg-white/90 border-[#D9CAC2]">
              <CardHeader>
                <CardTitle className="text-lg text-[#4D3C2D]">Work Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workExperience.map((exp, index) => (
                    <div key={index} className="flex gap-3 p-3 bg-[#EAE4E1]/30 rounded-lg">
                      <div className="w-8 h-8 bg-[#4D3C2D]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-[#4D3C2D] rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-medium text-[#4D3C2D]">{exp.position}</h4>
                        <p className="text-sm text-[#4D3C2D]/70">{exp.hospital}</p>
                        <p className="text-xs text-[#4D3C2D]/60">{exp.type} • {exp.period}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/90 border-[#D9CAC2]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#4D3C2D]/10 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#4D3C2D]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#4D3C2D]/70">Total Patients</p>
                      <p className="text-2xl font-bold text-[#4D3C2D]">{doctorData.totalPatients}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 border-[#D9CAC2]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#4D3C2D]/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-[#4D3C2D]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#4D3C2D]/70">Total Appointments</p>
                      <p className="text-2xl font-bold text-[#4D3C2D]">{doctorData.todayAppointments}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Appointment Stats */}
            <Card className="bg-white/90 border-[#D9CAC2]">
              <CardHeader>
                <CardTitle className="text-[#4D3C2D]">Appointment Stats</CardTitle>
                <p className="text-sm text-[#4D3C2D]/70">Wed, 19 Jul 28</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-[#EAE4E1]/30 rounded-lg">
                    <div className="text-2xl font-bold text-[#4D3C2D]">{appointmentStats.total}</div>
                    <div className="text-sm text-[#4D3C2D]/70">Total Appointments</div>
                  </div>
                  <div className="text-center p-4 bg-[#EAE4E1]/30 rounded-lg">
                    <div className="text-2xl font-bold text-[#4D3C2D]">{appointmentStats.newPatients}</div>
                    <div className="text-sm text-[#4D3C2D]/70">New Patients</div>
                  </div>
                  <div className="text-center p-4 bg-[#EAE4E1]/30 rounded-lg">
                    <div className="text-2xl font-bold text-[#4D3C2D]">{appointmentStats.followUp}</div>
                    <div className="text-sm text-[#4D3C2D]/70">Follow-Up Patients</div>
                  </div>
                </div>

                {/* Weekly Chart */}
                <div className="mt-6">
                  <div className="flex items-end justify-between h-40 gap-2">
                    {weeklySchedule.map((day, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="w-full flex flex-col gap-1 mb-2">
                          <div
                            className="bg-[#D9CAC2] rounded-t"
                            style={{ height: `${(day.newPatients / 12) * 100}px` }}
                          ></div>
                          <div
                            className="bg-[#4D3C2D]/60 rounded-b"
                            style={{ height: `${(day.followUp / 12) * 100}px` }}
                          ></div>
                        </div>
                        <div className="text-xs text-center text-[#4D3C2D]/70">
                          {day.day.substring(0, 3)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#D9CAC2] rounded"></div>
                      <span className="text-[#4D3C2D]">New Patient</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#4D3C2D]/60 rounded"></div>
                      <span className="text-[#4D3C2D]">Follow-Up Patient</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feedback */}
            <Card className="bg-white/90 border-[#D9CAC2]">
              <CardHeader>
                <CardTitle className="text-[#4D3C2D]">Patient Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feedback.map((item, index) => (
                    <div key={index} className="border border-[#D9CAC2] rounded-lg p-4 bg-white/50">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-[#D9CAC2] text-[#4D3C2D]">{item.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-[#4D3C2D]">{item.name}</div>
                          <div className="text-sm text-[#4D3C2D]/60">{item.date}</div>
                        </div>
                      </div>
                      <p className="text-sm text-[#4D3C2D]/70">{item.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 border-[#D9CAC2]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#4D3C2D]">Today's Schedule</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="border-[#D9CAC2] text-[#4D3C2D]">17</Button>
                    <Button variant="outline" size="sm" className="border-[#D9CAC2] text-[#4D3C2D]">18</Button>
                    <Button variant="outline" size="sm" className="border-[#D9CAC2] text-[#4D3C2D]">19</Button>
                    <Button size="sm" className="bg-[#4D3C2D] text-white">20</Button>
                    <Button variant="outline" size="sm" className="border-[#D9CAC2] text-[#4D3C2D]">21</Button>
                  </div>
                </div>
                <p className="text-sm text-[#4D3C2D]/70">Wednesday, 20 July</p>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-[#4D3C2D]/70 mb-4">5 schedules today</div>
                <div className="space-y-3">
                  {todaySchedule.map((schedule, index) => (
                    <div key={index} className="p-3 border border-[#D9CAC2] rounded-lg bg-[#EAE4E1]/30">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-sm text-[#4D3C2D]">{schedule.patient}</div>
                        <div className="text-xs text-[#4D3C2D]/60 bg-white/70 px-2 py-1 rounded">{schedule.time}</div>
                      </div>
                      <div className="text-xs text-[#4D3C2D]/70">{schedule.type}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;