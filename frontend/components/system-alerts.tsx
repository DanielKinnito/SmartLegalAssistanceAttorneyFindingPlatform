import { AlertTriangle, FileWarning } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function SystemAlerts() {
  return (
    <div className="space-y-4">
      <Alert variant="default" className="bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertTitle className="text-amber-800 text-sm font-medium">AI knowledge base update required</AlertTitle>
        <AlertDescription className="text-amber-700 text-xs">
          The AI knowledge base needs to be updated with the latest legal precedents.
        </AlertDescription>
        <Button variant="outline" size="sm" className="mt-2 h-7 text-xs w-full">
          Update Knowledge Base
        </Button>
      </Alert>

      <Alert variant="default" className="bg-amber-50">
        <FileWarning className="h-4 w-4 text-amber-500" />
        <AlertTitle className="text-amber-800 text-sm font-medium">Content Review Needed</AlertTitle>
        <AlertDescription className="text-amber-700 text-xs">
          5 content items require review before publishing.
        </AlertDescription>
        <Button variant="outline" size="sm" className="mt-2 h-7 text-xs w-full">
          Review Content
        </Button>
      </Alert>
    </div>
  )
}
