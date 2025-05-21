import { UserForm } from "@/components/admin-componets/user-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// This would typically fetch user data from an API
const getUserById = (id: string) => {
  // Mock data based on the provided JSON structure
  return {
    id: id,
    first_name: "John",
    last_name: "Doe",
    email: "anekahiwot@gmail.com",
    role: "client",
    is_attorney_approved: false,
  }
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  const user = getUserById(params.id)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href={`/admin/users/${params.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit User</h1>
      </div>
      <div className="rounded-md border bg-white p-6">
        <UserForm user={user} mode="edit" />
      </div>
    </div>
  )
}
