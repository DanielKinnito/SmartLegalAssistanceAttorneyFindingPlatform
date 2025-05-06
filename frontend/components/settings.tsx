import { Button } from "@/components/ui/button"

export function Settings() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <Button>Save Changes</Button>
      </div>

      <div className="flex items-center justify-center h-64 border rounded-md bg-muted/20">
        <p className="text-muted-foreground">Settings functionality will be implemented here</p>
      </div>
    </div>
  )
}
