import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const pendingAttorneys = [
  { id: 1, name: "Attorney Name 1", specialty: "Family Law", initials: "AN" },
  { id: 2, name: "Attorney Name 2", specialty: "Corporate Law", initials: "AN" },
  { id: 3, name: "Attorney Name 3", specialty: "Criminal Defense", initials: "AN" },
  { id: 4, name: "Attorney Name 4", specialty: "Immigration Law", initials: "AN" },
]

export function PendingApprovals() {
  return (
    <div className="space-y-4">
      {pendingAttorneys.map((attorney) => (
        <div key={attorney.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 bg-primary/10">
              <AvatarFallback className="text-xs">{attorney.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{attorney.name}</p>
              <p className="text-xs text-muted-foreground">{attorney.specialty}</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="h-8 bg-black text-white hover:bg-black/80">
            Review
          </Button>
        </div>
      ))}
    </div>
  )
}
