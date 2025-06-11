
import React, { useState } from 'react';
import { Card } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Checkbox } from '@components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';

const PostIntervention: React.FC = () => {
  const [conditions, setConditions] = useState({
    abdominalPain: false,
    bleeding: false,
    other: false,
    otherDescription: ''
  });

  const handleConditionChange = (condition: string, checked: boolean) => {
    setConditions(prev => ({
      ...prev,
      [condition]: checked
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white border border-[color:var(--card-border)]">
        <h2 className="text-xl font-semibold mb-6 text-[color:var(--text-accent)]">
          Hậu Can thiệp
        </h2>

        {/* Tình trạng sau can thiệp */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-[color:var(--text-accent)]">
            Tình trạng sau can thiệp
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="abdominalPain"
                checked={conditions.abdominalPain}
                onCheckedChange={(checked) => handleConditionChange('abdominalPain', !!checked)}
                className="data-[state=checked]:bg-[color:var(--deep-taupe)] data-[state=checked]:border-[color:var(--deep-taupe)]"
              />
              <label htmlFor="abdominalPain" className="font-medium">
                Đau bụng
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="bleeding"
                checked={conditions.bleeding}
                onCheckedChange={(checked) => handleConditionChange('bleeding', !!checked)}
                className="data-[state=checked]:bg-[color:var(--deep-taupe)] data-[state=checked]:border-[color:var(--deep-taupe)]"
              />
              <label htmlFor="bleeding" className="font-medium">
                Ra máu
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="other"
                checked={conditions.other}
                onCheckedChange={(checked) => handleConditionChange('other', !!checked)}
                className="data-[state=checked]:bg-[color:var(--deep-taupe)] data-[state=checked]:border-[color:var(--deep-taupe)]"
              />
              <label htmlFor="other" className="font-medium">
                Khác
              </label>
            </div>
            {conditions.other && (
              <div className="ml-6 space-y-2">
                <Label>Mô tả chi tiết</Label>
                <Input
                  placeholder="Nhập mô tả..."
                  value={conditions.otherDescription}
                  onChange={(e) => setConditions(prev => ({...prev, otherDescription: e.target.value}))}
                  className="border-[color:var(--card-border)]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Xét nghiệm β-hCG */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-[color:var(--text-accent)]">
            Xét nghiệm β-hCG
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Ngày xét nghiệm</Label>
              <Input type="date" className="border-[color:var(--card-border)]" />
            </div>
            <div className="space-y-2">
              <Label>Kết quả</Label>
              <Input placeholder="Nhập kết quả..." className="border-[color:var(--card-border)]" />
            </div>
            <div className="space-y-2">
              <Label>Đánh giá</Label>
              <Select>
                <SelectTrigger className="border-[color:var(--card-border)]">
                  <SelectValue placeholder="Chọn đánh giá" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pregnant">Có thai</SelectItem>
                  <SelectItem value="not-pregnant">Không có thai</SelectItem>
                  <SelectItem value="suspicious">Nghi ngờ</SelectItem>
                  <SelectItem value="biochemical">Thai hóa sinh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Đánh giá hiệu quả */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-[color:var(--text-accent)]">
            📊 Đánh giá hiệu quả
          </h3>
          <Select>
            <SelectTrigger className="border-[color:var(--card-border)]">
              <SelectValue placeholder="Chọn đánh giá hiệu quả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pregnant">Đậu thai</SelectItem>
              <SelectItem value="not-pregnant">Không đậu</SelectItem>
              <SelectItem value="suspicious">Nghi ngờ</SelectItem>
              <SelectItem value="early-miscarriage">Sẩy thai sớm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Hướng dẫn tiếp theo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[color:var(--text-accent)]">
            💊 Hướng dẫn tiếp theo
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>📝 Thuốc cần uống</Label>
              <Textarea
                placeholder="Nhập thông tin thuốc, liều dùng, số ngày..."
                className="min-h-[100px] border-[color:var(--card-border)]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>📅 Ngày tái khám dự kiến</Label>
                <Input type="date" className="border-[color:var(--card-border)]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>📎 Ghi chú thêm</Label>
              <Textarea
                placeholder="Ghi chú bổ sung (tùy chọn)..."
                className="border-[color:var(--card-border)]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button className="bg-[color:var(--button-primary-bg)] hover:bg-[color:var(--button-hover-bg)] text-[color:var(--button-primary-text)] px-8 py-2">
            Lưu hồ sơ
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PostIntervention;
