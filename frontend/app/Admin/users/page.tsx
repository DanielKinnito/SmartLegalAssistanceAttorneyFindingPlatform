"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, MoreHorizontal, Plus, Search, SlidersHorizontal } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-[#263A56]">User Management</h1>
        <Link href="/Admin/users/create">
          <Button className="gap-1 bg-[#263A56] hover:bg-[#263A56]/90 text-white">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8 border-gray-200 focus:border-[#263A56] focus:ring-[#263A56]"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="border-gray-200 hover:bg-[#263A56]/10 hover:text-[#263A56]">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] border-gray-200 focus:border-[#263A56] focus:ring-[#263A56]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="gap-1 border-gray-200 hover:bg-[#263A56]/10 hover:text-[#263A56]">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-[#263A56]">Name</TableHead>
              <TableHead className="text-[#263A56]">Role</TableHead>
              <TableHead className="text-[#263A56]">Status</TableHead>
              <TableHead className="text-[#263A56] hidden md:table-cell">Last Active</TableHead>
              <TableHead className="text-right text-[#263A56]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-gray-50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-gray-200">
                    <AvatarFallback className="bg-[#263A56] text-white">JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-[#263A56]">John Doe</p>
                    <p className="text-sm text-gray-500">john.doe@example.com</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-[#263A56]">Admin</TableCell>
              <TableCell>
                <Badge variant="default">Active</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-gray-500">2 hours ago</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-[#263A56]/10 hover:text-[#263A56]">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-gray-200">
                    <DropdownMenuItem className="text-[#263A56] hover:bg-[#263A56]/10">View Profile</DropdownMenuItem>
                    <DropdownMenuItem className="text-[#263A56] hover:bg-[#263A56]/10">Edit Details</DropdownMenuItem>
                    <DropdownMenuItem className="text-[#263A56] hover:bg-[#263A56]/10">Reset Password</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 hover:bg-red-50">Deactivate</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}