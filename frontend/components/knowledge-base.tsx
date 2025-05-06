import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function KnowledgeBase() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">AI Knowledge Base</h1>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Add Knowledge
        </Button>
      </div>

      <div className="flex items-center justify-center h-64 border rounded-md bg-muted/20">
        <p className="text-muted-foreground">AI Knowledge Base functionality will be implemented here</p>
      </div>
    </div>
  )
}
