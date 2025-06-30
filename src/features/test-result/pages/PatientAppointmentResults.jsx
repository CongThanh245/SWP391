import React, { useState } from 'react';
import { Calendar, FileText, Heart, TrendingUp, Clock, CheckCircle, AlertCircle, User, Phone, Mail } from 'lucide-react';

const PatientAppointmentResults = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');

  // Mock data cho bệnh nhân
  const patientInfo = {
    name: "Nguyễn Thị Lan Anh",
    age: 32,
    phone: "0912 345 678",
    email: "lananh@email.com",
    treatmentStartDate: "2024-01-15",
    nextAppointment: "2025-07-05"
  };

  // Mock data cho các lịch hẹn
  const appointments = [
    {
      id: 1,
      date: "2024-01-15",
      type: "Khám ban đầu",
      doctor: "BS. Nguyễn Văn A",
      status: "completed",
      phase: "Giai đoạn 1: Đánh giá",
      results: {
        diagnosis: "Vô sinh nguyên phát",
        tests: ["Siêu âm buồng trứng", "Xét nghiệm hormone", "HSG"],
        recommendations: "Bắt đầu điều trị kích thích buồng trứng",
        notes: "Bệnh nhân phản ứng tốt với đợt khám đầu tiên"
      },
      progress: 15
    },
    {
      id: 2,
      date: "2024-02-10",
      type: "Theo dõi điều trị",
      doctor: "BS. Nguyễn Văn A",
      status: "completed",
      phase: "Giai đoạn 2: Kích thích",
      results: {
        diagnosis: "Phản ứng tốt với thuốc kích thích",
        tests: ["Siêu âm follicle", "E2, LH"],
        recommendations: "Tiếp tục protocol hiện tại",
        notes: "Có 8 follicles phát triển tốt"
      },
      progress: 35
    },
    {
      id: 3,
      date: "2024-02-25",
      type: "Thu nhận trứng",
      doctor: "BS. Nguyễn Văn A",
      status: "completed",
      phase: "Giai đoạn 3: Thu nhận",
      results: {
        diagnosis: "Thu nhận thành công 12 trứng",
        tests: ["Thụ tinh IVF", "Nuôi cấy phôi"],
        recommendations: "Chuyển phôi chu kỳ tiếp theo",
        notes: "8/12 trứng thụ tinh thành công"
      },
      progress: 55
    },
    {
      id: 4,
      date: "2024-03-15",
      type: "Chuyển phôi",
      doctor: "BS. Nguyễn Văn A",
      status: "completed",
      phase: "Giai đoạn 4: Chuyển phôi",
      results: {
        diagnosis: "Chuyển 2 phôi chất lượng tốt",
        tests: ["Siêu âm nội mạc tử cung", "Progesterone"],
        recommendations: "Theo dõi beta HCG sau 14 ngày",
        notes: "Nội mạc tử cung dày 12mm, rất thuận lợi"
      },
      progress: 75
    },
    {
      id: 5,
      date: "2024-03-29",
      type: "Kiểm tra kết quả",
      doctor: "BS. Nguyễn Văn A",
      status: "completed",
      phase: "Giai đoạn 5: Xác nhận",
      results: {
        diagnosis: "Beta HCG dương tính - Có thai!",
        tests: ["Beta HCG", "Siêu âm sớm"],
        recommendations: "Theo dõi thai kỳ định kỳ",
        notes: "Chúc mừng! Hành trình của bạn đã thành công"
      },
      progress: 100,
      isSuccess: true
    },
    {
      id: 6,
      date: "2025-07-05",
      type: "Tái khám định kỳ",
      doctor: "BS. Nguyễn Văn A",
      status: "upcoming",
      phase: "Theo dõi thai kỳ",
      results: null,
      progress: 100
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'var(--color-success)';
      case 'upcoming': return 'var(--color-primary)';
      case 'cancelled': return 'var(--color-danger)';
      default: return 'var(--color-info-dark)';
    }
  };

  const getStatusIcon = (status, isSuccess = false) => {
    if (isSuccess) return <Heart className="w-5 h-5" style={{ color: 'var(--color-danger)' }} />;
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-success)' }} />;
      case 'upcoming': return <Clock className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />;
      default: return <AlertCircle className="w-5 h-5" style={{ color: 'var(--color-warning)' }} />;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--primary-background)',
      fontFamily: 'var(--font-family)'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--deep-taupe) 0%, var(--accent-color) 100%)',
        color: 'white',
        padding: '2rem 0',
        marginBottom: '2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>
                {patientInfo.name}
              </h1>
              <p style={{ margin: '0.25rem 0 0 0', opacity: 0.9 }}>
                Tuổi: {patientInfo.age} • Điều trị từ: {new Date(patientInfo.treatmentStartDate).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone className="w-4 h-4" />
              <span>{patientInfo.phone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail className="w-4 h-4" />
              <span>{patientInfo.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar className="w-4 h-4" />
              <span>Hẹn tiếp: {new Date(patientInfo.nextAppointment).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Progress Overview */}
        <div style={{
          background: 'white',
          borderRadius: 'var(--card-border-radius)',
          padding: 'var(--card-padding)',
          boxShadow: 'var(--box-shadow)',
          marginBottom: '2rem',
          border: '1px solid var(--card-border)'
        }}>
          <h2 style={{
            margin: '0 0 1.5rem 0',
            color: 'var(--deep-taupe)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <TrendingUp className="w-6 h-6" />
            Tiến Trình Điều Trị
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'var(--color-success)',
                marginBottom: '0.5rem'
              }}>
                {appointments.filter(a => a.status === 'completed').length}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>Lần khám hoàn thành</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'var(--color-primary)',
                marginBottom: '0.5rem'
              }}>
                {appointments.filter(a => a.status === 'upcoming').length}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>Lần hẹn sắp tới</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'var(--color-danger)',
                marginBottom: '0.5rem'
              }}>
                ♥
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>Kết quả thành công</div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div style={{
          background: 'white',
          borderRadius: 'var(--card-border-radius)',
          padding: 'var(--card-padding)',
          boxShadow: 'var(--box-shadow)',
          border: '1px solid var(--card-border)'
        }}>
          <h2 style={{
            margin: '0 0 2rem 0',
            color: 'var(--deep-taupe)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Calendar className="w-6 h-6" />
            Lịch Sử Khám Chữa Bệnh
          </h2>

          <div style={{ position: 'relative' }}>
            {/* Timeline line */}
            <div style={{
              position: 'absolute',
              left: '30px',
              top: '0',
              bottom: '0',
              width: '3px',
              background: 'linear-gradient(to bottom, var(--color-success), var(--color-primary))',
              borderRadius: '2px'
            }} />

            {appointments.map((appointment, index) => (
              <div
                key={appointment.id}
                style={{
                  position: 'relative',
                  marginBottom: index === appointments.length - 1 ? '0' : '2rem',
                  paddingLeft: '80px',
                  cursor: appointment.results ? 'pointer' : 'default'
                }}
                onClick={() => appointment.results && setSelectedAppointment(selectedAppointment?.id === appointment.id ? null : appointment)}
              >
                {/* Timeline dot */}
                <div style={{
                  position: 'absolute',
                  left: '18px',
                  top: '12px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: getStatusColor(appointment.status),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 0 4px white, 0 0 0 6px ' + getStatusColor(appointment.status) + '40'
                }}>
                  {getStatusIcon(appointment.status, appointment.isSuccess)}
                </div>

                {/* Appointment card */}
                <div style={{
                  background: selectedAppointment?.id === appointment.id ? 'var(--secondary-background)' : 'white',
                  border: `2px solid ${appointment.isSuccess ? 'var(--color-danger)' : 'var(--card-border)'}`,
                  borderRadius: 'var(--border-radius-2)',
                  padding: '1.5rem',
                  transition: 'all 0.3s ease',
                  transform: selectedAppointment?.id === appointment.id ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: selectedAppointment?.id === appointment.id ? '0 8px 25px rgba(97, 71, 76, 0.15)' : '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <h3 style={{
                        margin: '0 0 0.5rem 0',
                        color: appointment.isSuccess ? 'var(--color-danger)' : 'var(--deep-taupe)',
                        fontSize: 'var(--font-size-lg)',
                        fontWeight: 'bold'
                      }}>
                        {appointment.type}
                      </h3>
                      <p style={{
                        margin: '0 0 0.25rem 0',
                        color: 'var(--text-secondary)',
                        fontSize: 'var(--font-size-sm)'
                      }}>
                        {appointment.phase}
                      </p>
                      <p style={{
                        margin: 0,
                        color: 'var(--text-secondary)',
                        fontSize: 'var(--font-size-sm)'
                      }}>
                        {new Date(appointment.date).toLocaleDateString('vi-VN')} • {appointment.doctor}
                      </p>
                    </div>
                    
                    {appointment.status === 'completed' && (
                      <div style={{
                        background: appointment.isSuccess ? 'var(--color-danger)' : 'var(--color-success)',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'bold'
                      }}>
                        {appointment.isSuccess ? 'Thành công!' : 'Hoàn thành'}
                      </div>
                    )}
                  </div>

                  {/* Progress bar */}
                  {appointment.status === 'completed' && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        background: 'var(--color-light)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${appointment.progress}%`,
                          height: '100%',
                          background: appointment.isSuccess ? 'var(--color-danger)' : 'var(--color-success)',
                          borderRadius: '4px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                      <p style={{
                        margin: '0.5rem 0 0 0',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--text-secondary)'
                      }}>
                        Tiến độ điều trị: {appointment.progress}%
                      </p>
                    </div>
                  )}

                  {/* Expanded results */}
                  {selectedAppointment?.id === appointment.id && appointment.results && (
                    <div style={{
                      borderTop: '1px solid var(--card-border)',
                      paddingTop: '1rem',
                      marginTop: '1rem'
                    }}>
                      <h4 style={{
                        margin: '0 0 1rem 0',
                        color: 'var(--deep-taupe)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <FileText className="w-5 h-5" />
                        Chi Tiết Kết Quả
                      </h4>
                      
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                          <strong style={{ color: 'var(--text-accent)' }}>Chẩn đoán:</strong>
                          <p style={{ margin: '0.25rem 0', color: 'var(--text-primary)' }}>
                            {appointment.results.diagnosis}
                          </p>
                        </div>
                        
                        <div>
                          <strong style={{ color: 'var(--text-accent)' }}>Xét nghiệm/Thủ thuật:</strong>
                          <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem', color: 'var(--text-primary)' }}>
                            {appointment.results.tests.map((test, idx) => (
                              <li key={idx}>{test}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <strong style={{ color: 'var(--text-accent)' }}>Khuyến nghị:</strong>
                          <p style={{ margin: '0.25rem 0', color: 'var(--text-primary)' }}>
                            {appointment.results.recommendations}
                          </p>
                        </div>
                        
                        <div>
                          <strong style={{ color: 'var(--text-accent)' }}>Ghi chú:</strong>
                          <p style={{
                            margin: '0.25rem 0',
                            color: 'var(--text-primary)',
                            fontStyle: 'italic',
                            background: appointment.isSuccess ? 'rgba(244, 67, 54, 0.1)' : 'var(--color-light)',
                            padding: '0.75rem',
                            borderRadius: 'var(--border-radius-1)',
                            borderLeft: `4px solid ${appointment.isSuccess ? 'var(--color-danger)' : 'var(--color-primary)'}`
                          }}>
                            {appointment.results.notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {appointment.results && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '0.5rem',
                      background: 'var(--color-light)',
                      borderRadius: 'var(--border-radius-1)',
                      textAlign: 'center',
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-primary)',
                      cursor: 'pointer'
                    }}>
                      {selectedAppointment?.id === appointment.id ? 'Thu gọn chi tiết' : 'Xem chi tiết kết quả'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointmentResults;