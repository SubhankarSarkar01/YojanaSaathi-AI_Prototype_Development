import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, FileText, Briefcase, TrendingUp } from 'lucide-react'
import { apiClient } from '../../lib/api'
import { toast } from 'sonner'

interface DashboardStats {
  totalSchemes: number
  totalApplications: number
  totalUsers: number
  applicationsByStatus: Array<{ status: string; count: string }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/admin/dashboard/stats')
      if (response.data.status === 'success') {
        setStats(response.data.data)
      }
    } catch (error: any) {
      toast.error('Failed to load dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Schemes</p>
              <p className="text-3xl font-bold text-blue-900">{stats?.totalSchemes || 0}</p>
            </div>
            <Briefcase className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="card bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Applications</p>
              <p className="text-3xl font-bold text-green-900">{stats?.totalApplications || 0}</p>
            </div>
            <FileText className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="card bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Users</p>
              <p className="text-3xl font-bold text-purple-900">{stats?.totalUsers || 0}</p>
            </div>
            <Users className="w-12 h-12 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Applications by Status */}
      {stats?.applicationsByStatus && stats.applicationsByStatus.length > 0 && (
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            Applications by Status
          </h2>
          <div className="space-y-3">
            {stats.applicationsByStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium capitalize">{item.status.replace('_', ' ')}</span>
                <span className="text-2xl font-bold text-primary-600">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link to="/admin/schemes" className="card hover:shadow-lg transition-shadow text-center">
          <Briefcase className="w-12 h-12 text-primary-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Manage Schemes</h3>
          <p className="text-sm text-gray-600">Add, edit, or delete schemes</p>
        </Link>

        <Link to="/admin/applications" className="card hover:shadow-lg transition-shadow text-center">
          <FileText className="w-12 h-12 text-primary-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">View Applications</h3>
          <p className="text-sm text-gray-600">Review all user applications</p>
        </Link>

        <Link to="/admin/users" className="card hover:shadow-lg transition-shadow text-center">
          <Users className="w-12 h-12 text-primary-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Manage Users</h3>
          <p className="text-sm text-gray-600">View and manage all users</p>
        </Link>
      </div>
    </div>
  )
}
