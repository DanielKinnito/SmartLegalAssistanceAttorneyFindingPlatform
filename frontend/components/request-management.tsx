"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, MoreHorizontal, Search, SlidersHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const requests = [
  {
    id: 1,
    client: "Emma Thompson",
    clientEmail: "emma.t@example.com",
    type: "Pro Bono",
    category: "Family Law",
    status: "Pending",
    date: "Apr 15, 2023",
    urgency: "High",
    initials: "ET",
    description:
      "Seeking assistance with child custody case. Single mother of two children, currently unemployed due to medical issues.",
  },
  {
    id: 2,
    client: "Robert Garcia",
    clientEmail: "r.garcia@example.com",
    type: "Pro Bono",
    category: "Housing",
    status: "Approved",
    date: "Apr 10, 2023",
    urgency: "Medium",
    initials: "RG",
    description:
      "Facing eviction due to landlord refusing to make necessary repairs to apartment. Need legal assistance to prevent eviction.",
  },
  {
    id: 3,
    client: "Sophia Lee",
    clientEmail: "sophia.l@example.com",
    type: "Pro Bono",
    category: "Immigration",
    status: "Rejected",
    date: "Apr 8, 2023",
    urgency: "Low",
    initials: "SL",
    description: "Need assistance with visa application process. Currently on student visa that expires in 6 months.",
  },
  {
    id: 4,
    client: "Marcus Johnson",
    clientEmail: "m.johnson@example.com",
    type: "Pro Bono",
    category: "Employment",
    status: "Pending",
    date: "Apr 18, 2023",
    urgency: "High",
    initials: "MJ",
    description: "Wrongful termination case. Was fired after reporting unsafe working conditions at construction site.",
  },
  {
    id: 5,
    client: "Jasmine Williams",
    clientEmail: "j.williams@example.com",
    type: "Pro Bono",
    category: "Consumer Rights",
    status: "Pending",
    date: "Apr 20, 2023",
    urgency: "Medium",
    initials: "JW",
    description:
      "Victim of predatory lending practices with excessive interest rates. Seeking legal advice on options.",
  },
]

export function RequestManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<(typeof requests)[0] | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleViewRequest = (request: (typeof requests)[0]) => {
    setSelectedRequest(request)
    setDialogOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Request Management</h1>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search requests..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
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
              <TableHead>Client</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden md:table-cell">Urgency</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{request.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{request.client}</p>
                      <p className="text-sm text-muted-foreground">{request.type}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{request.category}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      request.status === "Approved" ? "default" : request.status === "Pending" ? "outline" : "secondary"
                    }
                  >
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{request.date}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge
                    variant="outline"
                    className={
                      request.urgency === "High"
                        ? "border-red-500 text-red-500"
                        : request.urgency === "Medium"
                          ? "border-yellow-500 text-yellow-500"
                          : "border-green-500 text-green-500"
                    }
                  >
                    {request.urgency}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewRequest(request)}>View Details</DropdownMenuItem>
                      {request.status === "Pending" && (
                        <>
                          <DropdownMenuItem>Approve</DropdownMenuItem>
                          <DropdownMenuItem>Reject</DropdownMenuItem>
                        </>
                      )}
                      {request.status === "Approved" && <DropdownMenuItem>Assign Attorney</DropdownMenuItem>}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedRequest && (
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Pro Bono Request Details</DialogTitle>
              <DialogDescription>Review the request details before making a decision.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{selectedRequest.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedRequest.client}</h3>
                  <p className="text-sm text-muted-foreground">{selectedRequest.clientEmail}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm">{selectedRequest.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date Submitted</p>
                  <p className="text-sm">{selectedRequest.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge
                    variant={
                      selectedRequest.status === "Approved"
                        ? "default"
                        : selectedRequest.status === "Pending"
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {selectedRequest.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Urgency</p>
                  <Badge
                    variant="outline"
                    className={
                      selectedRequest.urgency === "High"
                        ? "border-red-500 text-red-500"
                        : selectedRequest.urgency === "Medium"
                          ? "border-yellow-500 text-yellow-500"
                          : "border-green-500 text-green-500"
                    }
                  >
                    {selectedRequest.urgency}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm mt-1">{selectedRequest.description}</p>
              </div>
            </div>
            <DialogFooter>
              {selectedRequest.status === "Pending" && (
                <>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Reject
                  </Button>
                  <Button className="w-full sm:w-auto">Approve</Button>
                </>
              )}
              {selectedRequest.status === "Approved" && <Button className="w-full sm:w-auto">Assign Attorney</Button>}
              {selectedRequest.status === "Rejected" && (
                <Button variant="outline" className="w-full sm:w-auto">
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
