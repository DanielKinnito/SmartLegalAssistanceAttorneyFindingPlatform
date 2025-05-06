import Image from "next/image"
import Link from "next/link"
import LegalRequestsClient from "./client"

export default function LegalRequests() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-1">My Legal Requests</h1>
        <p className="text-[#71717a] mb-6">Track and manage your consultation requests with attorneys.</p>

        <LegalRequestsClient />
      </main>
    </div>
  )
}
