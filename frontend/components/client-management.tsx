"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, MoreHorizontal, Plus, Search, SlidersHorizontal, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { adminService } from "@/app/services/admin-api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Client {
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
  is_probono: boolean;
  probono_document: string;
  probono_status: string;
  probono_rejected_reason: string | null;
  probono_approved_at: string | null;
  probono_expires_at: string | null;
}

export function ClientManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const apiUsers = await adminService.getUserAttorney()
      const clientUsers = apiUsers
        .filter(apiUser => apiUser.User.Role === 'client')
        .map(apiUser => apiUser.User.data) as Client[]

      setClients(clientUsers)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
        toast.error(err.message)
      } else {
        setError("Failed to fetch clients")
        toast.error("Failed to fetch clients")
      }
      console.error("Error fetching clients:", err)
    } finally {
      setLoading(false)
    }
  }

  const toggleProBonoApproval = async (userId: string) => {
    try {
      const updatedUser = await adminService.toggleProBonoApproval(userId)
      setClients(clients.map(client => {
        if (client.id === updatedUser.User.data.id) {
          return {
            ...client,
            probono_status: updatedUser.User.data.probono_status,
            probono_approved_at: updatedUser.User.data.probono_approved_at,
          }
        }
        return client
      }))
      toast.success("Pro Bono status updated")
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error("Failed to update pro bono status")
      }
      console.error("Error updating pro bono status:", err)
    }
  }

  const handleViewClient = (client: Client) => {
    setSelectedClient(client)
    setViewDialogOpen(true)
  }

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "approved" && client.probono_status === "approved") ||
      (filterStatus === "pending" && client.probono_status === "pending") ||
      (filterStatus === "rejected" && client.probono_status === "rejected")

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#263A56]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-8">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-[#263A56]">Client Management</h1>
        <Button className="bg-[#263A56] hover:bg-[#263A56]/90 text-white gap-1">
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pro Bono Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
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
              <TableHead className="py-4 px-6 text-left text-[#263A56] font-semibold">Pro Bono</TableHead>
              <TableHead className="py-4 px-6 text-left text-[#263A56] font-semibold">Status</TableHead>
              <TableHead className="py-4 px-6 text-left text-[#263A56] font-semibold">Document</TableHead>
              <TableHead className="py-4 px-6 text-left text-[#263A56] font-semibold">Approval</TableHead>
              <TableHead className="py-4 px-6 text-right text-[#263A56] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="py-4 px-6 font-medium text-[#263A56]">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-gray-200">
                      <AvatarImage src={client.user.image || undefined} alt={`${client.user.first_name} ${client.user.last_name}`} />
                      <AvatarFallback className="bg-[#263A56] text-white text-sm">
                        {`${client.user.first_name.charAt(0)}${client.user.last_name.charAt(0)}`}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{client.user.first_name} {client.user.last_name}</p>
                      <p className="text-sm text-gray-500">{client.user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Badge variant={client.is_probono ? "default" : "secondary"}>
                    {client.is_probono ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Badge 
                    variant={
                      client.probono_status === "approved" ? "default" :
                      client.probono_status === "rejected" ? "destructive" :
                      "secondary"
                    }
                  >
                    {client.probono_status.charAt(0).toUpperCase() + client.probono_status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-6">
                  {client.probono_document ? (
                    <a 
                      href={client.probono_document} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                  ) : (
                    <span className="text-gray-500">Not uploaded</span>
                  )}
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={client.probono_status === "approved"}
                      onCheckedChange={() => toggleProBonoApproval(client.id)}
                      className="data-[state=checked]:bg-[#263A56]"
                    />
                    <span className="text-sm text-gray-600">
                      {client.probono_status === "approved" ? "Approved" : "Not Approved"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right py-4 px-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewClient(client)}
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

      {/* Client Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#263A56] text-xl font-semibold">Client Details</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-[#263A56] mb-3">Personal Information</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700"><span className="font-medium text-gray-900">Name:</span> {selectedClient.user.first_name} {selectedClient.user.last_name}</p>
                    <p className="text-gray-700"><span className="font-medium text-gray-900">Email:</span> {selectedClient.user.email}</p>
                    <p className="text-gray-700"><span className="font-medium text-gray-900">Joined:</span> {new Date(selectedClient.user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-[#263A56] mb-3">Pro Bono Status</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700"><span className="font-medium text-gray-900">Status:</span> {selectedClient.probono_status.charAt(0).toUpperCase() + selectedClient.probono_status.slice(1)}</p>
                    {selectedClient.probono_approved_at && (
                      <p className="text-gray-700"><span className="font-medium text-gray-900">Approved At:</span> {new Date(selectedClient.probono_approved_at).toLocaleDateString()}</p>
                    )}
                    {selectedClient.probono_expires_at && (
                      <p className="text-gray-700"><span className="font-medium text-gray-900">Expires At:</span> {new Date(selectedClient.probono_expires_at).toLocaleDateString()}</p>
                    )}
                    {selectedClient.probono_rejected_reason && (
                      <p className="text-gray-700"><span className="font-medium text-gray-900">Rejection Reason:</span> {selectedClient.probono_rejected_reason}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-[#263A56] mb-3">Pro Bono Document</h3>
                  <div className="mt-2">
                    {selectedClient.probono_document ? (
                      <a 
                        href={selectedClient.probono_document} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#263A56] hover:text-[#263A56]/80 hover:underline font-medium"
                      >
                        View Pro Bono Document
                      </a>
                    ) : (
                      <p className="text-gray-500">No document uploaded</p>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-[#263A56] mb-3">Actions</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedClient.probono_status === "approved"}
                        onCheckedChange={() => toggleProBonoApproval(selectedClient.id)}
                        className="data-[state=checked]:bg-[#263A56]"
                      />
                      <span className="text-gray-700 font-medium">
                        {selectedClient.probono_status === "approved" ? "Approved" : "Not Approved"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
