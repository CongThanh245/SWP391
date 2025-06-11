
import React, { useState } from 'react';
import { Card } from '@components/ui/card';
import { Calendar } from '@components/ui/calendar';
import { Badge } from '@components/ui/badge';

const AppointmentCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Mock data cho các ngày đã có lịch hẹn
  const bookedDates = [
    new Date(2024, 5, 15),
    new Date(2024, 5, 16),
    new Date(2024, 5, 20),
    new Date(2024, 5, 25),
  ];

  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate => 
      bookedDate.toDateString() === date.toDateString()
    );
  };

  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && !isDateBooked(date);
  };

  return (
    <Card className="p-6 bg-white border border-[color:var(--card-border)]">
      <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-accent)]">
        Hẹn tái khám
      </h3>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="border-green-500 text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Còn trống
          </Badge>
          <Badge variant="outline" className="border-red-500 text-red-700">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            Đã full
          </Badge>
          <Badge variant="outline" className="border-[color:var(--deep-taupe)] text-[color:var(--deep-taupe)]">
            <div className="w-2 h-2 bg-[color:var(--deep-taupe)] rounded-full mr-2"></div>
            Đã chọn
          </Badge>
        </div>

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={(date) => date < new Date()}
          className="rounded-md border border-[color:var(--card-border)] pointer-events-auto"
          modifiers={{
            booked: bookedDates,
            available: (date) => isDateAvailable(date)
          }}
          modifiersStyles={{
            booked: {
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              fontWeight: 'bold'
            },
            available: {
              backgroundColor: '#f0fdf4',
              color: '#16a34a'
            }
          }}
        />

        {selectedDate && (
          <div className="mt-4 p-4 bg-[color:var(--secondary-background)] rounded-lg">
            <h4 className="font-medium text-[color:var(--text-accent)] mb-2">
              Ngày đã chọn: {selectedDate.toLocaleDateString('vi-VN')}
            </h4>
            <p className="text-sm text-[color:var(--text-secondary)]">
              Trạng thái: {isDateBooked(selectedDate) ? 
                <span className="text-red-600 font-medium">Đã full</span> : 
                <span className="text-green-600 font-medium">Còn trống</span>
              }
            </p>
            {isDateAvailable(selectedDate) && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-1">
                  Ghi chú hẹn tái khám:
                </label>
                <textarea 
                  className="w-full p-2 border border-[color:var(--card-border)] rounded-md resize-none focus:border-[color:var(--deep-taupe)] focus:outline-none"
                  rows={3}
                  placeholder="Nhập ghi chú cho cuộc hẹn..."
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default AppointmentCalendar;
