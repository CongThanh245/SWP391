import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
// Import các icon cần dùng
import {
  Calendar,
  Users,
  TrendingUp,
  LineChart as LineChartIcon,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Sector, BarChart, Bar
} from 'recharts';

// Corrected DoctorStats interface based on the exact API response provided from network tab
export interface DoctorStats {
  todayAppointments: number;
  diffFromYesterday: number;
  activePatients: number;
  newThisWeek: number;
  completedTreatments: number;
  completedRateChangeFromLastMonth: number;
  successRateThisMonth: number;
  successRateChangeFromLastMonth: number;
  successRateByProtocol: {
    // API của bạn trả về các key cụ thể này
    IVF?: number; // Có thể có hoặc không
    IUI?: number; // Có thể có hoặc không
    // Thêm các loại phác đồ khác nếu API của bạn cung cấp
  };
  treatmentDistribution: {
    // API của bạn trả về các key cụ thể này
    IVF: number;
    IUI: number;
    Other?: number; // Thêm nếu API của bạn có key 'Other'
  };
}

interface DashboardContentProps {
  stats: DoctorStats;
}

// Dummy data for charts - these would ideally come from your API
const monthlyAppointmentsData = [
  { name: 'Tháng 1', appointments: 0, completed: 0 },
  { name: 'Tháng 2', appointments: 0, completed: 0 },
  { name: 'Tháng 3', appointments: 0, completed: 0 },
  { name: 'Tháng 4', appointments: 0, completed: 0 },
  { name: 'Tháng 5', appointments: 0, completed: 0 },
  { name: 'Tháng 6', appointments: 0, completed: 0 },
];

const successRateTrendData = [
  { name: 'Tháng 1', rate: 0 },
  { name: 'Tháng 2', rate: 0 },
  { name: 'Tháng 3', rate: 0 },
  { name: 'Tháng 4', rate: 0 },
  { name: 'Tháng 5', rate: 0 },
  { name: 'Tháng 6', rate: 0 },
];

const COLORS = ['#4D3C2D', '#D9CAC2', '#C2D9CA', '#A2D9CC', '#B2D9C2']; // Custom colors for charts

