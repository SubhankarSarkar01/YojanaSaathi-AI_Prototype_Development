import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Clock, CheckCircle, XCircle, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { apiClient } from '../../lib/api'
import { useAuthStore } from '../../store/authStore'

interface Application {
  application_id: string
  scheme_id: string
  status: string
  completion_percentage: number
  created_at: string
  scheme: {
    name_en: string
    name_hi: string
    category: string
  }
}

export default function ApplicationsPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view applications')
      navigate('/auth')
      return
    }
    fetchApplications()
  }, [isAuthenticated])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/applications')
      if (response.data.status === 'success') {
        setApplications(response.data.data)
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Please login to view applications')
        navigate('/auth')
      } else {
        toast.error('Failed to load applications')
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'under_review':
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return <FileText className="w-5 h-5 text-blue-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const classes = {
      approved: 'badge-success',
      rejected: 'badge-error',
      under_review: 'badge-warning',
      submitted: 'badge-info',
      draft: 'badge-info',
    }
    return classes[status as keyof typeof classes] || 'badge-info'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('applications.title')}</h1>
        <Link to="/schemes" className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          {t('applications.newApplication')}
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No applications yet</h3>
          <p className="text-gray-600 mb-6">Start by browsing available schemes and applying</p>
          <Link to="/schemes" className="btn btn-primary">
            Browse Schemes
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const schemeName = i18n.language === 'hi' ? app.scheme.name_hi : app.scheme.name_en
            return (
              <Link
                key={app.application_id}
                to={`/applications/${app.application_id}`}
                className="card hover:shadow-lg transition-shadow block"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(app.status)}
                    <div>
                      <h3 className="text-lg font-semibold">{schemeName}</h3>
                      <p className="text-sm text-gray-600">
                        Applied on {new Date(app.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Completion: {app.completion_percentage}%
                      </p>
                    </div>
                  </div>
                  <span className={`badge ${getStatusBadge(app.status)}`}>
                    {app.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
