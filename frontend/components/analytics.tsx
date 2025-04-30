"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDown, ArrowUp, Plus } from "lucide-react"
import { UserGrowthChart } from "@/components/charts/user-growth-chart"
import { UserDistributionChart } from "@/components/charts/user-distribution-chart"
import { RequestVolumeChart } from "@/components/charts/request-volume-chart"
import { ChatbotUsageChart } from "@/components/charts/chatbot-usage-chart"

interface AnalyticsProps {
  view: "overview" | "user" | "request" | "content"
}

export function Analytics({ view }: AnalyticsProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground">Monitor platform activity, track metrics, and generate reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1 border-[#29374A] text-[#29374A] hover:bg-[#29374A] hover:text-white"
          >
            <span>Last 30 days</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 border-[#29374A] text-[#29374A] hover:bg-[#29374A] hover:text-white"
          >
            <Plus className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUp className="mr-1 h-3 w-3" />
              <span>+7% period period</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Registrations</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUp className="mr-1 h-3 w-3" />
              <span>+15% from previous</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUp className="mr-1 h-3 w-3" />
              <span>+9% period period</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resource Usage</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,845</div>
            <div className="flex items-center text-xs text-red-500">
              <ArrowDown className="mr-1 h-3 w-3" />
              <span>-3% period period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={view} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="user">User Analytics</TabsTrigger>
          <TabsTrigger value="request">Request Analytics</TabsTrigger>
          <TabsTrigger value="content">Content Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <p className="text-sm text-muted-foreground">Total new registrations over time</p>
              </CardHeader>
              <CardContent className="h-[200px]">
                <UserGrowthChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">Breakdown of users by role and status</p>
              </CardHeader>
              <CardContent className="h-[200px]">
                <UserDistributionChart />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Request Volume</CardTitle>
                <p className="text-sm text-muted-foreground">Legal consultation requests over time</p>
              </CardHeader>
              <CardContent className="h-[200px]">
                <RequestVolumeChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>AI Chatbot Usage</CardTitle>
                <p className="text-sm text-muted-foreground">Interactions with the AI legal assistant</p>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ChatbotUsageChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="user" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <p className="text-sm text-muted-foreground">Total new registrations over time</p>
              </CardHeader>
              <CardContent className="h-[300px]">
                <UserGrowthChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">Breakdown of users by role and status</p>
              </CardHeader>
              <CardContent className="h-[300px]">
                <UserDistributionChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="request" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Request Volume</CardTitle>
                <p className="text-sm text-muted-foreground">Legal consultation requests over time</p>
              </CardHeader>
              <CardContent className="h-[300px]">
                <RequestVolumeChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Request Types</CardTitle>
                <p className="text-sm text-muted-foreground">Distribution of request categories</p>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Request Types Chart Placeholder
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Content Engagement</CardTitle>
                <p className="text-sm text-muted-foreground">User engagement with platform content</p>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Content Engagement Chart Placeholder
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>AI Chatbot Usage</CardTitle>
                <p className="text-sm text-muted-foreground">Interactions with the AI legal assistant</p>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChatbotUsageChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
