import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronRight } from "lucide-react"

const recentUsers = [
  { id: 1, name: "User Name 1", type: "Client", initials: "UN" },
  { id: 2, name: "User Name 2", type: "Attorney", initials: "UN" },
  { id: 3, name: "User Name 3", type: "Client", initials: "UN" },
  { id: 4, name: "User Name 4", type: "Attorney", initials: "UN" },
  { id: 5, name: "User Name 5", type: "Client", initials: "UN" },
  { id: 6, name: "User Name 6", type: "Client", initials: "UN" },
  { id: 7, name: "User Name 7", type: "Attorney", initials: "UN" },
]

export function RecentRegistrations() {
  return (
    <div className="space-y-4">
      {recentUsers.map((user) => (
        <div key={user.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 bg-primary/10">
              <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.type}</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      ))}
    </div>
  )
}
