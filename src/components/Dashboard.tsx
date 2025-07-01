import { Header } from "@components/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Calendar, Users, UserCheck, TrendingUp, TrendingDown, Clock, MapPin, Activity, Heart, AlertTriangle, CheckCircle, XCircle, Star, FileText, Phone, Mail } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";
import { AddScheduleDialog } from "@components/AddScheduleDialog";
import { useEffect, useState } from "react";
import { getAdminDashboard } from '@api/adminApi'

const Dashboard = () => {
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAdminDashboard();
        setDashboardData(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Default values for when data is not yet loaded or is missing
  const defaultDashboardData = {
    activePatients: 0,
    diffFromLastMonthPercentage: 0,
    todayAppointments: 0,
    appointmentChangeFromYesterdayPercentage: 0,
    topSuccessProtocol: "N/A",
    successRate: 0,
    rateChangeFromLastMonth: 0,
    onDutyDoctors: 0,
    totalDoctors: 0,
    onDutyDoctorRatioPercentage: 0,
    weeklyTreatmentOverview: {
      "MON": { "ivfCount": 0, "iuiCount": 0 },
      "TUE": { "ivfCount": 0, "iuiCount": 0 },
      "WED": { "ivfCount": 0, "iuiCount": 0 },
      "THU": { "ivfCount": 0, "iuiCount": 0 },
      "FRI": { "ivfCount": 0, "iuiCount": 0 },
      "SAT": { "ivfCount": 0, "iuiCount": 0 },
      "SUN": { "ivfCount": 0, "iuiCount": 0 }
    },
    treatmentSuccessRates: {} // This is empty in your API
  };


  const dataToUse = dashboardData || defaultDashboardData;

  // Helper to determine trend icon and color
  const getTrend = (percentage: number) => {
    if (percentage > 0) return { icon: TrendingUp, trend: "up", color: "text-green-600" };
    if (percentage < 0) return { icon: TrendingDown, trend: "down", color: "text-red-600" };
    return { icon: null, trend: "stable", color: "text-gray-600" };
  };

  const patientsTrend = getTrend(dataToUse.diffFromLastMonthPercentage);
  const appointmentsTrend = getTrend(dataToUse.appointmentChangeFromYesterdayPercentage);
  const successRateTrend = getTrend(dataToUse.rateChangeFromLastMonth)

  // Core hospital metrics for fertility treatment
  const statsData = [
    {
      title: "Total Patients",
      value: dataToUse.activePatients.toLocaleString(),
      change: `${patientsTrend.trend === 'up' ? '+' : ''}${dataToUse.diffFromLastMonthPercentage}%`,
      trend: patientsTrend.trend,
      icon: Users,
      subtitle: "Active treatment patients"
    },
    {
      title: "Daily Appointments",
      value: dataToUse.todayAppointments.toLocaleString(),
      change: `${appointmentsTrend.trend === 'up' ? '+' : ''}${dataToUse.appointmentChangeFromYesterdayPercentage}%`,
      trend: appointmentsTrend.trend,
      icon: Calendar,
      subtitle: "Today's consultations"
    },
    {
      title: "Treatment Success Rate",
      value: `${dataToUse.successRate}%`,
      change: `${successRateTrend.trend === 'up' ? '+' : ''}${dataToUse.rateChangeFromLastMonth}%`,
      trend: successRateTrend.trend,
      icon: Heart,
      subtitle: dataToUse.topSuccessProtocol && dataToUse.topSuccessProtocol !== "N/A"
        ? `Top protocol: ${dataToUse.topSuccessProtocol}`
        : "Overall success rate"
    },
    {
      title: "Available Doctors",
      value: dataToUse.onDutyDoctors.toLocaleString(),
      change: `${dataToUse.onDutyDoctorRatioPercentage}%`,
      trend: dataToUse.onDutyDoctorRatioPercentage === 100 ? "up" : "stable",
      icon: UserCheck,
      subtitle: "Currently on duty"
    },
  ];

  // Treatment methods success rates for the week
  const treatmentSuccessData = [
    { name: "IVF", successful: 45, total: 67, rate: 67.2 },
    { name: "IUI", successful: 28, total: 52, rate: 53.8 },
    { name: "Natural Cycle", successful: 12, total: 28, rate: 42.9 },
  ];

  // Patient overview by treatment type over the week
  const weeklyTreatmentData = [
    { day: "Mon", IVF: dataToUse.weeklyTreatmentOverview.MON.ivfCount, IUI: dataToUse.weeklyTreatmentOverview.MON.iuiCount, ICSI: 0, Consultation: 0 },
    { day: "Tue", IVF: dataToUse.weeklyTreatmentOverview.TUE.ivfCount, IUI: dataToUse.weeklyTreatmentOverview.TUE.iuiCount, ICSI: 0, Consultation: 0 },
    { day: "Wed", IVF: dataToUse.weeklyTreatmentOverview.WED.ivfCount, IUI: dataToUse.weeklyTreatmentOverview.WED.iuiCount, ICSI: 0, Consultation: 0 },
    { day: "Thu", IVF: dataToUse.weeklyTreatmentOverview.THU.ivfCount, IUI: dataToUse.weeklyTreatmentOverview.THU.iuiCount, ICSI: 0, Consultation: 0 },
    { day: "Fri", IVF: dataToUse.weeklyTreatmentOverview.FRI.ivfCount, IUI: dataToUse.weeklyTreatmentOverview.FRI.iuiCount, ICSI: 0, Consultation: 0 },
    { day: "Sat", IVF: dataToUse.weeklyTreatmentOverview.SAT.ivfCount, IUI: dataToUse.weeklyTreatmentOverview.SAT.iuiCount, ICSI: 0, Consultation: 0 },
    { day: "Sun", IVF: dataToUse.weeklyTreatmentOverview.SUN.ivfCount, IUI: dataToUse.weeklyTreatmentOverview.SUN.iuiCount, ICSI: 0, Consultation: 0 },
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

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-[#EAE4E1] items-center justify-center">
        <p className="text-[#4D3C2D] text-lg">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-[#EAE4E1] items-center justify-center">
        <p className="text-red-600 text-lg">Error: {error}</p>
        <p className="text-[#4D3C2D]">Please try again later or check the API.</p>
      </div>
    );
  }

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

      
      </div>

      <AddScheduleDialog open={isAddScheduleOpen} onOpenChange={setIsAddScheduleOpen} />
    </div>
  );
};

export default Dashboard;