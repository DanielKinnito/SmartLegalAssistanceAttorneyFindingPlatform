"use client"

import { Bell, HelpCircle, Search, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { authService } from "@/app/services/api-auth"
import { adminService } from "@/app/services/admin-api"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  image: string | null;
}

export function Navbar() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminUser();
  }, []);

  const fetchAdminUser = async () => {
    try {
      setLoading(true);
      const users = await adminService.getUserAttorney();
      const adminUser = users.find(user => user.User.Role === 'admin');
      
      if (adminUser) {
        setAdminUser(adminUser.User.data);
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to fetch admin user data");
      }
      console.error("Error fetching admin user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/Admin/login');
  };

  return (
    <div className="border-b bg-[#29374A] text-white">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px] lg:w-[300px] pl-8 bg-white/10 text-white placeholder:text-gray-300"
            />
          </div>

          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <HelpCircle className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full text-white hover:bg-white/10">
                <Avatar className="h-8 w-8">
                  {adminUser?.image ? (
                    <AvatarImage src={adminUser.image} alt={`${adminUser.first_name} ${adminUser.last_name}`} />
                  ) : (
                    <AvatarFallback className="bg-[#263A56] text-white">
                      {adminUser ? `${adminUser.first_name.charAt(0)}${adminUser.last_name.charAt(0)}` : 'AD'}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#29374A] text-white border-none shadow-lg" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {adminUser ? `${adminUser.first_name} ${adminUser.last_name}` : 'Loading...'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {adminUser?.email || 'Loading...'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="hover:bg-white/10 cursor-pointer text-red-400 hover:text-red-300"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
