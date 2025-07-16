"use client";

import { useState, useEffect, useCallback } from 'react';
import { Header } from "@components/AdminHeader";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback } from "@components/ui/avatar";
import { Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@components/ui/pagination";
import { useToast } from "@hooks/use-toast";
import { fetchReceptionists } from '@api/adminApi';
import { AddReceptionistDialog } from '@components/AddReceptionistDialog';
import { DeleteReceptionistDialog } from '@components/DeleteReceptionistDialog';

interface Receptionist {
  employeeId: string;
  receptionistName: string;
  receptionistPhone: string;
  receptionistAddress: string;
  dateOfBirth: string;
  joinDate: string;
  active: boolean;
}

interface ReceptionistApiResponse {
  content: Receptionist[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

const Receptionists = () => {
  const { toast } = useToast();
  const [receptionists, setReceptionists] = useState<Receptionist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
    setError(null);
    try {
      const response: ReceptionistApiResponse = await fetchReceptionists({
        page: currentPage,
        size: pageSize,
        search: searchQuery,
      });
      const activeReceptionists = response.content.filter(r => r.active);
      setReceptionists(activeReceptionists);
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
      setCurrentPage(response.number);
      setPageSize(response.size);
    } catch (error: any) {
      const message = error.message || "Không thể tải dữ liệu lễ tân";
      setError(message);
      toast({
        title: "Lỗi",
        description: message,
        variant: "destructive",
      });
      setReceptionists([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Reset to first page on search
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };

  const renderPaginationLinks = () => {
    const links = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (startPage > 0) {
      links.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 1) {
        links.push(<PaginationItem key="ellipsis-start"><PaginationEllipsis /></PaginationItem>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => handlePageChange(i + 1)} isActive={currentPage === i}>
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        links.push(<PaginationItem key="ellipsis-end"><PaginationEllipsis /></PaginationItem>);
      }
      links.push(
        <PaginationItem key={totalPages - 1}>
          <PaginationLink onClick={() => handlePageChange(totalPages)}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }
    return links;
  };

  const handleDeleteReceptionist = (employeeId: string) => {
    setReceptionists(prev => prev.filter(r => r.employeeId !== employeeId));
    fetchData(); // Refresh data after deletion
  };

  const getStatusBadge = (active: boolean) => {
    return active ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Hoạt động</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Không hoạt động</Badge>
    );
  };

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
              <AddReceptionistDialog onAdd={fetchData} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6">
            <Card className="bg-white/90 border-[#D9CAC2] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-[#4D3C2D] mb-1">{totalElements}</div>
                    <div className="text-sm font-medium text-[#4D3C2D]/70">Tổng số lễ tân</div>
                  </div>
                  <div className="w-12 h-12 bg-[#D9CAC2]/20 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-[#D9CAC2] rounded-full"></div>
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
        ) : error ? (
          <div className="text-center py-8 text-red-500">Lỗi: {error}</div>
        ) : receptionists.length === 0 ? (
          <div className="text-center py-8 text-[#4D3C2D]/70">
            Không tìm thấy lễ tân nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {receptionists.map((receptionist) => (
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
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#4D3C2D]/60 min-w-[100px]">Số điện thoại:</span>
                      <span className="text-sm font-semibold text-[#4D3C2D]">{receptionist.receptionistPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#4D3C2D]/60 min-w-[100px]">Địa chỉ:</span>
                      <span className="text-sm font-semibold text-[#4D3C2D]">{receptionist.receptionistAddress}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#4D3C2D]/60 min-w-[100px]">Ngày sinh:</span>
                      <span className="text-sm font-semibold text-[#4D3C2D]">{receptionist.dateOfBirth}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#4D3C2D]/60 min-w-[100px]">Ngày tham gia:</span>
                      <span className="text-sm font-semibold text-[#4D3C2D]">{receptionist.joinDate}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      {getStatusBadge(receptionist.active)}
                      <DeleteReceptionistDialog
                        employeeId={receptionist.employeeId}
                        receptionistName={receptionist.receptionistName}
                        onDelete={handleDeleteReceptionist}
                        trigger={
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-[#4D3C2D] text-[#4D3C2D] hover:bg-[#4D3C2D] hover:text-white"
                          >
                            Xóa
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-8 p-4">
          <div className="text-sm text-[#4D3C2D]/70">
            Hiển thị {receptionists.length} trong số {totalElements} lễ tân
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePreviousPage}
                  className={currentPage === 0 ? 'pointer-events-none opacity-50' : ''}
                >
                  Trước
                </PaginationPrevious>
              </PaginationItem>
              {renderPaginationLinks()}
              <PaginationItem>
                <PaginationNext
                  onClick={handleNextPage}
                  className={currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : ''}
                >
                  Tiếp
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default Receptionists;