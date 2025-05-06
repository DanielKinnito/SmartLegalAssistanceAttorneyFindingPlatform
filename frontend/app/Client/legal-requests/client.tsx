"use client"

import { useState } from "react"
import { RequestCard } from "./request-card"

// Define request status types
type RequestStatus = "pending" | "accepted" | "completed" | "declined"

// Define request data structure
interface LegalRequest {
  id: string
  attorneyName: string
  specialization: string
  caseType: string
  description: string
  requestedDate: string
  status: RequestStatus
  appointmentDate?: string
  completedDate?: string
  declineReason?: string
}

// Sample data
const sampleRequests: LegalRequest[] = [
  {
    id: "1",
    attorneyName: "Abebe Kebede",
    specialization: "Family Law",
    caseType: "Divorce",
    description: "I need assistance with filing for divorce and understanding my rights regarding property division.",
    requestedDate: "April 1, 2025",
    status: "pending",
  },
  {
    id: "2",
    attorneyName: "Samuel Tefera",
    specialization: "Corporate Law",
    caseType: "Business Registration",
    description: "I need help with registering my new business and understanding the legal requirements.",
    requestedDate: "March 25, 2025",
    status: "accepted",
    appointmentDate: "April 10, 2025 at 2:00 PM",
  },
  {
    id: "3",
    attorneyName: "Meron Haile",
    specialization: "Real Estate Law",
    caseType: "Property Purchase",
    description: "I needed assistance with reviewing a property purchase agreement and negotiating terms.",
    requestedDate: "February 15, 2025",
    status: "completed",
    completedDate: "March 20, 2025",
  },
  {
    id: "4",
    attorneyName: "Abebe Kebede",
    specialization: "Family Law",
    caseType: "Divorce",
    description: "I need assistance with filing for divorce and understanding my rights regarding property division.",
    requestedDate: "April 1, 2025",
    status: "declined",
    declineReason:
      "The attorney does not handle traffic violation cases. They recommended contacting a specialist in traffic law.",
  },
]

export default function LegalRequestsClient() {
  const [activeTab, setActiveTab] = useState<"all" | RequestStatus>("all")

  // Filter requests based on active tab
  const filteredRequests =
    activeTab === "all" ? sampleRequests : sampleRequests.filter((request) => request.status === activeTab)

  return (
    <>
      {/* Tabs */}
      <div className="border-b border-[#e4e4e7] mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 border-b-2 ${activeTab === "all" ? "border-[#1e2e45] font-medium text-[#1e2e45]" : "border-transparent text-[#71717a] hover:text-[#1e2e45]"}`}
          >
            All Requests
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 border-b-2 ${activeTab === "pending" ? "border-[#1e2e45] font-medium text-[#1e2e45]" : "border-transparent text-[#71717a] hover:text-[#1e2e45]"}`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab("accepted")}
            className={`px-4 py-2 border-b-2 ${activeTab === "accepted" ? "border-[#1e2e45] font-medium text-[#1e2e45]" : "border-transparent text-[#71717a] hover:text-[#1e2e45]"}`}
          >
            Accepted
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 border-b-2 ${activeTab === "completed" ? "border-[#1e2e45] font-medium text-[#1e2e45]" : "border-transparent text-[#71717a] hover:text-[#1e2e45]"}`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab("declined")}
            className={`px-4 py-2 border-b-2 ${activeTab === "declined" ? "border-[#1e2e45] font-medium text-[#1e2e45]" : "border-transparent text-[#71717a] hover:text-[#1e2e45]"}`}
          >
            Declined
          </button>
        </nav>
      </div>

      {/* Request Cards */}
      <div className="space-y-6">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-10 text-[#71717a]">No requests found in this category.</div>
        ) : (
          filteredRequests.map((request) => <RequestCard key={request.id} request={request} />)
        )}
      </div>
    </>
  )
}
