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

const clients = [
  {
    id: 1,
    name: "Emma Thompson",
    email: "emma.t@example.com",
    type: "Individual",
    status: "Active",
    requests: 3,
    joined: "Feb 12, 2023",
    initials: "ET",
  },
  {
    id: 2,
    name: "Robert Garcia",
    email: "r.garcia@example.com",
    type: "Business",
    status: "Active",
    requests: 1,
    joined: "Mar 5, 2023",
    initials: "RG",
  },
  {
    id: 3,
    name: "Sophia Lee",
    email: "sophia.l@example.com",
    type: "Individual",
    status: "Inactive",
    requests: 0,
    joined: "Jan 18, 2023",
    initials: "SL",
  },
  {
    id: 4,
    name: "Marcus Johnson",
    email: "m.johnson@example.com",
    type: "Individual",
    status: "Active",
    requests: 2,
    joined: "Apr 3, 2023",
    initials: "MJ",
  },
  {
    id: 5,
    name: "Acme Corporation",
    email: "contact@acmecorp.com",
    type: "Business",
    status: "Active",
    requests: 5,
    joined: "Dec 10, 2022",
    initials: "AC",
  },
]

export function ClientManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Client Management</h1>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search clients..."
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
              <SelectValue placeholder="Client Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="business">Business</SelectItem>
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
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Requests</TableHead>
              <TableHead className="hidden md:table-cell">Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{client.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{client.type}</TableCell>
                <TableCell>
                  <Badge variant={client.status === "Active" ? "default" : "secondary"}>{client.status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{client.requests}</TableCell>
                <TableCell className="hidden md:table-cell">{client.joined}</TableCell>
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
                      <DropdownMenuItem>View Requests</DropdownMenuItem>
                      {client.status === "Active" && <DropdownMenuItem>Deactivate</DropdownMenuItem>}
                      {client.status === "Inactive" && <DropdownMenuItem>Activate</DropdownMenuItem>}
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
