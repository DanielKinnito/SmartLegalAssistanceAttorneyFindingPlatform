"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, MoreHorizontal, Plus, Search, Eye, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { adminService } from "@/app/services/admin-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Attorney {
  id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    image: string | null;
    created_at: string;
    updated_at: string;
  };
  starting_price: number | null;
  is_available: boolean;
  offers_probono: boolean;
  address: string;
  rating: number;
  profile_completion: number;
  license_document: string;
  is_approved: boolean;
  expertise: string[];
}

export function AttorneyManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedAttorney, setSelectedAttorney] = useState<Attorney | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAttorneys();
  }, []);

  const fetchAttorneys = async () => {
    try {
      setLoading(true);
      const apiUsers = await adminService.getUserAttorney();
      const attorneyUsers = apiUsers
        .filter(apiUser => apiUser.User?.Role === 'attorney')
        .map(apiUser => ({
          ...apiUser.User.data,
          user: {
            id: apiUser.User.data.user.id,
            first_name: apiUser.User.data.user.first_name,
            last_name: apiUser.User.data.user.last_name,
            email: apiUser.User.data.user.email,
            role: apiUser.User.data.user.role,
            image: apiUser.User.data.user.image,
            created_at: apiUser.User.data.user.created_at,
            updated_at: apiUser.User.data.user.updated_at,
          }
        })) as Attorney[];

      setAttorneys(attorneyUsers);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("Failed to fetch attorneys");
        toast.error("Failed to fetch attorneys");
      }
      console.error("Error fetching attorneys:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttorneyApproval = async (userId: string) => {
    try {
      setTogglingId(userId); // Set loading state for this specific toggle
      
      // Find the attorney before toggling to get current state
      const attorney = attorneys.find(att => att.user.id === userId);
      if (!attorney) {
        throw new Error("Attorney not found");
      }

      const response = await adminService.toggleAttorneyApproval(userId);
      
      // Update the attorneys list with the new approval status
      setAttorneys(prevAttorneys => 
        prevAttorneys.map(att => {
          if (att.user.id === userId) {
            return {
              ...att,
              is_approved: !att.is_approved,
            };
          }
          return att;
        })
      );

      // Show success message
      toast.success(`Attorney ${attorney.is_approved ? 'unapproved' : 'approved'} successfully`);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to update attorney approval status");
      }
      console.error("Error toggling attorney approval:", err);
    } finally {
      setTogglingId(null); // Clear loading state
    }
  };

  const handleViewAttorney = (attorney: Attorney) => {
    setSelectedAttorney(attorney);
    setViewDialogOpen(true);
  };

  const filteredAttorneys = attorneys.filter((attorney) => {
    const matchesSearch =
      attorney.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attorney.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attorney.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attorney.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && attorney.is_approved) ||
      (filterStatus === "pending" && !attorney.is_approved);

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#263A56]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-8">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-[#263A56]">Attorney Management</h1>
        <Button className="bg-[#263A56] hover:bg-[#263A56]/90 text-white gap-1">
          <Plus className="h-4 w-4" />
          Add Attorney
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search attorneys..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Approved</SelectItem>
              <SelectItem value="pending">Pending Approval</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="gap-1 text-[#263A56] border-gray-300 hover:bg-gray-100">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-4 px-6 text-left text-[#263A56] font-semibold">Name</TableHead>
              <TableHead className="py-4 px-6 text-left text-[#263A56] font-semibold">Availability</TableHead>
              <TableHead className="py-4 px-6 text-left text-[#263A56] font-semibold">Pro Bono</TableHead>
              <TableHead className="py-4 px-6 text-left text-[#263A56] font-semibold">License</TableHead>
              <TableHead className="py-4 px-6 text-left text-[#263A56] font-semibold">Approved</TableHead>
              <TableHead className="py-4 px-6 text-right text-[#263A56] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttorneys.map((attorney) => (
              <TableRow key={attorney.id}>
                <TableCell className="py-4 px-6 font-medium text-[#263A56]">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-gray-200">
                      <AvatarImage src={attorney.user.image || undefined} alt={`${attorney.user.first_name} ${attorney.user.last_name}`} />
                      <AvatarFallback className="bg-[#263A56] text-white text-sm">
                        {`${attorney.user.first_name.charAt(0)}${attorney.user.last_name.charAt(0)}`}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{attorney.user.first_name} {attorney.user.last_name}</p>
                      <p className="text-sm text-gray-500">{attorney.user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Badge variant={attorney.is_available ? "default" : "secondary"}>
                    {attorney.is_available ? "Available" : "Unavailable"}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Badge variant={attorney.offers_probono ? "default" : "secondary"}>
                    {attorney.offers_probono ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-6">
                  {attorney.license_document ? (
                    <a 
                      href={attorney.license_document} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View License
                    </a>
                  ) : (
                    <span className="text-gray-500">Not uploaded</span>
                  )}
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={attorney.is_approved}
                      onCheckedChange={() => toggleAttorneyApproval(attorney.user.id)}
                      disabled={togglingId === attorney.user.id}
                      className={`data-[state=checked]:bg-[#29374A] ${
                        togglingId === attorney.user.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    />
                    <span className="text-sm text-gray-600">
                      {attorney.is_approved ? "Approved" : "Not Approved"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right py-4 px-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewAttorney(attorney)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View Details</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Attorney Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#263A56] text-xl font-semibold">Attorney Details</DialogTitle>
          </DialogHeader>
          {selectedAttorney && (
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-[#263A56] mb-3">Personal Information</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700"><span className="font-medium text-gray-900">Name:</span> {selectedAttorney.user.first_name} {selectedAttorney.user.last_name}</p>
                    <p className="text-gray-700"><span className="font-medium text-gray-900">Email:</span> {selectedAttorney.user.email}</p>
                    <p className="text-gray-700"><span className="font-medium text-gray-900">Address:</span> {selectedAttorney.address || 'Not provided'}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-[#263A56] mb-3">Professional Details</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700"><span className="font-medium text-gray-900">Starting Price:</span> {selectedAttorney.starting_price ? `$${selectedAttorney.starting_price}` : 'Not set'}</p>
                    <p className="text-gray-700"><span className="font-medium text-gray-900">Rating:</span> {selectedAttorney.rating.toFixed(1)}</p>
                    <p className="text-gray-700"><span className="font-medium text-gray-900">Profile Completion:</span> {selectedAttorney.profile_completion}%</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-[#263A56] mb-3">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAttorney.expertise.map((exp, index) => (
                      <Badge key={index} variant="secondary" className="bg-[#263A56]/10 text-[#263A56] hover:bg-[#263A56]/20">
                        {exp}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-[#263A56] mb-3">Status</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700"><span className="font-medium text-gray-900">Available:</span> {selectedAttorney.is_available ? 'Yes' : 'No'}</p>
                    <p className="text-gray-700"><span className="font-medium text-gray-900">Pro Bono:</span> {selectedAttorney.offers_probono ? 'Yes' : 'No'}</p>
                    <p className="text-gray-700"><span className="font-medium text-gray-900">Approved:</span> {selectedAttorney.is_approved ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-[#263A56] mb-3">License Document</h3>
                  <div className="mt-2">
                    {selectedAttorney.license_document ? (
                      <a 
                        href={selectedAttorney.license_document} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#263A56] hover:text-[#263A56]/80 hover:underline font-medium"
                      >
                        View License Document
                      </a>
                    ) : (
                      <p className="text-gray-500">No license document uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}