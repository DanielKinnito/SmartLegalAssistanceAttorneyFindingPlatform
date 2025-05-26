"use client"
import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, MoreHorizontal, Plus, Search, SlidersHorizontal, Eye, Check, X, Clock } from "lucide-react"
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
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

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

  const handleProBonoStatusChange = (clientId: string, newStatus: "pending" | "approved" | "rejected") => {
    setSelectedClientId(clientId)
    if (newStatus === "rejected") {
      setShowRejectionDialog(true)
    } else {
      toggleProBonoApproval(clientId, { 
        status: newStatus
      })
    }
  }

  const toggleProBonoApproval = async (clientId: string, data: { 
    status: "pending" | "approved" | "rejected", 
    rejected_reason?: string 
  }) => {
    try {
      // Find the client to get the user ID
      const client = clients.find(c => c.id === clientId);
      if (!client) {
        throw new Error("Client not found");
      }

      // Optimistically update the UI
      setClients(prevClients => 
        prevClients.map(client => {
          if (client.id === clientId) {
            return {
              ...client,
              probono_status: data.status,
              probono_rejected_reason: data.rejected_reason || null,
              probono_approved_at: data.status === "approved" ? new Date().toISOString() : null,
              probono_expires_at: data.status === "approved" ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null
            }
          }
          return client
        })
      )

      // Make the API call with the user ID
      await adminService.toggleClientProBonoApproval(client.user.id, data)
      
      // Show success message
      toast.success(
        data.status === "approved" 
          ? "Pro Bono request approved successfully" 
          : data.status === "rejected"
          ? "Pro Bono request rejected successfully"
          : "Pro Bono status updated to pending"
      )
      
      // Reset states
      setShowRejectionDialog(false)
      setRejectionReason("")
      setSelectedClientId(null)

      // Refresh the clients list to ensure we have the latest data
      await fetchClients()
    } catch (err) {
      console.error("Error updating pro bono status:", err)
      
      // Revert the optimistic update
      await fetchClients()
      
      // Show error message
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error("Failed to update pro bono status. Please try again.")
      }

      // Reset states on error
      setShowRejectionDialog(false)
      setRejectionReason("")
      setSelectedClientId(null)
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-[140px] justify-between bg-[#29374A] text-white hover:bg-[#29374A]/90">
                        {client.probono_status === "approved" ? (
                          <>
                            <Check className="h-4 w-4 text-white" />
                            Approved
                          </>
                        ) : client.probono_status === "rejected" ? (
                          <>
                            <X className="h-4 w-4 text-white" />
                            Rejected
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 text-white" />
                            Pending
                          </>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuItem
                        onClick={() => handleProBonoStatusChange(client.id, "pending")}
                        className="flex items-center gap-2 hover:bg-[#29374A] hover:text-white"
                      >
                        <Clock className="h-4 w-4 text-yellow-600" />
                        Set as Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleProBonoStatusChange(client.id, "approved")}
                        className="flex items-center gap-2 hover:bg-[#29374A] hover:text-white"
                      >
                        <Check className="h-4 w-4 text-green-600" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleProBonoStatusChange(client.id, "rejected")}
                        className="flex items-center gap-2 hover:bg-[#29374A] hover:text-white"
                      >
                        <X className="h-4 w-4 text-red-600" />
                        Reject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#263A56]">Reject Pro Bono Request</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="reason" className="text-sm font-medium text-gray-700">
                Rejection Reason
              </label>
              <textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#263A56]"
                placeholder="Enter reason for rejection..."
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectionDialog(false)
                setRejectionReason("")
                setSelectedClientId(null)
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#263A56] hover:bg-[#263A56]/90 text-white"
              onClick={() => {
                if (!rejectionReason.trim()) {
                  toast.error("Please provide a reason for rejection")
                  return
                }
                if (selectedClientId) {
                  toggleProBonoApproval(selectedClientId, {
                    status: "rejected",
                    rejected_reason: rejectionReason.trim()
                  })
                }
              }}
            >
              Confirm Rejection
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-[140px] justify-between bg-[#29374A] text-white hover:bg-[#29374A]/90">
                          {selectedClient.probono_status === "approved" ? (
                            <>
                              <Check className="h-4 w-4 text-white" />
                              Approved
                            </>
                          ) : selectedClient.probono_status === "rejected" ? (
                            <>
                              <X className="h-4 w-4 text-white" />
                              Rejected
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4 text-white" />
                              Pending
                            </>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem
                          onClick={() => handleProBonoStatusChange(selectedClient.id, "pending")}
                          className="flex items-center gap-2 hover:bg-[#29374A] hover:text-white"
                        >
                          <Clock className="h-4 w-4 text-yellow-600" />
                          Set as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleProBonoStatusChange(selectedClient.id, "approved")}
                          className="flex items-center gap-2 hover:bg-[#29374A] hover:text-white"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleProBonoStatusChange(selectedClient.id, "rejected")}
                          className="flex items-center gap-2 hover:bg-[#29374A] hover:text-white"
                        >
                          <X className="h-4 w-4 text-red-600" />
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
