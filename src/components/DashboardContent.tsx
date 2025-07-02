import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import {
  Calendar,
  Users,
  TrendingUp,
  LineChart as LineChartIcon,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { getDoctorTreatmentStats } from '@api/statsApi'; // Điều chỉnh đường dẫn nhập

// Giao diện DoctorStats
export interface DoctorStats {
  todayAppointments: number;
  diffFromYesterday: number;
  activePatients: number;
  newThisWeek: number;
  completedTreatments: number;
  completedRateChangeFromLastMonth: number;
  successRateThisMonth: number;
  successRateChangeFromLastMonth: number;
  successRateByProtocol: { [key: string]: number };
  treatmentDistribution: { [key: string]: number };
}

interface DashboardContentProps {
  // Không cần props vì dữ liệu được lấy trực tiếp trong component
}

// Dữ liệu giả lập cho biểu đồ
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

const COLORS = ['#4D3C2D', '#D9CAC2', '#C2D9CA', '#A2D9CC', '#B2D9C2'];

export const DashboardContent: React.FC<DashboardContentProps> = () => {
  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gọi API khi component được gắn
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDoctorTreatmentStats();
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi khi lấy dữ liệu');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Hiển thị khi đang tải
  if (loading) {
    return <div className="text-center">Đang tải...</div>;
  }

  // Hiển thị khi có lỗi
  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  // Hiển thị khi không có dữ liệu
  if (!stats) {
    return <div className="text-center">Không có dữ liệu</div>;
  }

  // Ánh xạ dữ liệu phân bổ điều trị
  const treatmentDistributionData = Object.keys(stats.treatmentDistribution)
    .map((key) => ({
      name: key,
      value: stats.treatmentDistribution[key] || 0,
    }))
    .filter((item) => item.value > 0);

  // Tính tổng số bệnh nhân
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
      <div className="grid grid-cols-1 md:grid-cols- лично grid-cols-4 gap-6">
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
            <div className="text-2xl font-bold text-green-600">{Math.round(stats.successRateThisMonth * 100)}%</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className={stats.successRateChangeFromLastMonth >= 0 ? "text-green-600" : "text-red-600"}>
                {stats.successRateChangeFromLastMonth >= 0 ? `+${Math.round(stats.successRateChangeFromLastMonth * 100)}%` : `${Math.round(stats.successRateChangeFromLastMonth * 100)}%`}
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
                {stats.completedRateChangeFromLastMonth >= 0 ? `+${Math.round(stats.completedRateChangeFromLastMonth)}%` : `${Math.round(stats.completedRateChangeFromLastMonth)}%`}
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
                data={monthlyAppointmentsData}
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

        {/* Success Rate Trend Chart */}
        <Card className="lg:col-span-1 theme-card">
          <CardHeader>
            <CardTitle style={{ color: '#4D3C2D' }}>Xu hướng Tỷ lệ thành công</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={successRateTrendData}
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

        {/* Treatment Stats */}
        <Card className="theme-card">
          <CardHeader>
            <CardTitle style={{ color: '#4D3C2D' }}>Thống kê điều trị</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(stats.treatmentDistribution).map((key) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{key} tháng này:</span>
                <span className="font-semibold" style={{ color: '#4D3C2D' }}>
                  {stats.treatmentDistribution[key] || 0} ca
                </span>
              </div>
            ))}
            {Object.keys(stats.successRateByProtocol).map((key) => (
              <div key={key} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Tỷ lệ thành công {key}:</span>
                <span className="font-semibold text-green-600">
                  {Math.round(stats.successRateByProtocol[key] * 100)}%
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Hoàn tất điều trị:</span>
              <span className="font-semibold text-green-600">{stats.completedTreatments} ca</span>
            </div>
            <div className="pt-2 border-t" style={{ borderColor: '#D9CAC2' }}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tổng bệnh nhân:</span>
                <span className="font-semibold" style={{ color: '#4D3C2D' }}>
                  {totalPatients}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};