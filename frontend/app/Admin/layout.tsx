import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./admin.css"

// const inter = Inter({ subsets: ["latin"] })

interface ProBonoApprovalRequest {
  status: "approved" | "rejected";
  rejected_reason?: string;
}

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin interface for managing the application",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
