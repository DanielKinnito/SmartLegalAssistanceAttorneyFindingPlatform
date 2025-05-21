"use client"

import { BarChart3, FileText, Home, LogOut, MessageSquare, Settings, Users, ClipboardCheck, Brain } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utlis"
import logo from '../public/assets/logo.png'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      id: "user-management",
      label: "User Management",
      icon: Users,
      subItems: [
        {
          id: "attorney-management",
          label: "Attorney Management",
        },
        {
          id: "client-management",
          label: "Client Management",
        },
      ],
    },
    {
      id: "request-management",
      label: "Request Management",
      icon: ClipboardCheck,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      id: "content-management",
      label: "Content Management",
      icon: FileText,
    },
   
    // {
    //   id: "knowledge-base",
    //   label: "AI Knowledge Base",
    //   icon: Brain,
    // },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },
  ]

  return (
    <div className="w-64 h-full bg-[#29374A] text-white flex flex-col">
      <div className="p-4 border-b border-gray-700 flex items-center">
        <div className="mr-2">
          <Image src={logo} alt="Logo" width={32} height={32} className="rounded-md" />
        </div>
        <h1 className="text-xl font-semibold">LegalConnect</h1>
      </div>

      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Admin Portal</h2>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex items-center w-full px-4 py-2.5 text-sm rounded-md transition-colors",
                  activeTab === item.id ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white",
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>

              {item.subItems && (
                <ul className="ml-9 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.id}>
                      <button
                        onClick={() => setActiveTab(subItem.id)}
                        className={cn(
                          "flex items-center w-full px-4 py-2 text-sm rounded-md transition-colors",
                          activeTab === subItem.id
                            ? "bg-white/10 text-white"
                            : "text-gray-300 hover:bg-white/5 hover:text-white",
                        )}
                      >
                        {subItem.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button className="flex items-center w-full px-4 py-2 text-sm rounded-md text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  )
}