export const DashboardContent: React.FC<DashboardContentProps> = ({ stats }) => {

  // Map actual treatmentDistribution properties to meaningful labels for the chart
  const treatmentDistributionData = [
    { name: 'IVF', value: stats.treatmentDistribution?.IVF || 0 },
    { name: 'IUI', value: stats.treatmentDistribution?.IUI || 0 },
    { name: 'Khác', value: stats.treatmentDistribution?.Other || 0 }, // Thêm dòng này nếu có key 'Other' trong API
  ].filter(item => item.value > 0); // Filter out categories with 0 value for cleaner charts

  // Calculate total patients (active + completed treatments)
  const totalPatients = stats.activePatients + stats.completedTreatments;

  return (
    <div className="space-y-6 theme-gradient-bg min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#4D3C2D' }}>Dashboard</h1>
          <p className="text-sm text-gray-500">Hôm nay: {new Date().toLocaleDateString('vi-VN')}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="theme-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Lịch hẹn hôm nay</CardTitle>
            <Calendar className="h-4 w-4" style={{ color: '#4D3C2D' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#4D3C2D' }}>{stats.todayAppointments}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className={stats.diffFromYesterday >= 0 ? "text-green-600" : "text-red-600"}>
                {stats.diffFromYesterday >= 0 ? `+${stats.diffFromYesterday}` : stats.diffFromYesterday}{' '}
              </span>
              so với hôm qua
            </p>
          </CardContent>
        </Card>

        <Card className="theme-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Bệnh nhân đang điều trị</CardTitle>
            <Users className="h-4 w-4" style={{ color: '#D9CAC2' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#4D3C2D' }}>{stats.activePatients}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-blue-600">{stats.newThisWeek}</span> ca mới tuần này
            </p>
          </CardContent>
        </Card>

        <Card className="theme-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tỷ lệ thành công tháng này</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{Math.round(stats.successRateThisMonth)}%</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className={stats.successRateChangeFromLastMonth >= 0 ? "text-green-600" : "text-red-600"}>
                {stats.successRateChangeFromLastMonth >= 0 ? `+${Math.round(stats.successRateChangeFromLastMonth)}%` : `${Math.round(stats.successRateChangeFromLastMonth * 100)}%`}
              </span>{' '}
              so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card className="theme-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tổng số ca đã hoàn thành</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedTreatments}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className={stats.completedRateChangeFromLastMonth >= 0 ? "text-green-600" : "text-red-600"}>
                {stats.completedRateChangeFromLastMonth >= 0 ? `+${Math.round(stats.completedRateChangeFromLastMonth)}%` : `${Math.round(stats.completedRateChangeFromLastMonth * 100)}%`}
              </span>{' '}
              so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid with Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Trend Chart */}
        <Card className="lg:col-span-2 theme-card">
          <CardHeader>
            <CardTitle className="flex items-center" style={{ color: '#4D3C2D' }}>
              <LineChartIcon className="mr-2 h-5 w-5" />
              Xu hướng Lịch hẹn và Hoàn thành Điều trị
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={monthlyAppointmentsData} // This is currently dummy data
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#D9CAC2" />
                <XAxis dataKey="name" stroke="#4D3C2D" />
                <YAxis stroke="#4D3C2D" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="appointments" stroke="#4D3C2D" name="Tổng lịch hẹn" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Hoàn thành" />
              </LineChart>
            </ResponsiveContainer>
             <p className="text-sm text-gray-500 text-center mt-2">
                (Dữ liệu xu hướng cần API cung cấp thông tin theo tháng)
            </p>
          </CardContent>
        </Card>

        {/* Treatment Distribution Chart */}
        <Card className="theme-card">
          <CardHeader>
            <CardTitle style={{ color: '#4D3C2D' }}>Phân bổ loại điều trị</CardTitle>
          </CardHeader>
          <CardContent>
            {treatmentDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={treatmentDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {treatmentDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 pt-10">Không có dữ liệu phân bổ điều trị.</p>
            )}
          </CardContent>
        </Card>

        {/* Success Rate Trend Chart (Bar Chart) */}
        <Card className="lg:col-span-1 theme-card">
          <CardHeader>
            <CardTitle style={{ color: '#4D3C2D' }}>Xu hướng Tỷ lệ thành công</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={successRateTrendData} // This is currently dummy data
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#D9CAC2" />
                <XAxis dataKey="name" stroke="#4D3C2D" />
                <YAxis unit="%" stroke="#4D3C2D" />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="rate" fill="#4D3C2D" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-500 text-center mt-2">
                (Dữ liệu xu hướng cần API cung cấp thông tin theo tháng)
            </p>
          </CardContent>
        </Card>

        {/* Treatment Stats - Updated to include success rate by protocol */}
        <Card className="theme-card">
          <CardHeader>
            <CardTitle style={{ color: '#4D3C2D' }}>Thống kê điều trị</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">IVF tháng này:</span>
              <span className="font-semibold" style={{ color: '#4D3C2D' }}>{stats.treatmentDistribution?.IVF || 0} ca</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">IUI tháng này:</span>
              <span className="font-semibold" style={{ color: '#4D3C2D' }}>{stats.treatmentDistribution?.IUI || 0} ca</span>
            </div>
            {/* Display success rate by protocol if available */}
            {(stats.successRateByProtocol?.IVF !== undefined) && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Tỷ lệ thành công IVF:</span>
                <span className="font-semibold text-green-600">{Math.round(stats.successRateByProtocol.IVF)}%</span>
              </div>
            )}
            {(stats.successRateByProtocol?.IUI !== undefined) && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Tỷ lệ thành công IUI:</span>
                <span className="font-semibold text-green-600">{Math.round(stats.successRateByProtocol.IUI)}%</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Hoàn tất điều trị:</span>
              <span className="font-semibold text-green-600">{stats.completedTreatments} ca</span>
            </div>
            <div className="pt-2 border-t" style={{ borderColor: '#D9CAC2' }}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tổng bệnh nhân:</span>
                <span className="font-semibold" style={{ color: '#4D3C2D' }}>{totalPatients}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};