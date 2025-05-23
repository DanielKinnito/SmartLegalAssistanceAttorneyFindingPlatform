import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { UserList } from "./admin-componets/user-list";
export default function UserManagement() {
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          User Management
        </h1>
        <Link href="/Admin/users/create">
          <Button className="gap-1 bg-[#263A56] hover:bg-[#263A56]/90 text-white">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div> */}
      <UserList />
    </div>
  );
}