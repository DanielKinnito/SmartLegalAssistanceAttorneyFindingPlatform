import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Edit } from "lucide-react"
import { UserDetails } from "@/components/admin-componets/user-details"

// This would typically fetch user data from an API
const getUserById = (id: string) => {
  // Mock data based on the provided JSON structure
  return {
    id: id,
    first_name: "John",
    last_name: "Doe",
    email: "anekahiwot@gmail.com",
    role: "client",
    image: null,
    created_at: "2025-05-17T08:11:50.097202Z",
    updated_at: "2025-05-17T08:11:50.097223Z",
    is_attorney_approved: false,
  }
}

export default function UserPage({ params }: { params: { id: string } }) {
  const user = getUserById(params.id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/users">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>
        <Link href={`/admin/users/${params.id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit User
          </Button>
        </Link>
      </div>
      <div className="rounded-md border bg-white p-6">
        <UserDetails user={user} />
      </div>
    </div>
  )
}
