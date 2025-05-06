"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "./navbar copy"
import { DashboardContent } from "@/components/dashboard-content"
import { AttorneyManagement } from "@/components/attorney-management"
import { ClientManagement } from "@/components/client-management"
import { RequestManagement } from "@/components/request-management"
import { ContentManagement } from "@/components/content-management"
import { KnowledgeBase } from "@/components/knowledge-base"
import { Settings } from "@/components/settings"
import { Analytics } from "@/components/analytics"
import { Communications } from "@/components/communications"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-auto">
          {activeTab === "dashboard" && <DashboardContent />}
          {activeTab === "attorney-management" && <AttorneyManagement />}
          {activeTab === "client-management" && <ClientManagement />}
          {activeTab === "request-management" && <RequestManagement />}
          {activeTab === "analytics" && <Analytics view="overview" />}
          {activeTab === "content-management" && <ContentManagement />}
          {/* {activeTab === "communications" && <Communications />} */}
          {activeTab === "knowledge-base" && <KnowledgeBase />}
          {activeTab === "settings" && <Settings />}
        </div>
      </div>
    </div>
  )
}
