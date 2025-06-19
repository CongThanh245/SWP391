import { Header } from "@components/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Calendar, Users, UserCheck, TrendingUp, TrendingDown, Clock, MapPin, Activity, Heart, AlertTriangle, CheckCircle, XCircle, Star, FileText, Phone, Mail } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";
import { AddScheduleDialog } from "@components/AddScheduleDialog";
import { useState } from "react";

const Dashboard = () => {
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);

  // Core hospital metrics for fertility treatment
  const statsData = [
    { title: "Total Patients", value: "1,247", change: "+8.2%", trend: "up", icon: Users, subtitle: "Active treatment patients" },
    { title: "Daily Appointments", value: "32", change: "+5.1%", trend: "up", icon: Calendar, subtitle: "Today's consultations" },
    { title: "Treatment Success Rate", value: "68%", change: "+2.3%", trend: "up", icon: Heart, subtitle: "IVF success this month" },
    { title: "Available Doctors", value: "18", change: "0%", trend: "stable", icon: UserCheck, subtitle: "Currently on duty" },
  ];

  // Treatment methods success rates for the week
  const treatmentSuccessData = [
    { name: "IVF", successful: 45, total: 67, rate: 67.2 },
    { name: "IUI", successful: 28, total: 52, rate: 53.8 },
    { name: "ICSI", successful: 31, total: 42, rate: 73.8 },
    { name: "FET", successful: 22, total: 35, rate: 62.9 },
    { name: "Natural Cycle", successful: 12, total: 28, rate: 42.9 },
  ];

  // Patient overview by treatment type over the week
  const weeklyTreatmentData = [
    { day: "Mon", IVF: 12, IUI: 8, ICSI: 6, Consultation: 15 },
    { day: "Tue", IVF: 15, IUI: 10, ICSI: 8, Consultation: 18 },
    { day: "Wed", IVF: 10, IUI: 12, ICSI: 5, Consultation: 20 },
    { day: "Thu", IVF: 18, IUI: 9, ICSI: 7, Consultation: 16 },
    { day: "Fri", IVF: 14, IUI: 11, ICSI: 9, Consultation: 22 },
    { day: "Sat", IVF: 8, IUI: 6, ICSI: 4, Consultation: 12 },
    { day: "Sun", IVF: 5, IUI: 4, ICSI: 2, Consultation: 8 },
  ];

  // Doctor schedule for today
  const todayDoctorSchedule = [
    {
      doctor: "Dr. Petra Winsbury",
      specialty: "Reproductive Endocrinology",
      time: "08:00 - 16:00",
      status: "Available",
      appointments: 8,
      avatar: "PW",
      nextPatient: "Sarah Johnson - IVF Consultation"
    },
    {
      doctor: "Dr. Olivia Martinez",
      specialty: "Fertility Surgery",
      time: "09:00 - 17:00",
      status: "In Surgery",
      appointments: 6,
      avatar: "OM",
      nextPatient: "Laparoscopy procedure"
    },
    {
      doctor: "Dr. Damian Sanchez",
      specialty: "Andrology",
      time: "10:00 - 18:00",
      status: "Available",
      appointments: 5,
      avatar: "DS",
      nextPatient: "Male fertility assessment"
    },
    {
      doctor: "Dr. Emily Chen",
      specialty: "Genetic Counseling",
      time: "08:30 - 16:30",
      status: "Break",
      appointments: 4,
      avatar: "EC",
      nextPatient: "Returns at 14:00"
    },
  ];

  // Reports and feedback requests
  const recentReports = [
    { type: "Patient Feedback", message: "Treatment satisfaction survey results", time: "5 minutes ago", priority: "medium", icon: Star },
    { type: "Equipment Alert", message: "Ultrasound machine requires calibration", time: "15 minutes ago", priority: "high", icon: AlertTriangle },
    { type: "Protocol Update", message: "New IVF stimulation protocol approved", time: "1 hour ago", priority: "medium", icon: FileText },
    { type: "Staff Request", message: "Additional embryologist needed for weekend", time: "2 hours ago", priority: "low", icon: Users },
  ];

  // Today's appointments overview
  const appointmentsByType = [
    { type: "New Consultations", count: 12, color: "#4D3C2D" },
    { type: "Follow-up", count: 8, color: "#D9CAC2" },
    { type: "Procedures", count: 6, color: "#B8A598" },
    { type: "Emergency", count: 2, color: "#E74C3C" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Available</Badge>;
      case "In Surgery":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">In Surgery</Badge>;
      case "Break":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Break</Badge>;
      case "Unavailable":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Unavailable</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#EAE4E1]">
      <Header title="Fertility Center Dashboard" subtitle="Real-time overview of hospital operations and treatment progress" />
      
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <Card key={index} className="bg-white/90 border-[#D9CAC2] hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#4D3C2D]/70">{stat.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-3xl font-bold text-[#4D3C2D]">{stat.value}</span>
                      <div className={`flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                        {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : stat.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : null}
                        <span className="text-xs font-medium">{stat.change}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#4D3C2D]/60 mt-1">{stat.subtitle}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#4D3C2D]/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-[#4D3C2D]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Treatment Overview */}
          <Card className="lg:col-span-2 bg-white/90 border-[#D9CAC2]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#4D3C2D]">Weekly Treatment Overview</CardTitle>
                  <p className="text-sm text-[#4D3C2D]/70">Patient distribution by treatment type</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-[#D9CAC2] text-[#4D3C2D]">Week</Button>
                  <Button variant="outline" size="sm" className="border-[#D9CAC2] text-[#4D3C2D]">Month</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyTreatmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D9CAC2" />
                  <XAxis dataKey="day" stroke="#4D3C2D" />
                  <YAxis stroke="#4D3C2D" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #D9CAC2",
                      borderRadius: "8px",
                      color: "#4D3C2D"
                    }}
                  />
                  <Area dataKey="IVF" stackId="1" fill="#4D3C2D" />
                  <Area dataKey="IUI" stackId="1" fill="#D9CAC2" />
                  <Area dataKey="ICSI" stackId="1" fill="#B8A598" />
                  <Area dataKey="Consultation" stackId="1" fill="#EAE4E1" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Treatment Success Rates */}
          <Card className="bg-white/90 border-[#D9CAC2]">
            <CardHeader>
              <CardTitle className="text-[#4D3C2D]">Treatment Success Rates</CardTitle>
              <p className="text-sm text-[#4D3C2D]/70">This week's performance</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {treatmentSuccessData.map((treatment, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#4D3C2D]">{treatment.name}</span>
                      <span className="text-sm text-[#4D3C2D]/70">{treatment.rate}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#EAE4E1] rounded-full h-2">
                        <div 
                          className="bg-[#4D3C2D] h-2 rounded-full" 
                          style={{ width: `${treatment.rate}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-[#4D3C2D]/60">{treatment.successful}/{treatment.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doctor Schedule Today */}
          <Card className="bg-white/90 border-[#D9CAC2]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#4D3C2D]">Today's Doctor Schedule</CardTitle>
                  <p className="text-sm text-[#4D3C2D]/70">Current status and availability</p>
                </div>
                <Button size="sm" onClick={() => setIsAddScheduleOpen(true)} className="bg-[#4D3C2D] hover:bg-[#4D3C2D]/90">
                  <Calendar className="w-4 h-4 mr-2" />
                  Add Schedule
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayDoctorSchedule.map((schedule, index) => (
                <div key={index} className="p-4 rounded-lg border border-[#D9CAC2] bg-[#EAE4E1]/30">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#4D3C2D] rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">{schedule.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[#4D3C2D] text-sm">{schedule.doctor}</div>
                      <div className="text-xs text-[#4D3C2D]/60">{schedule.specialty}</div>
                      <div className="text-xs text-[#4D3C2D]/60 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {schedule.time} | {schedule.appointments} appointments
                      </div>
                      <div className="text-xs text-[#4D3C2D]/80 mt-1">{schedule.nextPatient}</div>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusBadge(schedule.status)}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          <Card className="bg-white/90 border-[#D9CAC2]">
            <CardHeader>
              <CardTitle className="text-[#4D3C2D]">Today's Appointments</CardTitle>
              <p className="text-sm text-[#4D3C2D]/70">Breakdown by appointment type</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={appointmentsByType}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="count"
                      >
                        {appointmentsByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {appointmentsByType.map((apt, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: apt.color }}></div>
                        <span className="text-sm text-[#4D3C2D]">{apt.type}</span>
                      </div>
                      <span className="text-sm font-medium text-[#4D3C2D]">{apt.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports & Feedback */}
          <Card className="bg-white/90 border-[#D9CAC2]">
            <CardHeader>
              <CardTitle className="text-[#4D3C2D]">Reports & Alerts</CardTitle>
              <p className="text-sm text-[#4D3C2D]/70">Recent feedback and system notifications</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReports.map((report, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-[#D9CAC2] bg-[#EAE4E1]/30">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    report.priority === 'high' ? 'bg-red-100' : 
                    report.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    <report.icon className={`w-4 h-4 ${getPriorityColor(report.priority)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-[#4D3C2D]">{report.type}</div>
                    <div className="text-xs text-[#4D3C2D]/70 mt-1">{report.message}</div>
                    <div className="text-xs text-[#4D3C2D]/50 mt-1">{report.time}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <AddScheduleDialog open={isAddScheduleOpen} onOpenChange={setIsAddScheduleOpen} />
    </div>
  );
};

export default Dashboard;