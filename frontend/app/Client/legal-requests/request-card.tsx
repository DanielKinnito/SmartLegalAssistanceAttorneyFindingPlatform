"use client"

interface RequestProps {
  request: {
    id: string
    attorneyName: string
    specialization: string
    caseType: string
    description: string
    requestedDate: string
    status: "pending" | "accepted" | "completed" | "declined"
    appointmentDate?: string
    completedDate?: string
    declineReason?: string
  }
}

export function RequestCard({ request }: RequestProps) {
  // Status badge styling based on status
  const statusStyles = {
    pending: "bg-[#fef9c3] text-[#854d0e]",
    accepted: "bg-[#dcfce7] text-[#166534]",
    completed: "bg-[#f3e8ff] text-[#7e22ce]",
    declined: "bg-[#fee2e2] text-[#991b1b]",
  }

  // Status text
  const statusText = {
    pending: "Pending",
    accepted: "Accepted",
    completed: "Completed",
    declined: "Declined",
  }

  return (
    <div className="border border-[#e4e4e7] rounded-lg bg-white overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-[#e4e4e7] rounded-md mr-4"></div>
            <div>
              <h3 className="font-bold text-lg">{request.attorneyName}</h3>
              <p className="text-[#71717a]">{request.specialization}</p>
            </div>
          </div>
          <div className={`${statusStyles[request.status]} px-4 py-1 rounded-full text-sm font-medium`}>
            {statusText[request.status]}
          </div>
        </div>

        <div className="space-y-4 mb-4">
          <div>
            <h4 className="font-medium mb-1">Case Type</h4>
            <p>{request.caseType}</p>
          </div>

          <div>
            <h4 className="font-medium mb-1">Description</h4>
            <p>{request.description}</p>
          </div>

          <div>
            <h4 className="font-medium mb-1">Requested On</h4>
            <p>{request.requestedDate}</p>
          </div>

          {request.appointmentDate && (
            <div>
              <h4 className="font-medium mb-1">Appointment Date</h4>
              <p>{request.appointmentDate}</p>
            </div>
          )}

          {request.completedDate && (
            <div>
              <h4 className="font-medium mb-1">Completed On</h4>
              <p>{request.completedDate}</p>
            </div>
          )}

          {request.declineReason && (
            <div>
              <h4 className="font-medium mb-1">Reason for Decline</h4>
              <p>{request.declineReason}</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex space-x-3">
          <button className="flex-1 py-2 border border-[#e4e4e7] rounded-md text-center">View Attorney</button>

          {request.status === "accepted" && (
            <button className="flex-1 py-2 bg-[#1e2e45] text-white rounded-md text-center">Contact Attorney</button>
          )}

          {request.status === "completed" && (
            <button className="flex-1 py-2 border border-[#e4e4e7] rounded-md text-center">Leave Review</button>
          )}

          {request.status === "declined" && (
            <button className="flex-1 py-2 bg-[#1e2e45] text-white rounded-md text-center">
              Find Another Attorney
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
