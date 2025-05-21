"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { MoreHorizontal, Eye, Edit, Trash, Plus, X } from "lucide-react";
import { DeleteUserDialog } from "./delete-user-dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { adminService } from "@/app/services/admin-api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserForm } from "./user-form";

// Base user interface
interface BaseUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

// Response interfaces for each user type
interface ClientResponse {
  User: {
    Role: "client";
    data: {
      id: string;
      user: BaseUser;
      is_probono: boolean;
      probono_document: string;
      probono_status: string;
      probono_rejected_reason: string | null;
      probono_approved_at: string | null;
      probono_expires_at: string | null;
    };
  }
}

interface AttorneyResponse {
  User: {
    Role: "attorney";
    data: {
      id: string;
      user: BaseUser;
      starting_price: number | null;
      is_available: boolean;
      offers_probono: boolean;
      address: string;
      rating: number;
      profile_completion: number;
      license_document: string;
      is_approved: boolean;
      expertise: string[];
    };
  }
}

interface AdminResponse {
  User: {
    Role: "admin";
    data: BaseUser;
  }
}

type UserResponse = ClientResponse | AttorneyResponse | AdminResponse;

export function UserList() {
  const router = useRouter();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUserAttorney();
      setUsers(data);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Authentication required') || error.message.includes('No authentication token found')) {
          toast.error("Please log in to continue");
          router.push('/login');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to fetch users");
      }
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await adminService.deleteUser(userToDelete);
        setUsers(users.filter((user) => {
          if (adminService.isAdmin(user)) {
            return user.User.data.id !== userToDelete;
          }
          return user.User.data.id !== userToDelete;
        }));
        toast.success("User deleted successfully");
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('Authentication required')) {
            toast.error("Please log in to continue");
            router.push('/login');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.error("Failed to delete user");
        }
        console.error("Error deleting user:", error);
      } finally {
        setUserToDelete(null);
        setDeleteDialogOpen(false);
      }
    }
  };

  const toggleAttorneyApproval = async (userId: string) => {
    try {
      const updatedUser = await adminService.toggleAttorneyApproval(userId);
      setUsers(users.map((user) => {
        if (adminService.isAttorney(user) && user.User.data.id === userId) {
          return updatedUser as AttorneyResponse;
        }
        return user;
      }));
      toast.success("Attorney approval status updated");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Authentication required')) {
          toast.error("Please log in to continue");
          router.push('/login');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to update attorney approval status");
      }
      console.error("Error toggling attorney approval:", error);
    }
  };

  const handleUserCreated = async (newUser: BaseUser) => {
    try {
      const createdUser = await adminService.createAdmin({
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        password: "", // You'll need to handle this in your form
        confirm_password: "", // You'll need to handle this in your form
        role: newUser.role,
      });
      setUsers([...users, createdUser as UserResponse]);
      setCreateDialogOpen(false);
      toast.success("User created successfully");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Authentication required')) {
          toast.error("Please log in to continue");
          router.push('/login');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to create user");
      }
      console.error("Error creating user:", error);
    }
  };

  const handleEditUser = async (user: UserResponse) => {
    try {
      const userDetails = await adminService.getUserById(
        adminService.isAdmin(user) ? user.User.data.id : user.User.data.user.id
      );
      setSelectedUser(userDetails as UserResponse);
      setEditDialogOpen(true);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Authentication required')) {
          toast.error("Please log in to continue");
          router.push('/login');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to fetch user details");
      }
      console.error("Error fetching user details:", error);
    }
  };

  const handleViewUser = async (user: UserResponse) => {
    try {
      const userDetails = await adminService.getUserById(
        adminService.isAdmin(user) ? user.User.data.id : user.User.data.user.id
      );
      setSelectedUser(userDetails as UserResponse);
      setViewDialogOpen(true);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Authentication required')) {
          toast.error("Please log in to continue");
          router.push('/login');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to fetch user details");
      }
      console.error("Error fetching user details:", error);
    }
  };

  const handleUserUpdated = async (updatedUser: BaseUser) => {
    try {
      const result = await adminService.updateUser(updatedUser.id, {
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
      setUsers(users.map((user) => {
        const userId = adminService.isAdmin(user) ? user.User.data.id : user.User.data.user.id;
        return userId === result.id ? (result as UserResponse) : user;
      }));
      setEditDialogOpen(false);
      toast.success("User updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Authentication required')) {
          toast.error("Please log in to continue");
          router.push('/login');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to update user");
      }
      console.error("Error updating user:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#263A56]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#263A56]">User List</h2>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
  <DialogTrigger asChild>
    <Button className="bg-[#263A56] hover:bg-[#263A56]/90 text-white">
      <Plus className="h-4 w-4 mr-2" />
      Add New User
    </Button>
  </DialogTrigger>
  <DialogContent className="w-full max-w-3xl max-h-[80vh] overflow-y-auto p-6 rounded-lg bg-white shadow-xl">
    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
      <DialogTitle className="text-lg font-semibold text-[#263A56]">Create New User</DialogTitle>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-gray-100"
        onClick={() => setCreateDialogOpen(false)}
      >
       
      </Button>
    </div>
    <div className="mt-4">
      <UserForm mode="create" onSuccess={handleUserCreated} onCancel={() => setCreateDialogOpen(false)} />
    </div>
  </DialogContent>
</Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="w-full max-w-3xl max-h-[80vh] overflow-y-auto p-6 rounded-lg bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <DialogTitle className="text-lg font-semibold text-[#263A56]">Edit User</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              onClick={() => setEditDialogOpen(false)}
            >
           
            </Button>
          </div>
          <div className="mt-4">
            {selectedUser && (
              <UserForm 
                mode="edit" 
                user={selectedUser}
                onSuccess={handleUserUpdated} 
                onCancel={() => setEditDialogOpen(false)} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="w-full max-w-2xl p-6 rounded-lg bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <DialogTitle className="text-lg font-semibold text-[#263A56]">User Details</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              onClick={() => setViewDialogOpen(false)}
            >
          
            </Button>
          </div>
          {selectedUser && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1 text-[#263A56]">{selectedUser.User.data.first_name} {selectedUser.User.data.last_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-[#263A56]">{selectedUser.User.data.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Role</h3>
                  <Badge
                    variant={selectedUser.User.data.role === "admin" ? "destructive" : selectedUser.User.data.role === "attorney" ? "default" : "secondary"}
                    className="mt-1"
                  >
                    {selectedUser.User.data.role.charAt(0).toUpperCase() + selectedUser.User.data.role.slice(1)}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                  <p className="mt-1 text-[#263A56]">{new Date(selectedUser.User.data.created_at).toLocaleDateString()}</p>
                </div>
                {selectedUser.User.data.role === "attorney" && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Attorney Status</h3>
                    <div className="mt-1 flex items-center space-x-2">
                      <Switch
                        checked={selectedUser.User.data.is_attorney_approved}
                        onCheckedChange={() => toggleAttorneyApproval(selectedUser.User.data.id)}
                        className="data-[state=checked]:bg-[#263A56]"
                      />
                      <span className="text-[#263A56]">
                        {selectedUser.User.data.is_attorney_approved ? "Approved" : "Not Approved"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200">
              <TableHead className="py-4 px-6 text-left text-[#263A56] font-semibold hidden sm:table-cell">Name</TableHead>
              <TableHead className="py-4 px-6 text-left text-[#263A56] font-semibold">Email</TableHead>
              <TableHead className="py-4 px-6 text-left text-[#263A56] font-semibold hidden md:table-cell">Role</TableHead>
              <TableHead className="py-4 px-6 text-left text-[#263A56] font-semibold hidden lg:table-cell">Created At</TableHead>
              <TableHead className="py-4 px-6 text-left w-[80px] sm:w-[100px] text-[#263A56] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const baseUser = adminService.isAdmin(user) ? user.User.data : user.User.data.user;
              return (
                <TableRow
                  key={baseUser.id}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-200"
                >
                  <TableCell className="py-4 px-6 font-medium text-[#263A56] hidden sm:table-cell">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8 border border-gray-200">
                        <AvatarImage src={baseUser.image || undefined} alt={`${baseUser.first_name} ${baseUser.last_name}`} />
                        <AvatarFallback className="bg-[#263A56] text-white text-sm">
                          {baseUser.first_name.charAt(0)}{baseUser.last_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{baseUser.first_name} {baseUser.last_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="sm:hidden">
                      <div className="flex items-center space-x-3 mb-2">
                        <Avatar className="h-8 w-8 border border-gray-200">
                          <AvatarImage src={baseUser.image || undefined} alt={`${baseUser.first_name} ${baseUser.last_name}`} />
                          <AvatarFallback className="bg-[#263A56] text-white text-sm">
                            {baseUser.first_name.charAt(0)}{baseUser.last_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-[#263A56]">{baseUser.first_name} {baseUser.last_name}</span>
                      </div>
                      <span className="text-gray-600">{baseUser.email}</span>
                    </div>
                    <span className="hidden sm:inline text-gray-600">{baseUser.email}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6 hidden md:table-cell">
                    <Badge
                      variant={baseUser.role === "admin" ? "destructive" : baseUser.role === "attorney" ? "default" : "secondary"}
                      className="font-medium"
                    >
                      {baseUser.role.charAt(0).toUpperCase() + baseUser.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-gray-600 hidden lg:table-cell">
                    {new Date(baseUser.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 rounded-full text-gray-600 hover:bg-[#263A56]/10 hover:text-[#263A56] transition-colors duration-200"
                        onClick={() => handleViewUser(user)}
                        title="View User"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View User</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 rounded-full text-gray-600 hover:bg-[#263A56]/10 hover:text-[#263A56] transition-colors duration-200"
                        onClick={() => handleEditUser(user)}
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit User</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 rounded-full text-red-600 hover:bg-red-100 transition-colors duration-200"
                        onClick={() => handleDeleteUser(baseUser.id)}
                        title="Delete User"
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete User</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <DeleteUserDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} onConfirm={confirmDelete} />
    </div>
  );
}