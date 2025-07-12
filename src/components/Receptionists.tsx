import { useState, useEffect } from 'react';
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

const Receptionists = () => {
  const { toast } = useToast();
  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReceptionists = async () => {
      setLoading(true);
      try {
        const data = await fetchReceptionists(); // fetchReceptionists returns the array directly
        setReceptionists(data); // Set the array directly to state
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to load receptionists",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadReceptionists();
  }, []);

  const getStatusBadge = (active) => {
    return active ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactive</Badge>
    );
  };

  const handleDeleteReceptionist = (employeeId) => {
    toast({
      title: "Receptionist Deleted",
      description: "Receptionist has been successfully removed.",
    });
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col h-screen bg-[#EAE4E1]">
      <Header title="Receptionists" subtitle="Manage and view all receptionist information" />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#4D3C2D] mb-2">Reception Team</h1>
              <p className="text-[#4D3C2D]/70">Manage your hospital's reception staff</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card className="bg-white/90 border-[#D9CAC2] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-[#4D3C2D] mb-1">{receptionists.length}</div>
                    <div className="text-sm font-medium text-[#4D3C2D]/70">Total Receptionists</div>
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
                    <div className="text-sm font-medium text-[#4D3C2D]/70">Active</div>
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
                    <div className="text-sm font-medium text-[#4D3C2D]/70">Inactive</div>
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
            placeholder="Search name, ID..."
            className="pl-10 bg-white/80 border-[#D9CAC2] focus:border-[#4D3C2D]"
          />
        </div>

        {loading ? (
          <div className="text-center text-[#4D3C2D]">Loading...</div>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-[#4D3C2D] hover:bg-[#D9CAC2]/20">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-[#D9CAC2]">
                        <DropdownMenuItem className="cursor-pointer">
                          <div className="flex items-center">
                            View Details
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <div className="flex items-center">
                            Edit
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 hover:bg-red-50 cursor-pointer"
                          onClick={() => handleDeleteReceptionist(receptionist.employeeId)}
                        >
                          <div className="flex items-center">
                            Delete
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-[#4D3C2D]">{receptionist.receptionistPhone}</p>
                      <p className="text-sm text-[#4D3C2D]/60">Phone</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#4D3C2D]">{receptionist.receptionistAddress}</p>
                      <p className="text-sm text-[#4D3C2D]/60">Address</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-[#EAE4E1]/50 rounded-lg">
                        <div className="text-lg font-bold text-[#4D3C2D]">{receptionist.dateOfBirth}</div>
                        <div className="text-xs text-[#4D3C2D]/70">Date of Birth</div>
                      </div>
                      <div className="text-center p-3 bg-[#EAE4E1]/50 rounded-lg">
                        <div className="text-lg font-bold text-[#4D3C2D]">{receptionist.joinDate}</div>
                        <div className="text-xs text-[#4D3C2D]/70">Join Date</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      {getStatusBadge(receptionist.active)}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-[#4D3C2D] text-[#4D3C2D] hover:bg-[#4D3C2D] hover:text-white"
                      >
                        View Profile
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
            Showing {receptionists.length} out of {receptionists.length} receptionists
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-[#D9CAC2] text-[#4D3C2D]">Previous</Button>
            <Button variant="outline" size="sm" className="bg-[#4D3C2D] text-white border-[#4D3C2D]">1</Button>
            <Button variant="outline" size="sm" className="border-[#D9CAC2] text-[#4D3C2D]">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receptionists;