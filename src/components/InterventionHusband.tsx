
import React from 'react';
import { Card } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Plus } from 'lucide-react';

const InterventionHusband: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Ngày lấy tinh trùng */}
      <Card className="p-6 bg-white border border-[color:var(--card-border)]">
        <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-accent)]">
          Ngày lấy tinh trùng
        </h3>
        <div className="space-y-2">
          <Label>Ngày thực hiện</Label>
          <Input type="date" className="border-[color:var(--card-border)]" />
        </div>
      </Card>

      {/* Phương pháp xử lý */}
      <Card className="p-6 bg-white border border-[color:var(--card-border)]">
        <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-accent)]">
          Phương pháp xử lý
        </h3>
        <Select>
          <SelectTrigger className="border-[color:var(--card-border)]">
            <SelectValue placeholder="Chọn phương pháp xử lý" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="swim-up">Swim-up</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
            <SelectItem value="other">Khác</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* Kết quả sau lọc rửa */}
      <Card className="p-6 bg-white border border-[color:var(--card-border)]">
        <h3 className="text-lg font-semibold mb-4 text-[color:var(--text-accent)]">
          Kết quả sau lọc rửa
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Mật độ tinh trùng</Label>
            <Input placeholder="Nhập mật độ..." className="border-[color:var(--card-border)]" />
          </div>
          <div className="space-y-2">
            <Label>Mức độ di động</Label>
            <Input placeholder="Nhập mức độ..." className="border-[color:var(--card-border)]" />
          </div>
          <div className="space-y-2">
            <Label>Đánh giá</Label>
            <Input placeholder="Nhập đánh giá..." className="border-[color:var(--card-border)]" />
          </div>
        </div>
      </Card>

    </div>
  );
};

export default InterventionHusband;
