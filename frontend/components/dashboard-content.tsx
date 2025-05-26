import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Users, Briefcase, AlertCircle, FileText } from "lucide-react";
import { adminService, UserResponse } from "@/app/services/admin-api";
import { toast } from "react-hot-toast";
import { DashboardChart } from "./dashboard-chart";

interface DashboardStats {
  totalUsers: number;
  attorneys: number;
  pendingApprovals: number;
  activeRequests: number;
}

export function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    attorneys: 0,
    pendingApprovals: 0,
    activeRequests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const users = await adminService.getUserAttorney();

        const stats: DashboardStats = {
          totalUsers: users.length,
          attorneys: users.filter((user) => adminService.isAttorney(user)).length,
          pendingApprovals: users.filter(
            (user) => adminService.isAttorney(user) && !user.User.data.is_approved
          ).length,
          activeRequests: users.filter(
            (user) => adminService.isClient(user) && user.User.data.probono_status === "pending"
          ).length,
        };

        setStats(stats);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Overview of platform metrics and activity
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-10 px-4 gap-2 border-[#29374A] text-[#29374A] hover:bg-[#29374A] hover:text-white transition-colors duration-300 rounded-md"
        >
          <Eye className="h-4 w-4" />
          View Site
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
            <p className="text-xs text-gray-500 mt-1">Total registered users</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Attorneys</CardTitle>
            <Briefcase className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.attorneys}</div>
            <p className="text-xs text-gray-500 mt-1">Registered attorneys</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Approvals</CardTitle>
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.pendingApprovals}</div>
            <p className="text-xs text-gray-500 mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Requests</CardTitle>
            <FileText className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.activeRequests}</div>
            <p className="text-xs text-gray-500 mt-1">Pending pro bono requests</p>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto">
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Platform Activity</CardTitle>
            <p className="text-sm text-gray-500">User activity over the past 30 days</p>
          </CardHeader>
          <CardContent>
            <div className="relative w-full aspect-[4/3] max-w-[1200px] mx-auto p-6">
              <DashboardChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}