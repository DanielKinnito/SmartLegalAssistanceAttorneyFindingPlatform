"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "./navbar copy"
import { DashboardContent } from "@/components/dashboard-content"
import { AttorneyManagement } from "@/components/attorney-management"
import { ClientManagement } from "@/components/client-management"
import { RequestManagement } from "@/components/request-management"
import { KnowledgeBase } from "@/components/knowledge-base"
import { Settings } from "@/components/settings"
import { Communications } from "@/components/communications"
import UserManagement from "./all-user-mangement"
import ContentManagement from "@/app/Admin/content-management/page"
import Analytics from "./analytics"
import SettingsPage from "@/app/Admin/settingpage"
import AnalyticsPage from "@/app/Admin/analytics/page"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-auto">
          {activeTab === "dashboard" && <AnalyticsPage />}
          {activeTab === "user-management" && <UserManagement />}
          {activeTab === "attorney-management" && <AttorneyManagement />}
          {activeTab === "client-management" && <ClientManagement />}
          {/* {activeTab === "request-management" && <RequestManagement />} */}
          {activeTab === "analytics" && <Analytics/> }
          {activeTab === "content-management" && <ContentManagement/>}

          {/* {activeTab === "communications" && <Communications />} */}
          {activeTab === "knowledge-base" && <KnowledgeBase />}
          {activeTab === "settings" && <SettingsPage/>}
        </div>
      </div>
    </div>
  )
}
