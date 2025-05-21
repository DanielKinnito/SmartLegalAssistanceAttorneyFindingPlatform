import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { UserForm } from "@/components/admin-componets/user-form"

export default function CreateUserPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/Admin">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Create User</h1>
      </div>
      <div className="rounded-md border bg-white p-6">
        <UserForm />
      </div>
    </div>
  )
}
