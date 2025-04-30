"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, MoreHorizontal, Plus, Search, SlidersHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const attorneys = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    specialty: "Family Law",
    status: "Active",
    cases: 12,
    joined: "Jan 10, 2023",
    initials: "JS",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    specialty: "Corporate Law",
    status: "Active",
    cases: 8,
    joined: "Mar 15, 2023",
    initials: "SJ",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "m.chen@example.com",
    specialty: "Criminal Defense",
    status: "Pending",
    cases: 0,
    joined: "Apr 22, 2023",
    initials: "MC",
  },
  {
    id: 4,
    name: "Jessica Williams",
    email: "j.williams@example.com",
    specialty: "Immigration Law",
    status: "Active",
    cases: 15,
    joined: "Feb 5, 2023",
    initials: "JW",
  },
  {
    id: 5,
    name: "David Rodriguez",
    email: "d.rodriguez@example.com",
    specialty: "Real Estate Law",
    status: "Inactive",
    cases: 3,
    joined: "May 18, 2023",
    initials: "DR",
  },
]

export function AttorneyManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Attorney Management</h1>
        <Button className="gap-1">
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
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Cases</TableHead>
              <TableHead className="hidden md:table-cell">Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attorneys.map((attorney) => (
              <TableRow key={attorney.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{attorney.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{attorney.name}</p>
                      <p className="text-sm text-muted-foreground">{attorney.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{attorney.specialty}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      attorney.status === "Active" ? "default" : attorney.status === "Pending" ? "outline" : "secondary"
                    }
                  >
                    {attorney.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{attorney.cases}</TableCell>
                <TableCell className="hidden md:table-cell">{attorney.joined}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem>Manage Cases</DropdownMenuItem>
                      {attorney.status === "Pending" && <DropdownMenuItem>Approve</DropdownMenuItem>}
                      {attorney.status === "Active" && <DropdownMenuItem>Deactivate</DropdownMenuItem>}
                      {attorney.status === "Inactive" && <DropdownMenuItem>Activate</DropdownMenuItem>}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
