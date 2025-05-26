import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { adminService, User, Document, UserResponse } from '@/app/services/admin-api';
// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement);

interface AnalyticsData {
  userRoles: { clients: number; attorneys: number; admins: number };
  proBonoStatus: { pending: number; approved: number; rejected: number };
  documentStats: { total: number; categories: { [key: string]: number } };
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch users and documents
        const [users, documents] = await Promise.all([
          adminService.getUserAttorney(),
          adminService.getDocuments(),
        ]);

        // Process user data
        const userRoles = { clients: 0, attorneys: 0, admins: 0 };
        const proBonoStatus = { pending: 0, approved: 0, rejected: 0 };

        users.forEach((user: UserResponse) => {
          if (adminService.isClient(user)) {
            userRoles.clients++;
            const status = user.User.data.probono_status;
            if (status === 'pending') proBonoStatus.pending++;
            else if (status === 'approved') proBonoStatus.approved++;
            else if (status === 'rejected') proBonoStatus.rejected++;
          } else if (adminService.isAttorney(user)) {
            userRoles.attorneys++;
          } else if (adminService.isAdmin(user)) {
            userRoles.admins++;
          }
        });

        // Process document data
        const documentStats = { total: documents.length, categories: {} as { [key: string]: number } };
        documents.forEach((doc: Document) => {
          documentStats.categories[doc.category] = (documentStats.categories[doc.category] || 0) + 1;
        });

        setAnalyticsData({ userRoles, proBonoStatus, documentStats });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Pie chart for user roles
  const userRoleChartData = {
    labels: ['Clients', 'Attorneys', 'Admins'],
    datasets: [
      {
        data: analyticsData
          ? [analyticsData.userRoles.clients, analyticsData.userRoles.attorneys, analyticsData.userRoles.admins]
          : [0, 0, 0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderWidth: 2,
      },
    ],
  };

  // Bar chart for pro bono status
  const proBonoChartData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        label: 'Pro Bono Status',
        data: analyticsData
          ? [analyticsData.proBonoStatus.pending, analyticsData.proBonoStatus.approved, analyticsData.proBonoStatus.rejected]
          : [0, 0, 0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderWidth: 1,
      },
    ],
  };

  // Bar chart for document categories
  const documentCategoryData = analyticsData ? {
    labels: Object.keys(analyticsData.documentStats.categories),
    datasets: [
      {
        label: 'Documents by Category',
        data: Object.values(analyticsData.documentStats.categories),
        backgroundColor: '#4CAF50',
        borderColor: '#388E3C',
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  } : null;

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { 
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      title: { 
        display: true,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Analytics Dashboard</h1>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Role Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">User Role Distribution</h2>
            <div className="h-64">
              <Pie
                data={userRoleChartData}
                options={{ 
                  ...chartOptions, 
                  plugins: { 
                    ...chartOptions.plugins, 
                    title: { display: true, text: 'User Roles Distribution' } 
                  } 
                }}
              />
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-gray-700">Clients: <span className="font-semibold">{analyticsData.userRoles.clients}</span></p>
              <p className="text-gray-700">Attorneys: <span className="font-semibold">{analyticsData.userRoles.attorneys}</span></p>
              <p className="text-gray-700">Admins: <span className="font-semibold">{analyticsData.userRoles.admins}</span></p>
            </div>
          </div>

          {/* Pro Bono Status */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Pro Bono Status Distribution</h2>
            <div className="h-64">
              <Bar
                data={proBonoChartData}
                options={{ 
                  ...chartOptions, 
                  plugins: { 
                    ...chartOptions.plugins, 
                    title: { display: true, text: 'Pro Bono Status Overview' } 
                  } 
                }}
              />
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-gray-700">Pending: <span className="font-semibold">{analyticsData.proBonoStatus.pending}</span></p>
              <p className="text-gray-700">Approved: <span className="font-semibold">{analyticsData.proBonoStatus.approved}</span></p>
              <p className="text-gray-700">Rejected: <span className="font-semibold">{analyticsData.proBonoStatus.rejected}</span></p>
            </div>
          </div>

          {/* Document Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Document Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-lg font-semibold text-blue-800">Total Documents</p>
                  <p className="text-3xl font-bold text-blue-600">{analyticsData.documentStats.total}</p>
                </div>
                <h3 className="text-lg font-medium mt-4 mb-2 text-gray-700">Documents by Category</h3>
                <div className="h-64">
                  {documentCategoryData && (
                    <Bar
                      data={documentCategoryData}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          title: { display: true, text: 'Document Categories Distribution' }
                        }
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4 text-gray-700">Category Breakdown</h3>
                <div className="space-y-2">
                  {Object.entries(analyticsData.documentStats.categories).map(([category, count]) => (
                    <div key={category} className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                      <span className="text-gray-700">{category}</span>
                      <span className="font-semibold text-blue-600">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;