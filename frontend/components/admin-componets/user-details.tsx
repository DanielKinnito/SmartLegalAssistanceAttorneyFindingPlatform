"use client"

import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface UserDetailsProps {
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
    role: string
    image: string | null
    created_at: string
    updated_at: string
    is_attorney_approved: boolean
  }
}

export function UserDetails({ user }: UserDetailsProps) {
  const [isAttorneyApproved, setIsAttorneyApproved] = useState(user.is_attorney_approved)

  const handleAttorneyApprovalChange = (checked: boolean) => {
    setIsAttorneyApproved(checked)
    // Here you would typically make an API call to update the user
    console.log(`Attorney approval toggled to ${checked} for user ${user.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
          {user.image ? (
            <img
              src={user.image || "/placeholder.svg"}
              alt={`${user.first_name} ${user.last_name}`}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-gray-500">{user.email}</p>
          <div className="mt-1">
            <Badge variant={user.role === "admin" ? "destructive" : user.role === "attorney" ? "default" : "secondary"}>
              {user.role}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium text-gray-500">User ID</h3>
          <p className="mt-1">{user.id}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Created At</h3>
          <p className="mt-1">{new Date(user.created_at).toLocaleString()}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
          <p className="mt-1">{new Date(user.updated_at).toLocaleString()}</p>
        </div>

        {user.role === "attorney" && (
          <div>
            <div className="flex items-center space-x-2">
              <Switch
                id="attorney-approval"
                checked={isAttorneyApproved}
                onCheckedChange={handleAttorneyApprovalChange}
              />
              <Label htmlFor="attorney-approval">Attorney Approved</Label>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
