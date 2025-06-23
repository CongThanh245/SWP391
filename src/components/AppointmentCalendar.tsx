import React from 'react';
import { Card } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Calendar, Clock, FileText } from 'lucide-react';

interface AppointmentCalendarProps {
  selectedTimeframe: string;
  onTimeframeSelect: (timeframe: string) => void;
  followUpNotes: string;
  onNotesChange: (notes: string) => void;
  followUpReason: string;
  onReasonChange: (reason: string) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  selectedTimeframe,
  onTimeframeSelect,
  followUpNotes,
  onNotesChange,
  followUpReason,
  onReasonChange
}) => {

  const timeframeOptions = [
    { value: '1_month', label: '1 tháng', description: 'Theo dõi sát' },
    { value: '3_months', label: '3 tháng', description: 'Thường xuyên' },
    { value: '6_months', label: '6 tháng', description: 'Định kỳ' },
    { value: '1_year', label: '1 năm', description: 'Kiểm tra dài hạn' },
    { value: 'custom', label: 'Tùy chỉnh', description: 'Theo chỉ định riêng' }
  ];

  const commonReasons = [
    'Theo dõi hiệu quả thuốc',
    'Kiểm tra tác dụng phụ',
    'Đánh giá tiến triển bệnh',
    'Điều chỉnh liều thuốc',
    'Xét nghiệm định kỳ',
    'Tư vấn dinh dưỡng'
  ];

  return (
    <Card className="p-6 bg-white border border-[color:var(--card-border)]">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-[color:var(--text-accent)]" />
        <h3 className="text-lg font-semibold text-[color:var(--text-accent)]">
          Khuyến nghị tái khám
        </h3>
      </div>

      <div className="space-y-6">
        {/* Chọn thời gian tái khám */}
        <div>
          <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-3">
            <Clock className="w-4 h-4 inline mr-1" />
            Thời gian khuyến nghị tái khám:
          </label>
          <div className="grid grid-cols-2 gap-3">
            {timeframeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onTimeframeSelect(option.value)}
                className={`p-3 text-left border rounded-lg transition-colors ${selectedTimeframe === option.value
                    ? 'border-[color:var(--deep-taupe)] bg-[color:var(--secondary-background)]'
                    : 'border-[color:var(--card-border)] hover:border-[color:var(--deep-taupe)]'
                  }`}
              >
                <div className="font-medium text-[color:var(--text-accent)]">
                  {option.label}
                </div>
                <div className="text-xs text-[color:var(--text-secondary)]">
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Lý do tái khám */}
        <div>
          <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-3">
            <FileText className="w-4 h-4 inline mr-1" />
            Lý do tái khám:
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {commonReasons.map((reason) => (
              <Badge
                key={reason}
                variant={followUpReason.includes(reason) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${followUpReason.includes(reason)
                    ? 'bg-[color:var(--deep-taupe)] text-white'
                    : 'hover:border-[color:var(--deep-taupe)]'
                  }`}
                onClick={() => {
                  if (followUpReason.includes(reason)) {
                    onReasonChange(followUpReason.replace(reason, '').replace(', ,', ', ').trim());
                  } else {
                    const newReason = followUpReason ? `${followUpReason}, ${reason}` : reason;
                    onReasonChange(newReason);
                  }
                }}
              >
                {reason}
              </Badge>
            ))}
          </div>
          <textarea
            value={followUpReason}
            onChange={(e) => onReasonChange(e.target.value)}
            className="w-full p-3 border border-[color:var(--card-border)] rounded-md resize-none focus:border-[color:var(--deep-taupe)] focus:outline-none"
            rows={2}
            placeholder="Nhập lý do tái khám hoặc chọn từ gợi ý ở trên..."
          />
        </div>

        {/* Ghi chú thêm */}
        <div>
          <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">
            Ghi chú thêm cho bệnh nhân:
          </label>
          <textarea
            value={followUpNotes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="w-full p-3 border border-[color:var(--card-border)] rounded-md resize-none focus:border-[color:var(--deep-taupe)] focus:outline-none"
            rows={3}
            placeholder="Ví dụ: Cần nhịn ăn 8 tiếng trước khi tái khám, mang theo kết quả xét nghiệm..."
          />
        </div>

        {/* Xem trước thông báo */}
        {selectedTimeframe && (
          <div className="p-4 bg-[color:var(--secondary-background)] rounded-lg">
            <h4 className="font-medium text-[color:var(--text-accent)] mb-2">
              Xem trước thông báo gửi bệnh nhân:
            </h4>
            <div className="text-sm text-[color:var(--text-secondary)] bg-white p-3 rounded border">
              <p><strong>Thời gian:</strong> Sau {timeframeOptions.find(opt => opt.value === selectedTimeframe)?.label}</p>
              {followUpReason && <p><strong>Lý do:</strong> {followUpReason}</p>}
              {followUpNotes && <p><strong>Lưu ý:</strong> {followUpNotes}</p>}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end pt-6">
        <Button
        
          className="bg-[color:var(--button-primary-bg)] hover:bg-[color:var(--button-hover-bg)] text-[color:var(--button-primary-text)] px-8 py-2"
        >
          Lưu hồ sơ
        </Button>
      </div>
    </Card>
  );
};

export default AppointmentCalendar;