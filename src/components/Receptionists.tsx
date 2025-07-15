"use client";

import { useState, useEffect, useCallback } from 'react';
import { Header } from "@components/AdminHeader";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback } from "@components/ui/avatar";
import { Search, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { useToast } from "@hooks/use-toast";
import { fetchReceptionists } from '@api/adminApi';
import { AddReceptionistDialog } from '@components/AddReceptionistDialog';

interface Receptionist {
  employeeId: string;
  receptionistName: string;
  receptionistPhone: string;
  receptionistAddress: string;
  dateOfBirth: string;
  joinDate: string;
  active: boolean;
}

const Receptionists = () => {
  const { toast } = useToast();
  const [receptionists, setReceptionists] = useState<Receptionist[]>([]);
  const [filteredReceptionists, setFilteredReceptionists] = useState<Receptionist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(6);

  const getInitials = useCallback((name: string) => {
    if (!name || typeof name !== "string") {
      return "LT";
    }
    const parts = name
      .trim()
      .split(" ")
      .filter((part) => part.length > 0);
    if (parts.length === 0) {
      return "LT";
    }
    return parts
      .map((part) => part[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchReceptionists();
      if (!Array.isArray(response)) {
        console.warn("Không nhận được dữ liệu lễ tân hoặc định dạng không hợp lệ");
        setReceptionists([]);
        setFilteredReceptionists([]);
      } else {
        setReceptionists(response);
        setFilteredReceptionists(response);
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tải dữ liệu lễ tân",
        variant: "destructive",
      });
      setReceptionists([]);
      setFilteredReceptionists([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const filtered = receptionists.filter((receptionist) =>
      receptionist.receptionistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receptionist.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredReceptionists(filtered);
    setCurrentPage(0); 
  }, [searchQuery, receptionists]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * pageSize < filteredReceptionists.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleDeleteReceptionist = (employeeId: string) => {
    toast({
      title: "Lễ tân đã bị xóa",
      description: "Lễ tân đã được xóa thành công khỏi hệ thống.",
    });
    fetchData(); // Refresh data after deletion
  };

  const getStatusBadge = (active: boolean) => {
    return active ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Hoạt động</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Không hoạt động</Badge>
    );
  };

  const paginatedReceptionists = filteredReceptionists.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const totalPages = Math.ceil(filteredReceptionists.length / pageSize);
  const isFirstPage = currentPage === 0;
  const isLastPage = (currentPage + 1) * pageSize >= filteredReceptionists.length;

  return (
    <div className="flex flex-col h-screen bg-[#EAE4E1]">
      <Header title="Lễ tân" subtitle="Quản lý và xem thông tin tất cả lễ tân" />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#4D3C2D] mb-2">Đội ngũ lễ tân</h1>
              <p className="text-[#4D3C2D]/70">Quản lý nhân viên lễ tân của bệnh viện</p>
            </div>
            <div className="flex gap-3">
              <AddReceptionistDialog />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card className="bg-white/90 border-[#D9CAC2] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-[#4D3C2D] mb-1">{receptionists.length}</div>
                    <div className="text-sm font-medium text-[#4D3C2D]/70">Tổng số lễ tân</div>
                  </div>
                  <div className="w-12 h-12 bg-[#D9CAC2]/20 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-[#D9CAC2] rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 border-[#D9CAC2] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {receptionists.filter(r => r.active).length}
                    </div>
                    <div className="text-sm font-medium text-[#4D3C2D]/70">Hoạt động</div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 border-[#D9CAC2] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-red-600 mb-1">
                      {receptionists.filter(r => !r.active).length}
                    </div>
                    <div className="text-sm font-medium text-[#4D3C2D]/70">Không hoạt động</div>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4D3C2D]/60 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc ID..."
            className="pl-10 bg-white/80 border-[#D9CAC2] focus:border-[#4D3C2D]"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {loading ? (
          <div className="text-center text-[#4D3C2D]">Đang tải...</div>
        ) : filteredReceptionists.length === 0 ? (
          <div className="text-center py-8 text-[#4D3C2D]/70">
            Không tìm thấy lễ tân nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedReceptionists.map((receptionist) => (
              <Card key={receptionist.employeeId} className="bg-white/95 border-[#D9CAC2] hover:shadow-xl transition-all duration-300 hover:bg-white hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14 border-2 border-[#D9CAC2]">
                        <AvatarFallback className="bg-[#D9CAC2] text-[#4D3C2D] font-semibold text-lg">
                          {getInitials(receptionist.receptionistName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-[#4D3C2D] text-lg">{receptionist.receptionistName}</h3>
                        <p className="text-sm text-[#4D3C2D]/60 font-medium">{receptionist.employeeId}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-[#4D3C2D] hover:bg-[#D9CAC2]/20">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-[#D9CAC2]">
                        <DropdownMenuItem className="cursor-pointer">
                          <div className="flex items-center">
                            Xem chi tiết
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <div className="flex items-center">
                            Chỉnh sửa
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 hover:bg-red-50 cursor-pointer"
                          onClick={() => handleDeleteReceptionist(receptionist.employeeId)}
                        >
                          <div className="flex items-center">
                            Xóa
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-[#4D3C2D]">{receptionist.receptionistPhone}</p>
                      <p className="text-sm text-[#4D3C2D]/60">Số điện thoại</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#4D3C2D]">{receptionist.receptionistAddress}</p>
                      <p className="text-sm text-[#4D3C2D]/60">Địa chỉ</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-[#EAE4E1]/50 rounded-lg">
                        <div className="text-lg font-bold text-[#4D3C2D]">{receptionist.dateOfBirth}</div>
                        <div className="text-xs text-[#4D3C2D]/70">Ngày sinh</div>
                      </div>
                      <div className="text-center p-3 bg-[#EAE4E1]/50 rounded-lg">
                        <div className="text-lg font-bold text-[#4D3C2D]">{receptionist.joinDate}</div>
                        <div className="text-xs text-[#4D3C2D]/70">Ngày tham gia</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      {getStatusBadge(receptionist.active)}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-[#4D3C2D] text-[#4D3C2D] hover:bg-[#4D3C2D] hover:text-white"
                      >
                        Xem hồ sơ
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-8 p-4">
          <div className="text-sm text-[#4D3C2D]/70">
            Hiển thị {paginatedReceptionists.length} trong số {filteredReceptionists.length} lễ tân
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#D9CAC2] text-[#4D3C2D]"
              onClick={handlePrevPage}
              disabled={isFirstPage || loading}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#4D3C2D] text-white border-[#4D3C2D]"
              disabled
            >
              Trang {currentPage + 1} / {totalPages}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#D9CAC2] text-[#4D3C2D]"
              onClick={handleNextPage}
              disabled={isLastPage || loading}
            >
              Tiếp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receptionists;