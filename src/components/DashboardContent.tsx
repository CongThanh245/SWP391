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
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { getDoctorTreatmentStats } from '@api/statsApi'; // Đường dẫn đã đúng theo query

// Giao diện DoctorStats từ API
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
  // Không cần props vì dữ liệu lấy trực tiếp trong component
}

const COLORS = ['#4D3C2D', '#D9CAC2', '#C2D9CA', '#A2D9CC', '#B2D9C2'];

export const DashboardContent: React.FC<DashboardContentProps> = () => {
  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gọi API khi component mount
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

  if (loading) {
    return <div className="text-center">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  if (!stats) {
    return <div className="text-center">Không có dữ liệu</div>;
  }

  // Chuẩn bị dữ liệu cho biểu đồ Tỉ lệ thành công theo phác đồ
  const successRateByProtocolData = Object.keys(stats.successRateByProtocol).map((key) => ({
    protocol: key,
    rate: Math.round(stats.successRateByProtocol[key] * 100), // Chuyển thành phần trăm
  }));

  // Chuẩn bị dữ liệu cho biểu đồ phân bổ điều trị
  const treatmentDistributionData = Object.keys(stats.treatmentDistribution)
    .map((key) => ({
      name: key,
      value: stats.treatmentDistribution[key] || 0,
    }))
    .filter((item) => item.value > 0);

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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ Tỉ lệ thành công theo phác đồ */}
        <Card className="lg:col-span-2 theme-card">
          <CardHeader>
            <CardTitle className="flex items-center" style={{ color: '#4D3C2D' }}>
              <LineChartIcon className="mr-2 h-5 w-5" />
              Tỉ lệ thành công theo phác đồ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={successRateByProtocolData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#D9CAC2" />
                <XAxis type="number" unit="%" stroke="#4D3C2D" />
                <YAxis dataKey="protocol" type="category" stroke="#4D3C2D" />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="rate" fill="#4D3C2D" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Biểu đồ Phân bổ loại điều trị */}
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
      </div>
    </div>
  );
};